<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">List of Products</h1>

        <!-- Add "Tambah Data" button -->
        <div class="mb-4 text-center">
          <button class="btn btn-success" @click="openAddModal">Tambah Data</button>
        </div>

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
              <!-- Form fields for editing -->
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

    <!-- Add Modal -->
    <div class="modal" tabindex="-1" style="display: block" v-if="showAddModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Product</h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="createProduct">
              <!-- Form fields for creating a new product -->
              <div class="mb-3">
                <label for="newProductName" class="form-label">Product Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="newProductName"
                  v-model="newProductData.name"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="newProductDescription" class="form-label">Description</label>
                <textarea
                  class="form-control"
                  id="newProductDescription"
                  v-model="newProductData.description"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="newProductPrice" class="form-label">Price</label>
                <input
                  type="number"
                  class="form-control"
                  id="newProductPrice"
                  v-model="newProductData.price"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="newProductStock" class="form-label">Stock</label>
                <input
                  type="number"
                  class="form-control"
                  id="newProductStock"
                  v-model="newProductData.stock"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="newProductCategory" class="form-label">Category</label>
                <select
                  class="form-control"
                  id="newProductCategory"
                  v-model="newProductData.category_id"
                  required
                >
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.namecategory }}
                  </option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary">Tambah Product</button>
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
      categories: [],
      showEditModal: false,
      showAddModal: false, // Controls visibility of the Add modal
      formData: {
        id: null,
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: ''
      },
      newProductData: {
        // Data for adding a new product
        name: '',
        description: '',
        price: 0,
        stock: 0,
        category_id: ''
      },
      pollInterval: null // For polling (optional)
    }
  },
  mounted() {
    this.fetchProducts()
    this.fetchCategories()

    // Start polling every 5 seconds (5000 ms) to refresh product data
    this.pollInterval = setInterval(() => {
      this.fetchProducts()
    }, 5000)
  },
  beforeUnmount() {
    // Clear polling when the component is destroyed
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await api.getCategories()
        this.categories = response.data
      } catch (error) {
        console.error(error)
      }
    },
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
            this.products = this.products.filter((product) => product.id !== id)
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
      this.formData = { ...product }
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
    },
    openAddModal() {
      this.newProductData = { name: '', description: '', price: 0, stock: 0, category_id: '' } // Reset form data
      this.showAddModal = true
    },
    closeAddModal() {
      this.showAddModal = false
    },
    async updateProduct() {
      try {
        const payload = {
          name: this.formData.name,
          description: this.formData.description,
          price: this.formData.price,
          stock: this.formData.stock,
          category_id: this.formData.category_id // Ensure category_id is included in the payload
        }
        const response = await api.updateProduct(this.formData.id, payload)
        if (response.status === 200) {
          const index = this.products.findIndex((product) => product.id === this.formData.id)
          if (index !== -1) {
            this.products.splice(index, 1, response.data.data) // Update the product in the list
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
    },
    async createProduct() {
      try {
        const payload = {
          name: this.newProductData.name,
          description: this.newProductData.description,
          price: this.newProductData.price,
          stock: this.newProductData.stock,
          category_id: this.newProductData.category_id // Ensure category_id is included in the payload
        }
        const response = await api.createProduct(payload)
        if (response.status === 201) {
          this.products.push(response.data.data) // Add new product to the list
          alert('Product created successfully.')
          this.closeAddModal()
        } else {
          console.log(payload), console.log(response.data)
          alert('Failed to create product.')
        }
      } catch (error) {
        console.error('Error creating product:', error)
        alert('An error occurred while creating the product.')
      }
    }
  }
}
</script>
