<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">List of Products</h1>

        <!-- Loop through products and display them -->
        <div v-if="products.length" class="list-group">
          <div
            v-for="product in products"
            :key="product.id"
            class="list-group-item list-group-item-action mb-3 shadow-sm"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-1">{{ product.name }}</h5>
              <small class="text-muted">Category: {{ product.categories.namecategory }}</small>
            </div>
            <p class="mb-1">{{ product.description }}</p>
            <p class="mb-1"><strong>Price:</strong> ${{ product.price }}</p>
            <p class="mb-1"><strong>Stock:</strong> {{ product.stock }}</p>
            <small class="text-muted">
              Updated at: {{ new Date(product.updated_at).toLocaleString() }}
            </small>
            <div class="mt-2">
              <button class="btn btn-warning btn-sm" @click="openEditModal(product)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="destroyproduct(product.id)">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-info text-center">No products available.</div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal" tabindex="-1" style="display: block" v-if="showEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateProduct">
              <div class="mb-3">
                <label for="productName" class="form-label">Product Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="productName"
                  v-model="formData.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="productDescription" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="productDescription"
                  v-model="formData.description"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="productPrice" class="form-label">Price</label>
                <input
                  type="number"
                  class="form-control"
                  id="productPrice"
                  v-model="formData.price"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="productStock" class="form-label">Stock</label>
                <input
                  type="number"
                  class="form-control"
                  id="productStock"
                  v-model="formData.stock"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">Save Changes</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      showEditModal: false, // Controls visibility of the edit modal
      formData: {
        id: null,
        name: '',
        description: '',
        price: 0,
        stock: 0
      }
    }
  },
  mounted() {
    this.fetchProducts() // Fetch products when the component is mounted
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await api.getProducts()
        this.products = response.data // Store API data in 'products'
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    },
    async destroyproduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        try {
          const response = await api.destroyproduct(id)
          if (response.status === 200) {
            this.products = this.products.filter((product) => product.id !== id) // Remove from array
            alert('Product deleted successfully.')
          } else {
            alert('Failed to delete product.')
          }
        } catch (error) {
          console.error('Error deleting product:', error)
          alert('An error occurred while deleting the product.')
        }
      }
    },
    openEditModal(product) {
      // Fill formData with the product's current data
      this.formData = { ...product }
      this.showEditModal = true // Open the modal
    },
    closeEditModal() {
      this.showEditModal = false // Close the modal
    },
    async updateProduct() {
      try {
        const response = await api.updateProduct(this.formData.id, this.formData)
        if (response.status === 200) {
          // Find the index of the updated product in the products array
          const index = this.products.findIndex((product) => product.id === this.formData.id)

          // Update the product directly
          if (index !== -1) {
            this.products[index] = response.data.data // Directly update the product in the array
          }

          alert('Product updated successfully.')
          this.closeEditModal()
        } else {
          alert('Failed to update product.')
        }
      } catch (error) {
        console.error('Error updating product:', error)
        alert('An error occurred while updating the product.')
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin-top: 30px;
}
.list-group-item {
  padding: 20px;
}
</style>
