<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">List of Orders</h1>

        <div class="mb-4 text-center">
          <button class="btn btn-success" @click="openAddModal">Tambah Data</button>
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
              <small class="text-muted"> Updated at: {{ order.customer_email }}</small>
            </div>
            <p class="mb-1">Created at: {{ order.created_at }}</p>
            <p class="mb-1">Total: Rp.{{ totalProductOrder(order.order_products) }}</p>
            <h6 class="mt-3">Order Product</h6>
            <ul class="list-group">
              <li v-for="product in order.order_products" :key="product.id" class="list-group-item">
                <p>Price : {{ product.price }}</p>
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="alert alert-info text-center">No orders available.</div>
      </div>

      <!-- Add Modal -->
      <div class="modal" tabindex="-1" style="display: block" v-if="showAddModal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Create Order</h5>
              <button type="button" class="btn-close" @click="closeAddModal"></button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="createOrder">
                <!-- Form fields for creating a new order -->
                <div class="mb-3">
                  <label for="newCustomerName" class="form-label">Customer Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="newCustomerName"
                    v-model="newOrderData.customer_name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="newCustomerEmail" class="form-label">Customer Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="newCustomerEmail"
                    v-model="newOrderData.customer_email"
                    required
                  />
                </div>

                <!-- Products selection -->
                <div class="mb-3">
                  <label for="newProduct" class="form-label">Product</label>
                  <select
                    class="form-control"
                    id="newProduct"
                    v-model="selectedProduct.product_id"
                    required
                  >
                    <option v-for="product in products" :key="product.id" :value="product.id">
                      {{ product.name }} - Rp.{{ product.price }}
                    </option>
                  </select>
                </div>

                <!-- Quantity for the selected product -->
                <div class="mb-3">
                  <label for="productQuantity" class="form-label">Quantity</label>
                  <input
                    type="number"
                    class="form-control"
                    id="productQuantity"
                    v-model="selectedProduct.quantity"
                    required
                  />
                </div>

                <!-- Button to add the selected product to the order -->
                <button type="button" class="btn btn-secondary mb-3" @click="addProduct">
                  Add Product
                </button>

                <!-- Display list of products added -->
                <div v-if="newOrderData.products.length">
                  <h6>Selected Products</h6>
                  <ul>
                    <li v-for="(product, index) in newOrderData.products" :key="index">
                      {{ product.product_id }} - Quantity: {{ product.quantity }} - Price:
                      {{ product.price }}
                    </li>
                  </ul>
                </div>

                <button type="submit" class="btn btn-primary">Submit Order</button>
              </form>
            </div>
          </div>
        </div>
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
      orders: [], // Menyimpan daftar orders
      products: [], // Menyimpan daftar produk
      showAddModal: false,
      newOrderData: {
        customer_name: '',
        customer_email: '',
        total_price: 0,
        products: []
      },
      selectedProduct: {
        product_id: '',
        quantity: 1,
        price: 0
      }
    }
  },
  mounted() {
    this.fetchOrder() // Memanggil API untuk mendapatkan daftar orders
    this.fetchProducts() // Memanggil API untuk mendapatkan daftar produk
    this.startPolling()
  },
  methods: {
    async fetchOrder() {
      try {
        const response = await api.getOrder() // Memanggil API untuk mendapatkan orders
        this.orders = response.data.data
      } catch (error) {
        console.error('Error fetching orders:', error)
      }
    },

    async fetchProducts() {
      try {
        const response = await api.getProducts() // Memanggil API untuk mendapatkan produk
        console.log(response.data) // Tambahkan log untuk melihat hasil response
        this.products = response.data // Menyimpan produk
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },

    // Fungsi untuk menghitung total harga dari semua produk dalam order
    totalProductOrder(orderProducts) {
      return orderProducts
        .reduce((total, product) => total + product.price * product.quantity, 0)
        .toFixed(2)
    },

    addProduct() {
      // Pastikan products sudah diambil dan tidak kosong
      if (this.products.length === 0) {
        console.error('No products available to add.')
        return
      }

      const product = this.products.find((p) => p.id === this.selectedProduct.product_id)

      if (!product) {
        console.error('Product not found')
        return
      }

      this.selectedProduct.price = product.price

      this.newOrderData.products.push({ ...this.selectedProduct })

      // Perbarui total harga pesanan
      this.updateTotalPrice()
    },

    updateTotalPrice() {
      this.newOrderData.total_price = this.newOrderData.products.reduce((total, product) => {
        return total + product.price * product.quantity
      }, 0)
    },

    openAddModal() {
      this.newOrderData = {
        customer_name: '',
        customer_email: '',
        total_price: 0,
        products: []
      }
      this.showAddModal = true
    },

    closeAddModal() {
      this.showAddModal = false
    },

    async createOrder() {
      try {
        const response = await api.createOrder(this.newOrderData) // Mengirim order baru ke API
        if (response.status === 200) {
          this.orders.push(response.data.data) // Menambahkan order baru ke daftar
          alert('Order created')
          this.closeAddModal() // Tutup modal
        }
      } catch (error) {
        console.error('Error creating order:', error)
      }
    },
    //start polling tapi nanti di ganti dengan web socket
    startPolling() {
      this.pollingInterval = setInterval(() => {
        this.fetchOrder()
      }, 5000) // poll setiap 5 detik
    },
    //clear pollingnya
    stopPolling() {
      if (this.pollingInterval) {
        clearInterval(this.pollingInterval)
      }
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 800px;
}

.shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.list-group-item {
  margin-bottom: 10px;
}
</style>
