import { ref } from 'vue'
import { sendMessage as apiSendMessage } from '@/api/chat'

export function useChat() {
  const messages = ref([])
  const loading = ref(false)

  async function sendMessage(text) {
    if (!text.trim() || loading.value) return false

    messages.value.push({ role: 'user', content: text })
    loading.value = true

    try {
      const history = messages.value.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await apiSendMessage(text, history)

      if (res.success) {
        messages.value.push({ role: 'assistant', content: res.reply })
        return true
      } else {
        messages.value.push({ role: 'assistant', content: '抱歉，出了点问题，请稍后再试。' })
        return false
      }
    } catch (e) {
      console.error('Send error:', e)
      messages.value.push({ role: 'assistant', content: '网络错误，请检查后端服务是否启动。' })
      return false
    } finally {
      loading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
  }

  return {
    messages,
    loading,
    sendMessage,
    clearMessages
  }
}
