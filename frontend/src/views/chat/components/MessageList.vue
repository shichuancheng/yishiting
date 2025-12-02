<template>
  <div class="messages" ref="containerRef">
    <div 
      v-for="(msg, idx) in messages" 
      :key="idx" 
      :class="['message', msg.role]"
    >
      <div class="message-content" v-html="formatMessage(msg.content)"></div>
    </div>
    
    <div v-if="loading" class="message assistant">
      <div class="message-content loading">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { formatMessage } from '@/utils/format'

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
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.message {
  max-width: 85%;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message.user { align-self: flex-end; }
.message.assistant { align-self: flex-start; }

.message-content {
  padding: 14px 18px;
  border-radius: 16px;
  line-height: 1.6;
  font-size: 15px;
  color: #fff;
}

.message.user .message-content {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-bottom-right-radius: 4px;
}

.message.assistant .message-content {
  background: rgba(255,255,255,0.1);
  border-bottom-left-radius: 4px;
}

.message-content :deep(.role-tag) {
  color: #ffd700;
  font-weight: 600;
  margin: 16px 0 8px 0;
  font-size: 14px;
}

.message-content :deep(.role-tag:first-child) { margin-top: 0; }
.message-content :deep(.emoji) { margin-right: 4px; }

.loading {
  display: flex;
  gap: 4px;
  padding: 16px 20px !important;
}

.dot {
  width: 8px;
  height: 8px;
  background: rgba(255,255,255,0.5);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) { animation-delay: -0.32s; }
.dot:nth-child(2) { animation-delay: -0.16s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
}

.messages::-webkit-scrollbar { width: 6px; }
.messages::-webkit-scrollbar-track { background: transparent; }
.messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
</style>
