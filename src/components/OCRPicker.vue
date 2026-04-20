<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-gray-700">选择照片</label>
    <input type="file" accept="image/*" @change="handleFile" class="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700" />
    <div v-if="previewUrl" class="relative">
      <img :src="previewUrl" class="w-full rounded-lg max-h-60 object-contain" />
      <button @click="clearPreview" class="absolute top-2 right-2 bg-black/50 text-white rounded-full w-6 h-6 text-xs">×</button>
    </div>
    <div v-if="ocrStatus === 'running'" class="text-center py-4 text-indigo-600 text-sm">
      正在识别文字...
    </div>
    <button v-if="previewUrl && ocrStatus !== 'running'" @click="runOCR" class="w-full rounded-lg bg-indigo-600 text-white py-2 text-sm">
      识别文字
    </button>
    <div class="text-xs text-gray-400 mt-2">
      iOS用户可直接在照片App中复制文字(Live Text)，然后粘贴到题目输入框
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOCR } from '@/composables/useOCR'
import { compressImage } from '@/utils/compress'

const emit = defineEmits<{
  captured: [data: { text: string; image?: string }]
}>()

const previewUrl = ref('')
const rawFile = ref<File | null>(null)
const ocrStatus = ref<'idle' | 'running' | 'done'>('idle')
const { recognize } = useOCR()

function handleFile(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  rawFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  ocrStatus.value = 'idle'
}

function clearPreview() {
  previewUrl.value = ''
  rawFile.value = null
  ocrStatus.value = 'idle'
}

async function runOCR() {
  if (!rawFile.value) return
  ocrStatus.value = 'running'
  try {
    const compressed = await compressImage(rawFile.value)
    const result = await recognize(compressed)
    emit('captured', { text: result.text, image: compressed })
  } catch {
    emit('captured', { text: '' })
  }
  ocrStatus.value = 'done'
}
</script>