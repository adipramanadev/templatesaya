<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">List of Categories</h1>

        <div class="mb-4 text-center">
          <button class="btn btn-success" @click="openAddModal">Tambah Data</button>
        </div>

        <div v-if="categories.length" class="list-group">
          <div
            v-for="category in categories"
            :key="category.id"
            class="list-group-item list-group-item-action mb-3 shadow-sm"
          >
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-1">
                <strong>{{ category.namecategory }}</strong>
              </h5>
              <small class="text-muted">
                Updated at: {{ new Date(category.updated_at).toLocaleString() }}
              </small>
            </div>
            <p class="mb-1">Created at: {{ new Date(category.created_at).toLocaleString() }}</p>
            <div class="mt-2">
              <button class="btn btn-warning btn-sm" @click="openEditModal(category)">Edit</button>
              <button class="btn btn-danger btn-sm" @click="destroyCategory(category.id)">
                Delete
              </button>
            </div>
          </div>
        </div>

        <div v-else class="alert alert-info text-center">No categories available.</div>
      </div>
    </div>

    <!-- Add Modal -->
    <div class="modal" tabindex="-1" style="display: block" v-if="showAddModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Tambah Kategori</h5>
            <button type="button" class="btn-close" @click="closeAddModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="addCategory">
              <div class="mb-3">
                <label for="newCategoryName" class="form-label">Nama Kategori</label>
                <input
                  type="text"
                  class="form-control"
                  id="newCategoryName"
                  v-model="newCategoryName"
                  required
                />
              </div>
              <button type="submit" class="btn btn-success">Tambah</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div class="modal" tabindex="-1" style="display: block" v-if="showEditModal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Category</h5>
            <button type="button" class="btn-close" @click="closeEditModal"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="updateCategory">
              <div class="mb-3">
                <label for="categoryName" class="form-label">Category Name</label>
                <input
                  type="text"
                  class="form-control"
                  id="categoryName"
                  v-model="formData.namecategory"
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
import api from '../services/api' // Ensure the path is correct

export default {
  name: 'CategoryList',
  data() {
    return {
      categories: [],
      showAddModal: false,
      showEditModal: false,
      newCategoryName: '', // New category name for the add form
      formData: {
        id: null,
        namecategory: ''
      },
      intervalId: null
    }
  },
  mounted() {
    this.fetchCategories() // Initial load
    this.intervalId = setInterval(this.fetchCategories, 5000)
  },
  beforeUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await api.getCategories()
        this.categories = response.data // Store API data in 'categories'
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    async destroyCategory(id) {
      if (confirm('Are you sure you want to delete this category?')) {
        try {
          const response = await api.destroyCategory(id)
          if (response.data.msg) {
            this.categories = this.categories.filter((category) => category.id !== id)
            alert('Category deleted successfully.')
          } else {
            alert('Category not found.')
          }
        } catch (error) {
          console.error('Error deleting category:', error)
          alert('An error occurred while deleting the category.')
        }
      }
    },
    openAddModal() {
      this.showAddModal = true
    },
    closeAddModal() {
      this.showAddModal = false
      this.newCategoryName = ''
    },
    async addCategory() {
      try {
        const response = await api.addCategory({ namecategory: this.newCategoryName })
        if (response.data.msg) {
          this.categories.push(response.data.data) // Add the new category to the list
          alert('Category added successfully.')
          this.closeAddModal() // Close the modal after successful add
        } else {
          alert('Failed to add category.')
        }
      } catch (error) {
        console.error('Error adding category:', error)
        alert('An error occurred while adding the category.')
      }
    },
    openEditModal(category) {
      this.formData.id = category.id
      this.formData.namecategory = category.namecategory
      this.showEditModal = true
    },
    closeEditModal() {
      this.showEditModal = false
      this.formData = { id: null, namecategory: '' }
    },
    async updateCategory() {
      try {
        const response = await api.updateCategory(this.formData.id, {
          namecategory: this.formData.namecategory
        })
        if (response.data.msg) {
          this.categories = this.categories.map((category) =>
            category.id === this.formData.id ? response.data.data : category
          )
          alert('Category updated successfully.')
          this.closeEditModal()
        } else {
          alert('Category not found.')
        }
      } catch (error) {
        console.error('Error updating category:', error)
        alert('An error occurred while updating the category.')
      }
    }
  }
}
</script>
