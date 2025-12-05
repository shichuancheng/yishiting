# 智囊团 - 鸿蒙版

基于 HarmonyOS NEXT 的 AI 多角色对话应用，提供两种模式的智囊团咨询服务。

## 功能特点

- 🏯 **三国谋士团模式**：诸葛亮、孙武、管仲、总管阿宁为你出谋划策
- 🏔️ **西游取经团模式**：唐三藏、孙悟空、猪八戒、沙僧陪你解决烦恼
- 💬 **流式对话**：实时流式输出，体验更流畅
- 🎭 **多角色协作**：AI 导演自动决定角色发言顺序
- 📝 **上下文记忆**：支持多轮对话，保持上下文连贯

## 技术栈

- HarmonyOS NEXT API 12
- ArkTS
- HTTP 网络请求
- SSE (Server-Sent Events) 流式数据处理

## 项目结构

```
frontend/
├── entry/
│   └── src/
│       └── main/
│           ├── ets/
│           │   ├── data/              # 数据配置
│           │   │   └── CharacterData.ets  # 模式配置
│           │   ├── models/            # 数据模型
│           │   │   └── WorldMode.ets
│           │   ├── pages/             # 页面
│           │   │   ├── Index.ets      # 首页
│           │   │   └── ChatPage.ets   # 聊天页
│           │   ├── services/          # 服务层
│           │   │   ├── HttpService.ets    # HTTP 请求
│           │   │   └── AIService.ets      # AI 服务
│           │   └── entryability/
│           ├── resources/             # 资源文件
│           └── module.json5
├── build-profile.json5
└── oh-package.json5
```

## 快速开始

### 1. 环境要求

- DevEco Studio 5.0.0 或更高版本
- HarmonyOS NEXT SDK API 12
- Node.js 16+ (用于后端服务)

### 2. 启动后端服务

```bash
# 进入后端目录
cd ../backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填入你的 API Key

# 启动服务
npm start
```

后端服务将运行在 `http://localhost:3000`

### 3. 运行鸿蒙应用

1. 使用 DevEco Studio 打开 `frontend` 目录
2. 连接鸿蒙设备或启动模拟器
3. 点击运行按钮

### 4. 配置网络权限

确保 `module.json5` 中已添加网络权限：

```json5
{
  "module": {
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      }
    ]
  }
}
```

## API 接口

### POST /api/chat/stream

流式对话接口

**请求体：**
```json
{
  "message": "用户消息",
  "history": [
    { "role": "user", "name": "主公", "content": "..." },
    { "role": "advisor", "name": "诸葛亮", "content": "..." }
  ],
  "mode": "emperor"  // 或 "xiyou"
}
```

**响应：** Server-Sent Events 流

```
data: {"type":"role_start","role":"诸葛亮","avatar":"🧙‍♂️","roleId":"zhuge"}
data: {"type":"content","content":"臣"}
data: {"type":"content","content":"，亮"}
data: {"type":"role_end","roleId":"zhuge"}
data: [DONE]
```

## 开发说明

### 添加新模式

1. 在 `CharacterData.ets` 中添加新的模式配置
2. 在后端 `prompts/` 目录添加对应的角色定义
3. 更新首页的模式卡片

### 自定义样式

修改各页面组件中的颜色和样式常量

### 调试

使用 DevEco Studio 的日志工具查看网络请求和错误信息

## 注意事项

1. **网络配置**：确保设备能访问后端服务地址
2. **模拟器**：如果使用模拟器，后端地址应使用 `10.0.2.2:3000` 而不是 `localhost:3000`
3. **真机调试**：确保手机和电脑在同一局域网，使用电脑的局域网 IP

## 常见问题

### Q: 无法连接后端服务
A: 检查以下几点：
- 后端服务是否正常运行
- 网络权限是否已配置
- IP 地址是否正确（模拟器使用 10.0.2.2，真机使用局域网 IP）

### Q: 消息发送后没有响应
A: 检查：
- 后端日志是否有错误
- API Key 是否配置正确
- 网络请求是否超时

### Q: 流式输出不流畅
A: 这可能是网络延迟导致的，可以：
- 优化网络环境
- 调整 HTTP 请求的超时时间

## License

MIT
