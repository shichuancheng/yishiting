<template>
  <div class="home">
    <div class="hero">
      <div class="hero-icon">🏯</div>
      <h1>三国谋士团</h1>
      <p class="tagline">化身主公，让名臣为你出谋划策</p>
      
      <div class="characters">
        <span v-for="char in characters" :key="char" class="character-tag">
          {{ char }}
        </span>
      </div>
      
      <button class="start-btn" @click="goToChat">
        开始问策
      </button>
    </div>
    
    <div class="features">
      <div class="feature">
        <span class="feature-icon">🎯</span>
        <h3>问题拆解</h3>
        <p>谋士团帮你分析问题本质</p>
      </div>
      <div class="feature">
        <span class="feature-icon">📜</span>
        <h3>引经据典</h3>
        <p>用古人智慧解决现代难题</p>
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

const characters = [
  '🧙‍♂️ 诸葛亮',
  '⚔️ 孙武',
  '🔍 狄仁杰',
  '👨‍💼 总管阿宁'
]

function goToChat() {
  router.push('/chat')
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.hero {
  text-align: center;
  margin-bottom: 60px;
}

.hero-icon { font-size: 80px; margin-bottom: 20px; }

.hero h1 {
  font-size: 36px;
  margin: 0 0 12px 0;
  background: linear-gradient(135deg, #ffd700 0%, #ffaa00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  font-size: 18px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 24px 0;
}

.characters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 32px;
}

.character-tag {
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  font-size: 14px;
}

.start-btn {
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.start-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
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
  min-width: 200px;
  max-width: 240px;
  padding: 24px;
  background: rgba(255,255,255,0.05);
  border-radius: 16px;
  text-align: center;
}

.feature-icon { font-size: 32px; }
.feature h3 { margin: 12px 0 8px 0; font-size: 16px; }
.feature p { margin: 0; font-size: 13px; color: rgba(255,255,255,0.6); }
</style>
