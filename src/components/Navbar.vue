<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Your App Name</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link class="nav-link active" to="/home">Home</router-link>
          </li>
          <!-- Add Category Link -->
          <li class="nav-item">
            <router-link class="nav-link" to="/categories">Categories</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/products">Data Product</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/order">Data Order</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar'
}
</script>

<style scoped>
nav {
  background-color: #1c2b24;
  padding: 20px;
}
ul {
  display: flex;
  justify-content: space-around;
  list-style: none;
  padding: 0;
}
li {
  font-size: 18px;
}
a {
  color: black;
  text-decoration: none;
}
a:hover {
  text-decoration: none;
}
</style>
