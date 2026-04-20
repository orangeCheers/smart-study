<template>
  <div class="space-y-3">
    <button @click="revealed = true" v-if="!revealed" class="w-full rounded-lg bg-indigo-600 text-white py-2.5 text-sm font-medium">
      点击揭晓答案
    </button>
    <div v-else class="space-y-2 animate-fade-in">
      <div class="rounded-lg bg-green-50 p-3">
        <p class="text-xs font-medium text-green-700 mb-1">标准答案</p>
        <div class="text-sm text-gray-800 markdown-body" v-html="renderedAnswer"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { marked } from 'marked'

const props = defineProps<{ answer: string }>()
const revealed = ref(false)

const renderedAnswer = computed(() => marked.parse(props.answer))
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.markdown-body :deep(p) { margin: 0.5em 0; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 1.5em; margin: 0.5em 0; }
.markdown-body :deep(li) { margin: 0.25em 0; }
.markdown-body :deep(strong) { font-weight: 600; }
.markdown-body :deep(em) { font-style: italic; }
.markdown-body :deep(code) {
  background: rgba(0,0,0,0.06);
  padding: 0.15em 0.4em;
  border-radius: 0.25em;
  font-size: 0.9em;
}
.markdown-body :deep(pre) {
  background: rgba(0,0,0,0.06);
  padding: 0.75em 1em;
  border-radius: 0.5em;
  overflow-x: auto;
  margin: 0.5em 0;
}
.markdown-body :deep(pre code) {
  background: none;
  padding: 0;
  font-size: 0.85em;
}
.markdown-body :deep(blockquote) {
  border-left: 3px solid #d1d5db;
  padding-left: 1em;
  color: #6b7280;
  margin: 0.5em 0;
}
.markdown-body :deep(h1), .markdown-body :deep(h2), .markdown-body :deep(h3) {
  font-weight: 600;
  margin: 0.5em 0 0.25em;
}
.markdown-body :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5em 0;
}
.markdown-body :deep(th), .markdown-body :deep(td) {
  border: 1px solid #d1d5db;
  padding: 0.4em 0.6em;
  text-align: left;
}
.markdown-body :deep(th) { background: rgba(0,0,0,0.04); }
</style>