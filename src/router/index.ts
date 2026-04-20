import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: '/add', name: 'add', component: () => import('@/pages/AddPage.vue') },
  { path: '/list', name: 'list', component: () => import('@/pages/ListPage.vue') },
  { path: '/review', name: 'review', component: () => import('@/pages/ReviewPage.vue') },
  { path: '/settings', name: 'settings', component: () => import('@/pages/SettingsPage.vue') }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})