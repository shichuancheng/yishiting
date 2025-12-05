// 环境配置管理
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 根据 NODE_ENV 加载对应的 .env 文件
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;

console.log(`📋 加载环境配置: ${envFile}`);
dotenv.config({ path: path.resolve(__dirname, '..', envFile) });

// 配置对象
const config = {
  // 环境
  env: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  
  // 服务器
  port: parseInt(process.env.PORT || '3000'),
  host: process.env.HOST || '0.0.0.0',
  
  // 数据库
  dbPath: process.env.DB_PATH || './data/chat.db',
  
  // API
  siliconflow: {
    apiKey: process.env.SILICONFLOW_API_KEY,
    baseURL: process.env.SILICONFLOW_BASE_URL || 'https://api.siliconflow.cn/v1'
  },
  
  // 日志
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // 超时设置
  timeout: {
    connect: 30000,
    read: 60000
  }
};

// 验证必需的配置
if (!config.siliconflow.apiKey) {
  console.error('❌ 错误: SILICONFLOW_API_KEY 未配置');
  process.exit(1);
}

// 打印配置信息（开发环境）
if (config.isDev) {
  console.log('🔧 开发环境配置:');
  console.log(`   端口: ${config.port}`);
  console.log(`   数据库: ${config.dbPath}`);
  console.log(`   日志级别: ${config.logLevel}`);
} else {
  console.log('🚀 生产环境配置已加载');
}

export default config;
