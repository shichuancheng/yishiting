<template>
  <header class="header">
    <button class="back-btn" @click="$emit('back')">
      ← 返回
    </button>
    <div class="title-area">
      <h1>👑 三国谋士团</h1>
      <span class="subtitle">化身主公，让名臣为你出谋划策</span>
    </div>
    <div class="placeholder"></div>
  </header>
</template>

<script setup>
defineEmits(['back'])
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
  width: 60px;
}
</style>
