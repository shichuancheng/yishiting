<template>
  <div class="chat-page">
    <ChatHeader @back="goBack" />
    
    <main class="chat-container">
      <WelcomePanel 
        v-if="messages.length === 0" 
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
      @send="handleSend" 
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import ChatHeader from './components/ChatHeader.vue'
import WelcomePanel from './components/WelcomePanel.vue'
import MessageList from './components/MessageList.vue'
import ChatInput from './components/ChatInput.vue'
import { useChat } from '@/hooks/useChat'

const router = useRouter()
const { messages, loading, sendMessage } = useChat()

function handleSend(text) {
  sendMessage(text)
}

function handleExample(question) {
  sendMessage(question)
}

function goBack() {
  router.push('/')
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
