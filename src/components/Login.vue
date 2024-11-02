<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title text-center mb-4">Login</h2>
            <form @submit.prevent="login">
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  v-model="email"
                  class="form-control"
                  id="email"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input
                  type="password"
                  v-model="password"
                  class="form-control"
                  id="password"
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary w-100">Login</button>
              <div v-if="error" class="alert alert-danger mt-3" role="alert">
                {{ error }}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../services/api.js'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  methods: {
    async login() {
      try {
        const response = await apiClient.login({
          email: this.email,
          password: this.password
        })
        console.log('Response dari server:', response) // Debug respons server
        localStorage.setItem('token', response.data.token)
        this.$router.push('/navbar')
      } catch (error) {
        console.error('Error saat login:', error)
        if (error.response) {
          console.error('Error status:', error.response.status)
          console.error('Error data:', error.response.data)
        }
        this.errorMessage = error.response?.data?.message || 'Gagal login'
      }
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 8px;
}
</style>
