import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { systemPrompt as emperorPrompt } from './prompts/emperor.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 硅基流动 API（OpenAI 兼容接口）
const client = new OpenAI({
  apiKey: process.env.SILICONFLOW_API_KEY,
  baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'
});

// 模式对应的 system prompt
const modePrompts = {
  emperor: emperorPrompt
};

// 聊天接口
app.post('/api/chat', async (req, res) => {
  try {
    const { message, mode = 'emperor', history = [] } = req.body;
    
    const systemPrompt = modePrompts[mode] || modePrompts.emperor;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      ...history,
      { role: 'user', content: message }
    ];

    const completion = await client.chat.completions.create({
      model: 'Qwen/Qwen2.5-7B-Instruct', // 硅基流动免费模型
      messages,
      temperature: 0.8,
      max_tokens: 2000
    });

    const reply = completion.choices[0].message.content;
    
    res.json({
      success: true,
      reply,
      mode
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取可用模式
app.get('/api/modes', (req, res) => {
  res.json({
    modes: [
      {
        id: 'emperor',
        name: '三国谋士团',
        icon: '👑',
        description: '化身主公，让三国名臣为你出谋划策',
        characters: ['总管·阿宁', '军师·诸葛亮', '兵法家·孙武', '断案官·狄仁杰']
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
