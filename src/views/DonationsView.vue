<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Donations</h1>
      <button class="btn-primary" @click="showForm = !showForm">+ Log Donation</button>
    </div>

    <!-- Real Charities Section -->
    <div class="charities-card">
      <h2>Partner Charities</h2>
      <p class="charities-subtitle">Find a local charity to donate your surplus baked goods to</p>
      <div class="charities-grid">
        <a
          href="https://www.trusselltrust.org/get-help/find-a-foodbank/"
          target="_blank"
          class="charity-link"
        >
          <div class="charity-name">Trussell Trust Food Banks</div>
          <div class="charity-desc">Find your nearest food bank</div>
        </a>
        <a href="https://fareshare.org.uk/" target="_blank" class="charity-link">
          <div class="charity-name">FareShare</div>
          <div class="charity-desc">UK food redistribution charity</div>
        </a>
        <a href="https://www.olio.com/" target="_blank" class="charity-link">
          <div class="charity-name">OLIO</div>
          <div class="charity-desc">Share surplus food with neighbours</div>
        </a>
        <a href="https://toogoodtogo.com/en-gb" target="_blank" class="charity-link">
          <div class="charity-name">Too Good To Go</div>
          <div class="charity-desc">Sell surplus food at reduced price</div>
        </a>
      </div>
    </div>

    <!-- Add Donation Form -->
    <div v-if="showForm" class="form-card">
      <h2>Log New Donation</h2>
      <div class="form-group">
        <label>Product</label>
        <select v-model="newDonation.product_id">
          <option value="">Select product</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Quantity</label>
        <input v-model="newDonation.quantity" type="number" placeholder="e.g. 10" />
      </div>
      <div class="form-group">
        <label>Charity Name</label>
        <input
          v-model="newDonation.charity_name"
          type="text"
          placeholder="e.g. Trussell Trust Food Bank"
        />
      </div>
      <div class="form-group">
        <label>Date</label>
        <input v-model="newDonation.date" type="date" />
      </div>
      <div v-if="formError" class="error-message">{{ formError }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div class="form-actions">
        <button class="btn-primary" @click="addDonation">Save Donation</button>
        <button class="btn-secondary" @click="showForm = false">Cancel</button>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Search by product name or charity..." />
    </div>

    <!-- Donations List -->
    <em v-if="loading">Loading donations...</em>
    <div v-else>
      <div v-if="filteredDonations.length === 0" class="empty-state">No donations found.</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Charity</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="donation in filteredDonations" :key="donation.id">
              <td>{{ donation.product_name }}</td>
              <td class="qty-donated">{{ donation.quantity }}</td>
              <td>{{ donation.charity_name }}</td>
              <td>{{ donation.date }}</td>
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

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  data() {
    return {
      donations: [],
      products: [],
      loading: true,
      error: '',
      formError: '',
      successMessage: '',
      showForm: false,
      searchQuery: '',
      newDonation: {
        product_id: '',
        quantity: '',
        charity_name: '',
        date: new Date().toISOString().split('T')[0],
      },
    }
  },
  computed: {
    filteredDonations() {
      if (!this.searchQuery) return this.donations
      const query = this.searchQuery.toLowerCase()
      return this.donations.filter(
        (donation) =>
          donation.product_name.toLowerCase().includes(query) ||
          donation.charity_name.toLowerCase().includes(query),
      )
    },
  },
  methods: {
    loadDonations() {
      axios
        .get(`${API}/donations`)
        .then((res) => {
          this.donations = res.data
          this.loading = false
        })
        .catch(() => {
          this.error = 'Failed to load donations'
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
    addDonation() {
      const { product_id, quantity, charity_name, date } = this.newDonation

      if (!product_id || !quantity || !charity_name || !date) {
        this.formError = 'All fields are required'
        return
      }

      axios
        .post(`${API}/donations`, { product_id, quantity, charity_name, date })
        .then(() => {
          this.successMessage = 'Donation logged successfully!'
          this.formError = ''
          this.newDonation = {
            product_id: '',
            quantity: '',
            charity_name: '',
            date: new Date().toISOString().split('T')[0],
          }
          this.showForm = false
          this.loadDonations()
          setTimeout(() => {
            this.successMessage = ''
          }, 3000)
        })
        .catch(() => {
          this.formError = 'Failed to log donation'
        })
    },
  },
  mounted() {
    this.loadDonations()
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

.charities-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  border-left: 4px solid #4caf50;
}

.charities-card h2 {
  color: #6b4226;
  margin-bottom: 0.25rem;
}

.charities-subtitle {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.charities-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.charity-link {
  background: #f5f0e8;
  border-radius: 8px;
  padding: 1rem;
  text-decoration: none;
  transition: background-color 0.2s;
  display: block;
}

.charity-link:hover {
  background-color: #e8e0d0;
}

.charity-name {
  font-weight: 600;
  color: #6b4226;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.charity-desc {
  font-size: 0.8rem;
  color: #888;
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

.qty-donated {
  font-weight: 600;
  color: #4caf50;
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
