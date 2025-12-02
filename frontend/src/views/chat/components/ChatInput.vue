<template>
  <footer class="input-area">
    <textarea
      v-model="inputText"
      placeholder="主公有何烦恼..."
      @keydown.enter.exact.prevent="handleSend"
      :disabled="disabled"
      rows="1"
    ></textarea>
    <button @click="handleSend" :disabled="disabled || !inputText.trim()">
      发送
    </button>
  </footer>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['send'])

const inputText = ref('')

function handleSend() {
  const text = inputText.value.trim()
  if (!text || props.disabled) return
  emit('send', text)
  inputText.value = ''
}
</script>

<style scoped>
.input-area {
  padding: 16px 24px;
  background: rgba(255,255,255,0.05);
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  gap: 12px;
}

.input-area textarea {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.05);
  color: #fff;
  border-radius: 12px;
  resize: none;
  font-size: 15px;
  font-family: inherit;
  outline: none;
}

.input-area textarea:focus { border-color: #667eea; }
.input-area textarea::placeholder { color: rgba(255,255,255,0.4); }

.input-area button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: #fff;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
}

.input-area button:disabled { opacity: 0.5; cursor: not-allowed; }
.input-area button:not(:disabled):hover { opacity: 0.9; }
</style>
