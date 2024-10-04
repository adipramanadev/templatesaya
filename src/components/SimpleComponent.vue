<template>
  <div class="simple-component">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <button @click="ubahJudul">Contoh</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'template sederhana dengan vue',
      description: 'ini adalah komponen sederhana'
    }
  },
  methods: {
    ubahJudul() {
      this.title = 'Judul ini telah berubah'
    }
  }
}
</script>

<style scope="simple-component">
.simple-component {
  text-align: center;
  margin-top: 20px;
}
</style>
