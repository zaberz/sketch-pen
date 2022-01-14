import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'


const routes:RouteRecordRaw[] = [
  {
    name: 'Home',
    path: '/',
    component: () => import('../views/Home.vue')
  },
  {
    name: 'NoisePainter',
    path: '/noise-painter',
    component: () => import('../views/NoisePainter.vue')
  }
]

const router = createRouter({
  history:createWebHashHistory(),
  routes
})

export default router