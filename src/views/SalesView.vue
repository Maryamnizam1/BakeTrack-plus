<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Sales</h1>
      <button class="btn-primary" @click="showForm = !showForm">+ Log Sale</button>
    </div>

    <!-- Add Sale Form -->
    <div v-if="showForm" class="form-card">
      <h2>Log New Sale</h2>
      <div class="form-group">
        <label>Product</label>
        <select v-model="newSale.product_id">
          <option value="">Select product</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Quantity Sold</label>
        <input v-model="newSale.quantity_sold" type="number" placeholder="e.g. 24" />
      </div>
      <div class="form-group">
        <label>Date</label>
        <input v-model="newSale.date" type="date" />
      </div>
      <div v-if="formError" class="error-message">{{ formError }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div class="form-actions">
        <button class="btn-primary" @click="addSale">Save Sale</button>
        <button class="btn-secondary" @click="showForm = false">Cancel</button>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by product name or day of week..."
      />
    </div>

    <!-- Sales List -->
    <em v-if="loading">Loading sales...</em>
    <div v-else>
      <div v-if="filteredSales.length === 0" class="empty-state">No sales found.</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Sold</th>
              <th>Date</th>
              <th>Day</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sale in filteredSales" :key="sale.id">
              <td>{{ sale.product_name }}</td>
              <td class="qty-sold">{{ sale.quantity_sold }}</td>
              <td>{{ sale.date }}</td>
              <td>{{ sale.day_of_week }}</td>
            </tr>
          </tbody>
        </table>
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
      sales: [],
      products: [],
      loading: true,
      error: '',
      formError: '',
      successMessage: '',
      showForm: false,
      searchQuery: '',
      newSale: {
        product_id: '',
        quantity_sold: '',
        date: new Date().toISOString().split('T')[0],
      },
    }
  },
  computed: {
    filteredSales() {
      if (!this.searchQuery) return this.sales
      const query = this.searchQuery.toLowerCase()
      return this.sales.filter(
        (sale) =>
          sale.product_name.toLowerCase().includes(query) ||
          sale.day_of_week.toLowerCase().includes(query),
      )
    },
  },

  methods: {
    loadSales() {
      axios
        .get(`${API}/sales`)
        .then((res) => {
          this.sales = res.data
          this.loading = false
        })
        .catch(() => {
          this.error = 'Failed to load sales'
          this.loading = false
        })
    },
    loadProducts() {
      axios
        .get(`${API}/products`)
        .then((res) => {
          this.products = res.data
        })
        .catch(() => {
          this.error = 'Failed to load products'
        })
    },
    addSale() {
      const { product_id, quantity_sold, date } = this.newSale

      if (!product_id || !quantity_sold || !date) {
        this.formError = 'All fields are required'
        return
      }

      axios
        .post(`${API}/sales`, { product_id, quantity_sold, date })
        .then(() => {
          this.successMessage = 'Sale logged successfully!'
          this.formError = ''
          this.newSale = {
            product_id: '',
            quantity_sold: '',
            date: new Date().toISOString().split('T')[0],
          }
          this.showForm = false
          this.loadSales()
          setTimeout(() => {
            this.successMessage = ''
          }, 3000)
        })
        .catch(() => {
          this.formError = 'Failed to log sale'
        })
    },
  },
  mounted() {
    this.loadSales()
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

.table-container {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  text-align: left;
  padding: 0.75rem 1rem;
  background: #f5f0e8;
  color: #6b4226;
  font-weight: 600;
  font-size: 0.9rem;
}

.data-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f5f0e8;
  font-size: 0.9rem;
}

.data-table tr:hover {
  background-color: #fdf8f2;
}

.qty-sold {
  font-weight: 600;
  color: #f4a623;
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
.search-bar {
  margin-bottom: 1.5rem;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
}

.search-bar input:focus {
  outline: none;
  border-color: #6b4226;
}
</style>
