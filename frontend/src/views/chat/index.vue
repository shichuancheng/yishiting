<template>
  <div class="chat-page">
    <ChatHeader 
      :title="modeTitle" 
      :has-messages="messages.length > 0"
      @back="goBack" 
      @copy="handleCopy"
    />
    
    <main class="chat-container">
      <WelcomePanel 
        v-if="messages.length === 0" 
        :mode="currentMode"
        @select="handleExample" 
      />
      <MessageList 
        v-else 
        :messages="messages" 
        :loading="loading" 
      />
    </main>
    
    <ChatInput 
      :disabled="loading" 
      :placeholder="inputPlaceholder"
      @send="handleSend" 
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import ChatHeader from './components/ChatHeader.vue'
import WelcomePanel from './components/WelcomePanel.vue'
import MessageList from './components/MessageList.vue'
import ChatInput from './components/ChatInput.vue'
import { useChat } from '@/hooks/useChat'

const router = useRouter()
const route = useRoute()

// 从路由获取模式
const mode = route.query.mode || 'emperor'
const { messages, loading, currentMode, sendMessage } = useChat(mode)

const modeTitle = computed(() => {
  return currentMode.value === 'xiyou' ? '西游取经团' : '三国谋士团'
})

const inputPlaceholder = computed(() => {
  return currentMode.value === 'xiyou' ? '施主有何烦恼？' : '主公有何吩咐？'
})

function handleSend(text) {
  sendMessage(text)
}

function handleExample(question) {
  sendMessage(question)
}

function goBack() {
  router.push('/')
}

// 复制所有对话
function handleCopy() {
  const userTitle = currentMode.value === 'xiyou' ? '施主' : '主公'
  const text = messages.value.map(m => {
    if (m.type === 'user') {
      return `【${userTitle}】${m.content}`
    } else if (m.type === 'advisor') {
      return `【${m.role}】${m.content}`
    }
    return m.content
  }).join('\n\n')
  
  navigator.clipboard.writeText(text).catch(() => {
    // fallback for older browsers
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
  })
}
</script>

<style scoped>
.chat-page {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
