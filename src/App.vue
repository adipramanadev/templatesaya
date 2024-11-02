<template>
  <div id="app">
    <Navbar v-if="authState.isAuthenticated" />
    <router-view />
  </div>
</template>

<script>
import { authState } from './auth'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  computed: {
    authState() {
      return authState
    }
  },
  components: {
    Navbar
  }
}
</script>

<style>
/* Tambahkan gaya global jika diperlukan */
</style>
