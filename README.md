# 智囊团 - AI 决策顾问 Demo

一个让你化身帝王/取经人，由古代名臣或西游师徒帮你解决现实问题的 AI 产品 demo。

## 功能

- **皇帝模式** 👑：诸葛亮、孙武、狄仁杰等谋士轮番上阵
- **西游模式** 🏔️：唐僧师徒四人陪你过关

## 快速启动

### 1. 配置 API Key

```bash
cd backend
cp .env.example .env
# 编辑 .env，填入你的 LinkAI API Key
```

`.env` 文件内容：
```
LINKAI_API_KEY=你的key
LINKAI_BASE_URL=https://api.link-ai.tech/v1
```

### 2. 启动后端

```bash
cd backend
npm install
npm run dev
```

后端运行在 http://localhost:3000

### 3. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端运行在 http://localhost:5173

### 4. 开始使用

打开浏览器访问 http://localhost:5173，选择模式，开始聊天！

## 技术栈

- 前端：Vue 3 + Vite
- 后端：Node.js + Express
- AI：LinkAI API（OpenAI 兼容接口）

## 目录结构

```
├── frontend/          # Vue 前端
│   ├── src/
│   │   ├── App.vue    # 主组件
│   │   └── main.js
│   └── package.json
├── backend/           # Node.js 后端
│   ├── server.js      # API 服务
│   ├── prompts/       # 各模式的 system prompt
│   │   ├── emperor.js # 皇帝模式
│   │   └── xiyou.js   # 西游模式
│   └── package.json
└── README.md
```

## 扩展

想加新模式？只需：
1. 在 `backend/prompts/` 下新建一个 prompt 文件
2. 在 `server.js` 中注册
3. 在 `/api/modes` 接口中添加模式信息
