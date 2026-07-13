import { createRouter, createWebHistory } from 'vue-router'
import TrackingPage from '../pages/TrackingPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'tracking', component: TrackingPage },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
  ],
})

export default router
