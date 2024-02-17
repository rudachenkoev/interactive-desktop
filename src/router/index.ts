import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/interactive-desktop',
      name: 'interactive-desktop',
      component: () => import('@/views/InteractiveDesktop.vue')
    },
    {
      path: '/socket-interaction',
      name: 'socket-interaction',
      component: () => import('@/views/SocketInteraction.vue')
    }
  ]
})

export default router
