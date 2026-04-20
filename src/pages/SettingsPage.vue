<template>
  <div class="p-4 space-y-4">
    <h1 class="text-lg font-bold text-gray-900">设置</h1>

    <section class="space-y-2">
      <h2 class="text-sm font-semibold text-gray-700">OCR识别模式</h2>
      <div class="space-y-1">
        <label v-for="option in ocrOptions" :key="option.value" class="flex items-center gap-2 p-2 rounded-lg" :class="currentMode === option.value ? 'bg-indigo-50' : ''">
          <input type="radio" :value="option.value" v-model="currentMode" @change="handleOCRChange" />
          <div>
            <p class="text-sm font-medium">{{ option.label }}</p>
            <p class="text-xs text-gray-500">{{ option.desc }}</p>
          </div>
        </label>
      </div>
    </section>

    <section class="space-y-2">
      <h2 class="text-sm font-semibold text-gray-700">数据管理</h2>
      <button @click="handleExportAll" class="w-full rounded-lg bg-gray-100 py-2.5 text-sm text-gray-700">
        导出所有错题为PDF
      </button>
      <button @click="handleDeleteMastered" class="w-full rounded-lg bg-red-50 py-2.5 text-sm text-red-700">
        删除已掌握的错题
      </button>
      <button @click="handleClearAll" class="w-full rounded-lg bg-red-50 py-2.5 text-sm text-red-600">
        清空所有数据
      </button>
    </section>

    <section class="space-y-2">
      <h2 class="text-sm font-semibold text-gray-700">安装说明</h2>
      <p class="text-xs text-gray-500">在iOS Safari中：</p>
      <p class="text-xs text-gray-500">1. 点击底部分享按钮</p>
      <p class="text-xs text-gray-500">2. 选择"添加到主屏幕"</p>
      <p class="text-xs text-gray-500">3. 点击"添加"即可像App一样使用</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useOCR } from '@/composables/useOCR'
import { useQuestions } from '@/composables/useQuestions'

const { mode, setMode: setOCRMode } = useOCR()
const { getAllQuestions } = useQuestions()

const currentMode = ref<string>(mode.value)
const ocrOptions = [
  { value: 'native-paste', label: 'iOS原生粘贴', desc: '在照片App复制Live Text后粘贴，最快最省资源' },
  { value: 'tesseract', label: 'Tesseract.js (离线)', desc: '本地WASM识别，无需联网，约6MB初始加载' },
  { value: 'ocrspace', label: 'OCR.space (在线)', desc: '云端识别，1-3秒，需联网' }
]

function handleOCRChange() {
  setOCRMode(currentMode.value as 'native-paste' | 'tesseract' | 'ocrspace')
}

async function handleExportAll() {
  const { exportQuestionsPDF } = await import('@/export/pdf')
  const questions = await getAllQuestions()
  await exportQuestionsPDF(questions)
}

async function handleDeleteMastered() {
  if (!confirm('确认删除所有已掌握的错题？')) return
  const { db } = await import('@/db')
  const mastered = await db.questions.where('mastered').equals(1).toArray()
  await db.questions.bulkDelete(mastered.map(q => q.id))
}

async function handleClearAll() {
  if (!confirm('确认清空所有数据？此操作不可恢复！')) return
  const { db } = await import('@/db')
  await db.questions.clear()
}
</script>