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
    path: '/users',
    name: 'users',
    component: () => import('../views/UsersView.vue')
  },
  {
    path: '/categories',
    name: 'categories',
    component: () => import('../views/CategoriesView.vue')
  },
  {
    path: '/suppliers',
    name: 'suppliers',
    component: () => import('../views/SuppliersView.vue')
  },
  {
    path: '/purchases',
    name: 'purchases',
    component: () => import('../views/PurchasesView.vue')
  },
  {
    path: '/sales',
    name: 'sales',
    component: () => import('../views/SalesView.vue')
  },
  {
    path: '/returns',
    name: 'returns',
    component: () => import('../views/ReturnsView.vue')
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