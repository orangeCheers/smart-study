<template>
  <div class="p-4 space-y-4 flex flex-col items-center">
    <h1 class="text-lg font-bold text-gray-900">复习错题</h1>

    <div v-if="questions.length === 0" class="text-center py-12 text-gray-400 text-sm">
      没有需要复习的错题
    </div>

    <template v-else>
      <p class="text-sm text-gray-500">{{ currentIndex + 1 }} / {{ questions.length }}</p>

      <div class="w-full rounded-xl bg-white shadow-md p-4 space-y-3">
        <p class="text-sm text-gray-800">{{ currentQuestion.questionText }}</p>
        <img v-if="currentQuestion.imageUrl" :src="currentQuestion.imageUrl" class="w-full rounded-lg max-h-40 object-contain" />
      </div>

      <AnswerReveal v-if="revealed" :answer="currentQuestion.answerText" />

      <div class="w-full space-y-2">
        <button v-if="!revealed" @click="revealed = true" class="w-full rounded-xl bg-indigo-600 text-white py-3 font-medium">
          查看答案
        </button>
        <template v-else>
          <button @click="handleGotIt" class="w-full rounded-xl bg-green-600 text-white py-2.5 text-sm font-medium">
            我会了
          </button>
          <button @click="handleConfused" class="w-full rounded-xl bg-orange-500 text-white py-2.5 text-sm font-medium">
            还是不会
          </button>
        </template>
        <button v-if="currentIndex > 0" @click="prev" class="w-full rounded-xl bg-gray-200 text-gray-700 py-2 text-sm">
          上一题
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuestions } from '@/composables/useQuestions'
import AnswerReveal from '@/components/AnswerReveal.vue'
import type { Question } from '@/types/question'

const { getAllQuestions, incrementReview, markMastered } = useQuestions()
const questions = ref<Question[]>([])
const currentIndex = ref(0)
const revealed = ref(false)

const currentQuestion = computed(() => questions.value[currentIndex.value])

onMounted(async () => {
  const all = await getAllQuestions()
  questions.value = all.filter(q => !q.mastered)
})

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
  revealed.value = false
}

async function handleGotIt() {
  await incrementReview(currentQuestion.value.id)
  if (currentQuestion.value.reviewCount + 1 >= 3) {
    await markMastered(currentQuestion.value.id)
  }
  next()
}

async function handleConfused() {
  await incrementReview(currentQuestion.value.id)
  next()
}

function next() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    revealed.value = false
  } else {
    questions.value = []
    currentIndex.value = 0
  }
}
</script>