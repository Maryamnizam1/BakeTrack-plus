<template>
  <div class="page-container">
    <div class="page-header">
      <h1>📦 Products</h1>
      <button class="btn-primary" @click="showForm = !showForm">+ Add Product</button>
    </div>

    <!-- Add Product Form -->
    <div v-if="showForm" class="form-card">
      <h2>Add New Product</h2>
      <div class="form-group">
        <label>Product Name</label>
        <input v-model="newProduct.name" type="text" placeholder="e.g. Sourdough Bread" />
      </div>
      <div class="form-group">
        <label>Category</label>
        <select v-model="newProduct.category">
          <option value="">Select category</option>
          <option value="bread">Bread</option>
          <option value="cake">Cake</option>
          <option value="pastry">Pastry</option>
          <option value="hotcross">Hot Cross Buns</option>
          <option value="biscuit">Biscuit</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="form-group">
        <label>Batch Size</label>
        <input v-model="newProduct.batch_size" type="number" placeholder="e.g. 12" />
      </div>
      <div v-if="formError" class="error-message">{{ formError }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div class="form-actions">
        <button class="btn-primary" @click="addProduct">Save Product</button>
        <button class="btn-secondary" @click="showForm = false">Cancel</button>
      </div>
    </div>

    <!-- Products List -->
    <em v-if="loading">Loading products...</em>
    <div v-else>
      <div v-if="products.length === 0" class="empty-state">
        No products yet. Add your first product!
      </div>
      <div v-else class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-icon">🍞</div>
          <div class="product-info">
            <h3>{{ product.name }}</h3>
            <span class="product-category">{{ product.category }}</span>
            <span class="product-batch">Batch size: {{ product.batch_size }}</span>
          </div>
          <button class="btn-delete" @click="deleteProduct(product.id)">🗑️</button>
        </div>
      </div>
    </div>

    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios'

const API = 'http://localhost:3000/api'

export default {
  data() {
    return {
      products: [],
      loading: true,
      error: '',
      formError: '',
      successMessage: '',
      showForm: false,
      newProduct: {
        name: '',
        category: '',
        batch_size: 1,
      },
    }
  },
  methods: {
    loadProducts() {
      axios
        .get(`${API}/products`)
        .then((res) => {
          this.products = res.data
          this.loading = false
        })
        .catch(() => {
          this.error = 'Failed to load products'
          this.loading = false
        })
    },
    addProduct() {
      const { name, category, batch_size } = this.newProduct

      if (!name || !category) {
        this.formError = 'Name and category are required'
        return
      }

      axios
        .post(`${API}/products`, { name, category, batch_size })
        .then(() => {
          this.successMessage = 'Product added successfully!'
          this.formError = ''
          this.newProduct = { name: '', category: '', batch_size: 1 }
          this.showForm = false
          this.loadProducts()
          setTimeout(() => {
            this.successMessage = ''
          }, 3000)
        })
        .catch(() => {
          this.formError = 'Failed to add product'
        })
    },
    deleteProduct(id) {
      if (!confirm('Are you sure you want to delete this product?')) return

      axios
        .delete(`${API}/products/${id}`)
        .then(() => {
          this.loadProducts()
        })
        .catch(() => {
          this.error = 'Failed to delete product'
        })
    },
  },
  mounted() {
    this.loadProducts()
  },
}
</script>

<style scoped>
.page-container {
  padding: 1rem 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.8rem;
  color: #6b4226;
}

.btn-primary {
  background-color: #6b4226;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #8b5e3c;
}

.btn-secondary {
  background-color: #f5f0e8;
  color: #6b4226;
  border: 1px solid #6b4226;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
}

.btn-delete {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.3rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.btn-delete:hover {
  background-color: #fde8e8;
}

.form-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.form-card h2 {
  color: #6b4226;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
  color: #2c2c2c;
  font-size: 0.9rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #6b4226;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.product-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 4px solid #f4a623;
}

.product-icon {
  font-size: 2rem;
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.product-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2c2c2c;
}

.product-category {
  font-size: 0.8rem;
  color: #888;
  text-transform: capitalize;
}

.product-batch {
  font-size: 0.8rem;
  color: #6b4226;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  color: #888;
  font-style: italic;
  padding: 3rem;
}

.error-message {
  color: #e53935;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.success-message {
  color: #4caf50;
  margin-top: 0.5rem;
  font-size: 0.9rem;
}
</style>
