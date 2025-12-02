const API_BASE = '/api'

/**
 * 流式获取群聊回复（支持历史上下文和模式切换）
 * @param {string} message - 用户消息
 * @param {Array} history - 历史消息
 * @param {string} mode - 模式：emperor(三国) 或 xiyou(西游)
 * @param {Object} callbacks - 回调函数
 */
export async function streamChat(message, history, mode, { onRoleStart, onContent, onRoleEnd, onDone, onError }) {
  try {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, mode })
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() // 保留不完整的行

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6)

        if (data === '[DONE]') {
          onDone?.()
          return
        }

        try {
          const parsed = JSON.parse(data)
          switch (parsed.type) {
            case 'role_start':
              onRoleStart?.(parsed)
              break
            case 'content':
              onContent?.(parsed.content)
              break
            case 'role_end':
              onRoleEnd?.(parsed)
              break
            case 'error':
              onError?.(parsed.error)
              return
          }
        } catch (e) {
          // 忽略解析错误
        }
      }
    }
    onDone?.()
  } catch (error) {
    onError?.(error.message || '连接错误')
  }
}
