import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import config from './config/index.js';
import { advisors as emperorAdvisors, directorPrompt as emperorDirector } from './prompts/emperor.js';
import { advisors as xiyouAdvisors, directorPrompt as xiyouDirector } from './prompts/xiyou.js';

// 模式配置
const modes = {
  emperor: { advisors: emperorAdvisors, directorPrompt: emperorDirector },
  xiyou: { advisors: xiyouAdvisors, directorPrompt: xiyouDirector }
};

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const client = new OpenAI({
  apiKey: config.siliconflow.apiKey,
  baseURL: config.siliconflow.baseURL
});

// 让"导演"决定下一个发言者
async function getNextSpeaker(userMessage, chatHistory, availableAdvisors, turnCount, directorPrompt) {
  const advisorList = availableAdvisors.map(a => `- ${a.id}: ${a.name}（${a.expertise}）`).join('\n');
  
  try {
    const response = await client.chat.completions.create({
      model: 'Qwen/Qwen2.5-7B-Instruct',
      messages: [
        { 
          role: 'system', 
          content: directorPrompt + `\n\n可选角色:\n${advisorList}` 
        },
        { 
          role: 'user', 
          content: `用户问题: ${userMessage}\n\n当前对话历史:\n${chatHistory || '(刚开始)'}\n\n已进行${turnCount}轮，请决定下一步。` 
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const text = response.choices[0].message.content;
    console.log(`[导演决定] ${text}`);
    
    // 解析导演的决定
    if (text.includes('[END]') || turnCount >= 4) {
      // 4轮后强制让总结角色收尾（三国模式是阿宁，西游模式是沙僧）
      if (turnCount >= 4) {
        const summarizer = availableAdvisors.find(a => a.id === 'aning' || a.id === 'shaseng');
        if (summarizer) {
          return { action: 'speak', advisor: summarizer, instruction: '请总结以上讨论，列出待办事项', isFinal: true };
        }
      }
      return { action: 'end' };
    }
    
    // 匹配 [SPEAK:xxx] 格式
    const speakMatch = text.match(/\[SPEAK:(\w+)\]/);
    if (speakMatch) {
      const advisorId = speakMatch[1];
      const advisor = availableAdvisors.find(a => a.id === advisorId);
      if (advisor) {
        const instruction = text.replace(/\[SPEAK:\w+\]/, '').trim();
        return { action: 'speak', advisor, instruction };
      }
    }
    
    // 默认：按顺序选下一个没说过话的
    const spokenIds = chatHistory ? chatHistory.split('【').map(s => s.split('】')[0]).filter(Boolean) : [];
    const nextAdvisor = availableAdvisors.find(a => !spokenIds.includes(a.name)) || availableAdvisors[0];
    return { action: 'speak', advisor: nextAdvisor, instruction: '' };
    
  } catch (error) {
    console.error('[导演错误]', error.message);
    // 出错时随机选一个继续
    const randomAdvisor = availableAdvisors[Math.floor(Math.random() * availableAdvisors.length)];
    return { action: 'speak', advisor: randomAdvisor, instruction: '' };
  }
}


// 请求日志中间件（仅开发环境详细日志）
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (config.isDev) {
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
  }
  next();
});

// 健康检查端点
app.get('/health', (req, res) => {
  console.log('✅ 收到健康检查请求');
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: '服务器运行正常'
  });
});

// CORS 预检请求
app.options('*', (req, res) => {
  console.log('✅ 收到 OPTIONS 预检请求');
  res.sendStatus(200);
});

// 群聊接口 - 动态对话模式（支持历史上下文）
app.post('/api/chat/stream', async (req, res) => {
  console.log('=== 收到聊天请求 ===');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  const { message, history = [], mode = 'emperor' } = req.body;
  
  if (!message) {
    console.log('❌ 错误: message 为空');
    return res.status(400).json({ error: 'message is required' });
  }
  
  console.log(`✅ 消息: "${message}", 模式: ${mode}, 历史记录: ${history.length} 条`);

  // 获取对应模式的配置
  const modeConfig = modes[mode] || modes.emperor;
  const { advisors, directorPrompt } = modeConfig;

  console.log('📤 设置响应头...');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();
  console.log('✅ 响应头已发送');

  // 构建之前的对话上下文
  const previousContext = history.map(h => 
    h.role === 'user' ? `【主公】${h.content}` : `【${h.name}】${h.content}`
  ).join('\n');

  try {
    const chatHistory = [];
    const maxTurns = 6;
    let turn = 0;

    while (turn < maxTurns) {
      turn++;
      
      // 1. 让导演决定谁发言
      const currentRoundHistory = chatHistory.map(h => `【${h.name}】${h.content}`).join('\n');
      const userTitle = mode === 'xiyou' ? '施主' : '主公';
      const fullHistory = previousContext ? `${previousContext}\n【${userTitle}】${message}\n${currentRoundHistory}` : currentRoundHistory;
      const decision = await getNextSpeaker(message, fullHistory, advisors, turn, directorPrompt);
      
      if (decision.action === 'end') {
        break;
      }
      
      const shouldEndAfter = decision.isFinal;
      const advisor = decision.advisor;
      
      // 2. 发送角色开始信号
      const roleStartData = {
        type: 'role_start',
        role: advisor.name,
        avatar: advisor.avatar,
        roleId: advisor.id
      };
      console.log(`📢 [轮次${turn}] ${advisor.name} 开始发言`);
      res.write(`data: ${JSON.stringify(roleStartData)}\n\n`);

      // 3. 构建该角色的 prompt
      let systemPrompt = advisor.prompt;
      if (decision.instruction) {
        systemPrompt += `\n\n【导演指示】${decision.instruction}`;
      }

      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `主公的问题: ${message}` }
      ];
      
      // 加入历史上下文
      if (previousContext) {
        messages.push({
          role: 'user',
          content: `之前的对话:\n${previousContext}`
        });
      }
      
      // 加入当前轮次的讨论
      if (currentRoundHistory) {
        messages.push({
          role: 'user',
          content: `本轮讨论:\n${currentRoundHistory}`
        });
      }

      // 4. 流式输出
      const stream = await client.chat.completions.create({
        model: 'Qwen/Qwen2.5-7B-Instruct',
        messages,
        temperature: 0.8,
        max_tokens: 300,
        stream: true
      });

      let fullContent = '';
      
      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta?.content;
        if (delta) {
          fullContent += delta;
          res.write(`data: ${JSON.stringify({
            type: 'content',
            content: delta
          })}\n\n`);
        }
      }

      // 5. 发送角色结束信号
      res.write(`data: ${JSON.stringify({
        type: 'role_end',
        roleId: advisor.id
      })}\n\n`);

      // 6. 记录到对话历史
      chatHistory.push({
        id: advisor.id,
        name: advisor.name,
        content: fullContent
      });
      
      if (shouldEndAfter) {
        break;
      }
    }
    
    console.log('✅ 对话完成，发送 [DONE]');
    res.write('data: [DONE]\n\n');
    res.end();
    
  } catch (error) {
    console.error('❌ Stream error:', error);
    console.error('错误堆栈:', error.stack);
    res.write(`data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`);
    res.end();
  }
});

// 存储会话数据（生产环境应使用 Redis）
const sessions = new Map();

// 创建新会话并开始生成内容
app.post('/api/chat/start', async (req, res) => {
  const { message, history = [], mode = 'emperor' } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }
  
  const sessionId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
  console.log(`📝 创建新会话: ${sessionId}`);
  
  // 初始化会话数据
  sessions.set(sessionId, {
    chunks: [],
    completed: false,
    error: null
  });
  
  // 立即返回会话 ID
  res.json({ sessionId });
  
  // 异步生成内容
  (async () => {
    try {
      const modeConfig = modes[mode] || modes.emperor;
      const { advisors, directorPrompt } = modeConfig;
      
      const previousContext = history.map(h => 
        h.role === 'user' ? `【主公】${h.content}` : `【${h.name}】${h.content}`
      ).join('\n');
      
      const chatHistory = [];
      const maxTurns = 6;
      let turn = 0;
      
      while (turn < maxTurns) {
        turn++;
        
        const currentRoundHistory = chatHistory.map(h => `【${h.name}】${h.content}`).join('\n');
        const userTitle = mode === 'xiyou' ? '施主' : '主公';
        const fullHistory = previousContext ? `${previousContext}\n【${userTitle}】${message}\n${currentRoundHistory}` : currentRoundHistory;
        const decision = await getNextSpeaker(message, fullHistory, advisors, turn, directorPrompt);
        
        if (decision.action === 'end') break;
        
        const advisor = decision.advisor;
        
        // 添加角色开始信号
        sessions.get(sessionId).chunks.push({
          type: 'role_start',
          role: advisor.name,
          avatar: advisor.avatar,
          roleId: advisor.id
        });
        
        let systemPrompt = advisor.prompt;
        if (decision.instruction) {
          systemPrompt += `\n\n【导演指示】${decision.instruction}`;
        }
        
        const messages = [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `主公的问题: ${message}` }
        ];
        
        if (previousContext) {
          messages.push({ role: 'user', content: `之前的对话:\n${previousContext}` });
        }
        
        if (currentRoundHistory) {
          messages.push({ role: 'user', content: `本轮讨论:\n${currentRoundHistory}` });
        }
        
        const stream = await client.chat.completions.create({
          model: 'Qwen/Qwen2.5-7B-Instruct',
          messages,
          temperature: 0.8,
          max_tokens: 300,
          stream: true
        });
        
        let fullContent = '';
        
        for await (const chunk of stream) {
          const delta = chunk.choices?.[0]?.delta?.content;
          if (delta) {
            fullContent += delta;
            sessions.get(sessionId).chunks.push({
              type: 'content',
              content: delta
            });
          }
        }
        
        sessions.get(sessionId).chunks.push({
          type: 'role_end',
          roleId: advisor.id
        });
        
        chatHistory.push({
          id: advisor.id,
          name: advisor.name,
          content: fullContent
        });
        
        if (decision.isFinal) break;
      }
      
      sessions.get(sessionId).completed = true;
      console.log(`✅ 会话完成: ${sessionId}`);
      
    } catch (error) {
      console.error(`❌ 会话错误: ${sessionId}`, error);
      sessions.get(sessionId).error = error.message;
      sessions.get(sessionId).completed = true;
    }
  })();
});

// 轮询获取新内容
app.get('/api/chat/poll/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const { lastIndex = 0 } = req.query;
  
  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  
  const startIndex = parseInt(lastIndex);
  const newChunks = session.chunks.slice(startIndex);
  
  res.json({
    chunks: newChunks,
    nextIndex: session.chunks.length,
    completed: session.completed,
    error: session.error
  });
  
  // 会话完成后 5 分钟清理
  if (session.completed) {
    setTimeout(() => {
      sessions.delete(sessionId);
      console.log(`🗑️ 清理会话: ${sessionId}`);
    }, 5 * 60 * 1000);
  }
});

app.listen(config.port, config.host, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`🚀 服务器启动成功`);
  console.log(`   环境: ${config.env}`);
  console.log(`   地址: http://${config.host}:${config.port}`);
  console.log(`   本地: http://localhost:${config.port}`);
  console.log(`   模拟器: http://10.0.2.2:${config.port}`);
  console.log(`   数据库: ${config.dbPath}`);
  console.log(`${'='.repeat(50)}\n`);
});
