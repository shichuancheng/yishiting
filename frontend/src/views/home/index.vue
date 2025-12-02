<template>
  <div class="home">
    <h1 class="main-title">选择你的顾问团</h1>
    <p class="main-subtitle">不同风格，同样帮你解决问题</p>
    
    <div class="mode-cards">
      <!-- 三国模式 -->
      <div class="mode-card" @click="goToChat('emperor')">
        <div class="mode-icon">🏯</div>
        <h2>三国谋士团</h2>
        <p class="mode-desc">化身主公，让名臣为你出谋划策</p>
        <div class="characters">
          <span v-for="char in emperorChars" :key="char" class="character-tag">
            {{ char }}
          </span>
        </div>
        <button class="start-btn emperor">开始问策</button>
      </div>
      
      <!-- 西游模式 -->
      <div class="mode-card" @click="goToChat('xiyou')">
        <div class="mode-icon">🏔️</div>
        <h2>西游取经团</h2>
        <p class="mode-desc">把烦恼当成取经路上的一关</p>
        <div class="characters">
          <span v-for="char in xiyouChars" :key="char" class="character-tag">
            {{ char }}
          </span>
        </div>
        <button class="start-btn xiyou">开始取经</button>
      </div>
    </div>
    
    <div class="features">
      <div class="feature">
        <span class="feature-icon">🎯</span>
        <h3>问题拆解</h3>
        <p>多角色帮你分析问题本质</p>
      </div>
      <div class="feature">
        <span class="feature-icon">💬</span>
        <h3>情绪支持</h3>
        <p>不只给方案，也给你情绪价值</p>
      </div>
      <div class="feature">
        <span class="feature-icon">✅</span>
        <h3>行动清单</h3>
        <p>给出可执行的具体建议</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const emperorChars = ['🧙‍♂️ 诸葛亮', '⚔️ 孙武', '📜 管仲', '👨‍💼 阿宁']
const xiyouChars = ['🧘 唐三藏', '🐵 孙悟空', '🐷 猪八戒', '🏋️ 沙僧']

function goToChat(mode) {
  router.push({ path: '/chat', query: { mode } })
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
}

.main-title {
  font-size: 32px;
  margin: 0 0 8px 0;
  color: #fff;
  text-align: center;
}

.main-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 40px 0;
  text-align: center;
}

.mode-cards {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 60px;
}

.mode-card {
  width: 300px;
  padding: 32px 24px;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.08);
}

.mode-icon { font-size: 56px; margin-bottom: 16px; }

.mode-card h2 {
  font-size: 22px;
  margin: 0 0 8px 0;
  color: #fff;
}

.mode-desc {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 20px 0;
}

.characters {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 24px;
}

.character-tag {
  padding: 4px 10px;
  background: rgba(255,255,255,0.1);
  border-radius: 12px;
  font-size: 12px;
  color: rgba(255,255,255,0.8);
}

.start-btn {
  padding: 12px 32px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-btn.emperor {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.start-btn.xiyou {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.features {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  justify-content: center;
  max-width: 800px;
}

.feature {
  flex: 1;
  min-width: 180px;
  max-width: 220px;
  padding: 20px;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  text-align: center;
}

.feature-icon { font-size: 28px; }
.feature h3 { margin: 10px 0 6px 0; font-size: 15px; color: #fff; }
.feature p { margin: 0; font-size: 12px; color: rgba(255,255,255,0.6); }
</style>
