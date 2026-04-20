<template>
  <div class="flex flex-col h-dvh bg-gray-50">
    <main class="flex-1 overflow-y-auto safe-top">
      <RouterView />
    </main>
    <nav class="flex border-t bg-white safe-bottom">
      <RouterLink v-for="tab in tabs" :key="tab.to" :to="tab.to"
        class="flex-1 flex flex-col items-center py-2 text-xs transition-colors"
        :class="isActive(tab.to) ? 'text-indigo-600' : 'text-gray-500'"
      >
        <span class="text-lg">{{ tab.icon }}</span>
        <span>{{ tab.label }}</span>
      </RouterLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const tabs = [
  { to: '/', icon: '🏠', label: '首页' },
  { to: '/add', icon: '✏️', label: '录入' },
  { to: '/list', icon: '📋', label: '列表' },
  { to: '/review', icon: '🔄', label: '复习' },
  { to: '/settings', icon: '⚙️', label: '设置' }
]

function isActive(path: string) {
  return route.path === path
}
</script>