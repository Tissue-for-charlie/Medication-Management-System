import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/medications',
    name: 'medications',
    component: () => import('../views/MedicationsView.vue')
  },
  {
    path: '/prescriptions',
    name: 'prescriptions',
    component: () => import('../views/PrescriptionsView.vue')
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('../views/InventoryView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router