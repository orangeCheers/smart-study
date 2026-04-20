<template>
  <div class="p-4 space-y-4">
    <h1 class="text-lg font-bold text-gray-900">录入错题</h1>

    <div class="flex rounded-lg bg-gray-100 p-1">
      <button @click="mode = 'text'" :class="mode === 'text' ? 'bg-white shadow-sm' : ''" class="flex-1 rounded-md py-2 text-sm font-medium transition-all">
        文字输入
      </button>
      <button @click="mode = 'photo'" :class="mode === 'photo' ? 'bg-white shadow-sm' : ''" class="flex-1 rounded-md py-2 text-sm font-medium transition-all">
        拍照识别
      </button>
    </div>

    <!-- Photo mode -->
    <div v-if="mode === 'photo'" class="space-y-2">
      <label class="text-sm font-medium text-gray-700">拍照/选图</label>
      <OCRPicker @captured="handleCaptured" />
    </div>

    <!-- Question text -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">问题</label>
      <textarea v-model="questionText" rows="4" placeholder="输入或粘贴问题内容" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-base resize-none"></textarea>
    </div>

    <!-- Answer -->
    <div class="space-y-1">
      <label class="text-sm font-medium text-gray-700">标准答案</label>
      <textarea v-model="answerText" rows="3" placeholder="输入正确答案" class="w-full rounded-lg border border-gray-300 px-3 py-2 text-base resize-none"></textarea>
    </div>

    <button @click="handleSave" :disabled="!canSave" class="w-full rounded-xl bg-indigo-600 text-white py-3 font-medium text-base disabled:bg-gray-300 disabled:text-gray-500">
      保存
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuestions } from '@/composables/useQuestions'
import OCRPicker from '@/components/OCRPicker.vue'

const router = useRouter()
const { addQuestion } = useQuestions()

const mode = ref<'text' | 'photo'>('text')
const questionText = ref('')
const answerText = ref('')
const imageUrl = ref<string | undefined>()

const canSave = computed(() => questionText.value.trim() && answerText.value.trim())

function handleCaptured(data: { text: string; image?: string }) {
  questionText.value = data.text
  imageUrl.value = data.image
}

async function handleSave() {
  if (!canSave.value) return
  await addQuestion({
    questionText: questionText.value,
    answerText: answerText.value,
    imageUrl: imageUrl.value || undefined
  })
  router.push('/')
}
</script>