import { reactive } from 'vue'

export const authState = reactive({
  isAuthenticated: !!localStorage.getItem('token')
})

export function logout() {
  localStorage.removeItem('token')
}

export function login(token) {
  localStorage.setItem('token', token)
  authState.isAuthenticated = true
}