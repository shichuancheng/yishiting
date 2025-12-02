<template>
  <div class="messages" ref="containerRef">
    <div 
      v-for="(msg, idx) in messages" 
      :key="idx" 
      :class="['message', msg.type]"
    >
      <!-- 用户消息 -->
      <template v-if="msg.type === 'user'">
        <div class="user-bubble">
          <div class="content">{{ msg.content }}</div>
        </div>
      </template>
      
      <!-- 谋士消息 -->
      <template v-else-if="msg.type === 'advisor'">
        <div class="advisor-message">
          <div class="avatar">{{ msg.avatar }}</div>
          <div class="bubble">
            <div class="role-name">{{ msg.role }}</div>
            <div class="content">{{ msg.content }}</div>
          </div>
        </div>
      </template>
      
      <!-- 系统消息 -->
      <template v-else-if="msg.type === 'system'">
        <div class="system-message">{{ msg.content }}</div>
      </template>
    </div>
    
    <!-- 加载中 -->
    <div v-if="loading" class="message advisor">
      <div class="advisor-message">
        <div class="avatar">💭</div>
        <div class="bubble">
          <div class="loading-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  messages: { type: Array, required: true },
  loading: { type: Boolean, default: false }
})

const containerRef = ref(null)

watch(
  () => [props.messages.length, props.loading],
  async () => {
    await nextTick()
    if (containerRef.value) {
      containerRef.value.scrollTop = containerRef.value.scrollHeight
    }
  }
)
</script>

<style scoped>
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 用户消息 - 右侧 */
.message.user {
  align-self: flex-end;
}

.user-bubble {
  max-width: 70%;
}

.user-bubble .content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  padding: 12px 16px;
  border-radius: 18px 18px 4px 18px;
  font-size: 15px;
  line-height: 1.5;
}

/* 谋士消息 - 左侧 */
.message.advisor {
  align-self: flex-start;
  max-width: 85%;
}

.advisor-message {
  display: flex;
  gap: 10px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.avatar {
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.bubble {
  background: rgba(255,255,255,0.1);
  border-radius: 4px 18px 18px 18px;
  padding: 12px 16px;
  min-width: 100px;
}

.role-name {
  font-size: 12px;
  color: #ffd700;
  font-weight: 600;
  margin-bottom: 6px;
}

.bubble .content {
  font-size: 15px;
  line-height: 1.6;
  color: #fff;
  white-space: pre-wrap;
}

/* 系统消息 */
.system-message {
  align-self: center;
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  background: rgba(255,255,255,0.05);
  padding: 6px 12px;
  border-radius: 12px;
}

/* 加载动画 */
.loading-dots {
  display: flex;
  gap: 4px;
  padding: 4px 0;
}

.loading-dots span {
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) { animation-delay: -0.32s; }
.loading-dots span:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

/* 滚动条 */
.messages::-webkit-scrollbar { width: 6px; }
.messages::-webkit-scrollbar-track { background: transparent; }
.messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
</style>
