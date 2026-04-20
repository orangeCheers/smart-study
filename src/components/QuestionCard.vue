<template>
  <div class="bg-white rounded-lg shadow-sm border p-3 space-y-1 cursor-pointer active:bg-gray-50 transition-colors">
    <div class="flex items-center justify-between">
      <span class="text-xs text-gray-400">{{ formattedDate }}</span>
      <div v-if="question.mastered" class="text-xs text-green-600 font-medium">已掌握</div>
    </div>
    <p class="text-sm text-gray-800 line-clamp-2">{{ question.questionText }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/utils/date'
import type { Question } from '@/types/question'

const props = defineProps<{ question: Question }>()
const formattedDate = computed(() => formatDate(props.question.createdAt))
</script>