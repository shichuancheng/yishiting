<template>
  <div class="welcome">
    <div class="welcome-icon">🏯</div>
    <h2>主公驾到</h2>
    <p>有何烦心事，尽管道来，谋士团随时听候差遣</p>
    
    <div class="examples">
      <p class="examples-title">试试问：</p>
      <button 
        v-for="example in examples" 
        :key="example.text"
        @click="$emit('select', example.question)"
      >
        {{ example.text }}
      </button>
    </div>
  </div>
</template>

<script setup>
defineEmits(['select'])

const examples = [
  { text: '工作不爽又走不了', question: '我在公司干得不爽，但暂时跳槽无门，怎么办？' },
  { text: '领导老改需求', question: '领导总是临时改需求，我很烦' },
  { text: '犹豫要不要跳槽', question: '想跳槽但又怕新公司不稳定' }
]
</script>

<style scoped>
.welcome {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px 20px;
}

.welcome-icon { font-size: 64px; margin-bottom: 16px; }
.welcome h2 { font-size: 24px; margin: 0 0 8px 0; color: #fff; }
.welcome p { color: rgba(255,255,255,0.6); margin: 0 0 32px 0; }

.examples { text-align: center; }
.examples-title { 
  font-size: 13px; 
  color: rgba(255,255,255,0.5); 
  margin: 0 0 12px 0; 
}

.examples button {
  margin: 4px;
  padding: 8px 16px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.examples button:hover {
  background: rgba(255,255,255,0.2);
}
</style>
