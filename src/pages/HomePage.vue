<template>
  <div class="p-4 space-y-4">
    <h1 class="text-xl font-bold text-gray-900">Smart Study</h1>

    <div class="grid grid-cols-2 gap-3">
      <div class="rounded-xl bg-indigo-50 p-3">
        <p class="text-xs text-indigo-600">总错题</p>
        <p class="text-2xl font-bold text-indigo-700">{{ totalCount }}</p>
      </div>
      <div class="rounded-xl bg-green-50 p-3">
        <p class="text-xs text-green-600">已掌握</p>
        <p class="text-2xl font-bold text-green-700">{{ masteredCount }}</p>
      </div>
    </div>

    <button @click="$router.push('/review')" class="w-full rounded-xl bg-indigo-600 text-white py-3 font-medium text-base">
      开始复习
    </button>

    <div class="space-y-2">
      <h2 class="text-sm font-semibold text-gray-700">最近录入</h2>
      <div v-if="recent.length === 0" class="text-center py-8 text-gray-400 text-sm">
        还没有错题，点击底部"录入"开始添加
      </div>
      <QuestionCard v-for="q in recent" :key="q.id" :question="q" @click="$router.push('/list')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuestions } from '@/composables/useQuestions'
import QuestionCard from '@/components/QuestionCard.vue'
import type { Question } from '@/types/question'

const { getRecentQuestions, getCount, getMasteredCount } = useQuestions()
const recent = ref<Question[]>([])
const totalCount = ref(0)
const masteredCount = ref(0)

onMounted(async () => {
  recent.value = await getRecentQuestions(5)
  totalCount.value = await getCount()
  masteredCount.value = await getMasteredCount()
})
</script>