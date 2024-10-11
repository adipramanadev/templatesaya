<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">List of Orders</h1>

        <div class="mb-4 text-center">
          <button class="btn btn-success">Tambah Data</button>
        </div>

        <div v-if="orders.length" class="list-group">
          <div
            v-for="order in orders"
            :key="order.id"
            class="list-group-item list-group-item-action mb-3 shadow-sm"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-1">
                <strong>{{ order.customer_name }}</strong>
              </h5>
              <small class="text-muted"> Email : {{ order.customer_email }}</small>
            </div>
            <p class="mb-1">Created at: {{ order.created_at }}</p>
            <p class="mb-1">Total Price : {{ totalProductOrder(order.order_products) }}</p>
            <h6 class="mt-3">Order Product</h6>

            <ul class="list-group">
              <li v-for="product in order.order_products" :key="product.id" class="list-group-item">
                <p>Price : {{ product.price }}</p>
              </li>
            </ul>
            <div class="mt-2">
              <button class="btn btn-warning btn-sm">Edit</button>
              <button class="btn btn-danger btn-sm">Delete</button>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-info text-center">No orders available.</div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'
export default {
  name: 'Order-List',
  data() {
    return {
      orders: [] // Deklarasi array untuk menyimpan orders
    }
  },
  mounted() {
    this.fetchOrder() // Panggil fetchOrder saat komponen di-mount
  },
  methods: {
    async fetchOrder() {
      try {
        const response = await api.getOrder() // Tambahkan () untuk memanggil method
        this.orders = response.data.data // Menyimpan hasil API ke orders
      } catch (error) {
        console.error('Error fetching orders:', error) // Tangani error jika gagal
      }
    },
    //fungsi untuk menghitung total harga dari semua produk dalam order
    totalProductOrder(orderProduct) {
      return orderProduct
        .reduce((total, product) => {
          return total + product.price * product.quantity
        }, 0)
        .toFixed(2)
    }
  }
}
</script>
