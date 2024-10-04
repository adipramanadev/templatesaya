import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Categories from '@/components/Categories.vue'
import Products from '@/components/Products.vue'

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories // Route to the Categories page
  },
  { path: '/products', name: 'Product', component: Products }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
