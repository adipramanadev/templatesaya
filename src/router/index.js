import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Navbar from '@/components/Navbar.vue'
import Categories from '@/components/Categories.vue'
import Login from '@/components/Login.vue'
import Products from '@/components/Products.vue'
import apiClient from '@/services/api'

const routes = [
  {
    path: '/navbar',
    name: 'Navbar',
    component: Navbar
  },
  {
    path: '/',

    redirect: '/login' // Mengarahkan halaman default ke login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  {
    path: '/categories',
    name: 'Categories',
    component: Categories
  },
  {
    path: '/products',
    name: 'Products',
    component: Products
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/logout',
    name: 'Logout',
    beforeEnter: (_to, _from, next) => {
      apiClient.logout()
      next({ name: 'Login' })
    }
  }
]

// Deklarasikan dan inisialisasi router terlebih dahulu
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Gunakan router setelah deklarasi dan inisialisasi selesai
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/home')
  } else {
    next()
  }
})

export default router
