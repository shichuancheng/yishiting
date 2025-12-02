<template>
  <header class="header">
    <button class="back-btn" @click="$emit('back')">
      ← 返回
    </button>
    <div class="title-area">
      <h1>{{ icon }} {{ title }}</h1>
      <span class="subtitle">{{ subtitle }}</span>
    </div>
    <button 
      v-if="hasMessages" 
      class="copy-btn" 
      @click="handleCopy"
      :class="{ copied }"
    >
      {{ copied ? '✓ 已复制' : '📋 复制' }}
    </button>
    <div v-else class="placeholder"></div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, default: '三国谋士团' },
  hasMessages: { type: Boolean, default: false }
})

const emit = defineEmits(['back', 'copy'])

const copied = ref(false)

const isXiyou = computed(() => props.title.includes('西游'))

function handleCopy() {
  emit('copy')
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2000)
}

const icon = computed(() => isXiyou.value ? '🏔️' : '👑')

const subtitle = computed(() => 
  isXiyou.value 
    ? '把烦恼当成取经路上的一关，师徒四人陪你过' 
    : '化身主公，让名臣为你出谋划策'
)
</script>

<style scoped>
.header {
  padding: 16px 24px;
  background: rgba(255,255,255,0.05);
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title-area {
  text-align: center;
  flex: 1;
}

.header h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 2px 0;
  color: #fff;
}

.subtitle {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
}

.back-btn {
  padding: 8px 12px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.2s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.2);
}

.placeholder {
  width: 70px;
}

.copy-btn {
  padding: 8px 12px;
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  min-width: 70px;
}

.copy-btn:hover {
  background: rgba(255,255,255,0.2);
}

.copy-btn.copied {
  background: rgba(76, 175, 80, 0.3);
  color: #81c784;
}
</style>
