import { createRouter, createWebHashHistory } from 'vue-router'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', redirect: '/CandyCrash'},
    { path: '/CandyCrash', name: 'CandyCrash', component: () => import('../examples/CandyCrash.vue') },
    { path: '/Chain', name: 'Chain', component: () => import('../examples/Chain.vue') },
  ]
})