import { ref } from 'vue'
import { streamChat } from '@/api/chat'

export function useChat(mode = 'emperor') {
  const messages = ref([])
  const loading = ref(false)
  const currentMode = ref(mode)
  let currentMessageIndex = -1

  function sendMessage(text) {
    if (!text.trim() || loading.value) return

    // 添加用户消息
    messages.value.push({
      type: 'user',
      content: text
    })

    loading.value = true

    // 构建历史上下文（简化格式传给后端）
    const userTitle = currentMode.value === 'xiyou' ? '施主' : '主公'
    const history = messages.value.slice(0, -1).map(m => ({
      role: m.type === 'user' ? 'user' : 'advisor',
      name: m.role || userTitle,
      content: m.content
    }))

    streamChat(text, history, currentMode.value, {
      onRoleStart: (data) => {
        messages.value.push({
          type: 'advisor',
          role: data.role,
          avatar: data.avatar,
          roleId: data.roleId,
          content: ''
        })
        currentMessageIndex = messages.value.length - 1
      },
      
      onContent: (content) => {
        if (currentMessageIndex >= 0) {
          messages.value[currentMessageIndex].content += content
        }
      },
      
      onRoleEnd: () => {
        currentMessageIndex = -1
      },
      
      onDone: () => {
        loading.value = false
        currentMessageIndex = -1
      },
      
      onError: (error) => {
        messages.value.push({
          type: 'system',
          content: `出错了：${error}`
        })
        loading.value = false
        currentMessageIndex = -1
      }
    })
  }

  function clearMessages() {
    messages.value = []
  }

  function setMode(newMode) {
    currentMode.value = newMode
  }

  return {
    messages,
    loading,
    currentMode,
    sendMessage,
    clearMessages,
    setMode
  }
}
