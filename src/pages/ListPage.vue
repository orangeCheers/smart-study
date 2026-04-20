<template>
  <div class="p-4 space-y-3">
    <div class="flex items-center gap-2">
      <input v-model="searchQuery" placeholder="搜索问题或答案..." class="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-base" />
    </div>

    <div v-if="filteredQuestions.length === 0" class="text-center py-8 text-gray-400 text-sm">
      没有找到错题
    </div>

    <QuestionCard v-for="q in filteredQuestions" :key="q.id" :question="q" @click="selected = q" />

    <!-- Detail overlay -->
    <div v-if="selected" class="fixed inset-0 bg-black/50 z-50 flex items-end" @click.self="selected = null">
      <div class="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto p-4 space-y-3 safe-bottom">
        <div class="flex justify-between items-center">
          <h2 class="text-base font-bold">题目详情</h2>
          <button @click="selected = null" class="text-gray-400 text-lg">✕</button>
        </div>
        <p class="text-sm text-gray-800">{{ selected.questionText }}</p>
        <img v-if="selected.imageUrl" :src="selected.imageUrl" class="w-full rounded-lg max-h-40 object-contain" />
        <AnswerReveal :answer="selected.answerText" />
        <div class="flex gap-2">
          <button @click="handleDelete" class="flex-1 rounded-lg bg-red-100 text-red-700 py-2 text-sm">删除</button>
          <button @click="handleMastered" class="flex-1 rounded-lg bg-green-100 text-green-700 py-2 text-sm">{{ selected.mastered ? '取消掌握' : '标记掌握' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuestions } from '@/composables/useQuestions'
import QuestionCard from '@/components/QuestionCard.vue'
import AnswerReveal from '@/components/AnswerReveal.vue'
import type { Question } from '@/types/question'

const { getAllQuestions, deleteQuestion, markMastered, updateQuestion } = useQuestions()

const questions = ref<Question[]>([])
const searchQuery = ref('')
const selected = ref<Question | null>(null)

const filteredQuestions = computed(() => {
  if (!searchQuery.value.trim()) return questions.value
  const q = searchQuery.value.toLowerCase()
  return questions.value.filter(item =>
    item.questionText.toLowerCase().includes(q) ||
    item.answerText.toLowerCase().includes(q)
  )
})

onMounted(async () => {
  questions.value = await getAllQuestions()
})

async function handleDelete() {
  if (!selected.value) return
  await deleteQuestion(selected.value.id)
  selected.value = null
  questions.value = await getAllQuestions()
}

async function handleMastered() {
  if (!selected.value) return
  if (selected.value.mastered) {
    await updateQuestion(selected.value.id, { mastered: false })
  } else {
    await markMastered(selected.value.id)
  }
  selected.value = null
  questions.value = await getAllQuestions()
}
</script>