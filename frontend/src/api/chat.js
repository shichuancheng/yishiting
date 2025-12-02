import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 60000
})

export async function sendMessage(message, history = []) {
  const res = await api.post('/chat', {
    message,
    mode: 'emperor',
    history
  })
  return res.data
}
