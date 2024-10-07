import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://192.168.100.17:8000/api', //sesuaikan url
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
})

export default {
  getCategories() {
    return apiClient.get('/categories')
  },

  updateCategory(id, data) {
    return apiClient.put(`/put-categories/${id}`, data)
  },
  addCategory(data) {
    return apiClient.post('/categories', data) // POST endpoint for creating new category
  },

  //destroycategories
  destroycategories(id) {
    return apiClient.delete(`/destroycategories/${id}`)
  },

  //get product
  getProducts() {
    return apiClient.get('/products')
  },

  //createProduct
  createProduct(data) {
    return apiClient.post('/products', data)
  },
  //deleteproducts
  destroyproduct(id) {
    return apiClient.delete(`/destroy-product/${id}`)
  },
  updateProduct(id, data) {
    return apiClient.put(`/put-products/${id}`, data) // PUT request to update product
  }
}
