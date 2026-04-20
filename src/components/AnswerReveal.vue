<template>
  <div class="space-y-3">
    <button @click="revealed = true" v-if="!revealed" class="w-full rounded-lg bg-indigo-600 text-white py-2.5 text-sm font-medium">
      点击揭晓答案
    </button>
    <div v-else class="space-y-2 animate-fade-in">
      <div class="rounded-lg bg-green-50 p-3">
        <p class="text-xs font-medium text-green-700 mb-1">标准答案</p>
        <p class="text-sm text-gray-800">{{ answer }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ answer: string }>()
const revealed = ref(false)
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>