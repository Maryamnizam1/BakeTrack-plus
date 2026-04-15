<template>
  <div class="page-container">
    <div class="page-header">
      <h1>Waste</h1>
      <button class="btn-primary" @click="showForm = !showForm">+ Log Waste</button>
    </div>

    <!-- Add Waste Form -->
    <div v-if="showForm" class="form-card">
      <h2>Log Waste</h2>
      <div class="form-group">
        <label>Product</label>
        <select v-model="newWaste.product_id">
          <option value="">Select product</option>
          <option v-for="product in products" :key="product.id" :value="product.id">
            {{ product.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Quantity Wasted</label>
        <input v-model="newWaste.quantity_wasted" type="number" placeholder="e.g. 5" />
      </div>
      <div class="form-group">
        <label>Date</label>
        <input v-model="newWaste.date" type="date" />
      </div>
      <div class="form-group">
        <label>Reason</label>
        <select v-model="newWaste.reason">
          <option value="">Select reason</option>
          <option value="Overproduction">Overproduction</option>
          <option value="Expired">Expired</option>
          <option value="Damaged">Damaged</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div v-if="formError" class="error-message">{{ formError }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div class="form-actions">
        <button class="btn-primary" @click="addWaste">Save Waste</button>
        <button class="btn-secondary" @click="showForm = false">Cancel</button>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <input v-model="searchQuery" type="text" placeholder="Search by product name or reason..." />
    </div>

    <!-- Waste List -->
    <em v-if="loading">Loading waste records...</em>
    <div v-else>
      <div v-if="filteredWaste.length === 0" class="empty-state">No waste records found.</div>
      <div v-else class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity Wasted</th>
              <th>Reason</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="waste in filteredWaste" :key="waste.id">
              <td>{{ waste.product_name }}</td>
              <td class="qty-wasted">{{ waste.quantity_wasted }}</td>
              <td>{{ waste.reason }}</td>
              <td>{{ waste.date }}</td>
              <td>
                <button class="btn-donate" @click="donateWaste(waste)">Donate</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Donate Modal -->
    <div v-if="showDonateModal" class="modal-overlay">
      <div class="modal">
        <h2>Donate Unsold Items</h2>
        <p>
          Donating <strong>{{ donatingWaste.quantity_wasted }}</strong> units of
          <strong>{{ donatingWaste.product_name }}</strong>
        </p>
        <div class="form-group">
          <label>Charity Name</label>
          <input v-model="donationCharity" type="text" placeholder="e.g. Food Bank Manchester" />
        </div>
        <div class="form-group">
          <label>Date</label>
          <input v-model="donationDate" type="date" />
        </div>
        <div v-if="donateError" class="error-message">{{ donateError }}</div>
        <div v-if="donateSuccess" class="success-message">{{ donateSuccess }}</div>
        <div class="form-actions">
          <button class="btn-primary" @click="confirmDonation">Confirm Donation</button>
          <button class="btn-secondary" @click="showDonateModal = false">Cancel</button>
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
      wasteRecords: [],
      products: [],
      loading: true,
      error: '',
      formError: '',
      successMessage: '',
      showForm: false,
      searchQuery: '',
      showDonateModal: false,
      donatingWaste: {},
      donationCharity: '',
      donationDate: new Date().toISOString().split('T')[0],
      donateError: '',
      donateSuccess: '',
      newWaste: {
        product_id: '',
        quantity_wasted: '',
        date: new Date().toISOString().split('T')[0],
        reason: '',
      },
    }
  },
  computed: {
    filteredWaste() {
      if (!this.searchQuery) return this.wasteRecords
      const query = this.searchQuery.toLowerCase()
      return this.wasteRecords.filter(
        (waste) =>
          waste.product_name.toLowerCase().includes(query) ||
          waste.reason.toLowerCase().includes(query),
      )
    },
  },
  methods: {
    loadWaste() {
      axios
        .get(`${API}/waste`)
        .then((res) => {
          this.wasteRecords = res.data
          this.loading = false
        })
        .catch(() => {
          this.error = 'Failed to load waste records'
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
    addWaste() {
      const { product_id, quantity_wasted, date, reason } = this.newWaste

      if (!product_id || !quantity_wasted || !date) {
        this.formError = 'Product, quantity and date are required'
        return
      }

      axios
        .post(`${API}/waste`, { product_id, quantity_wasted, date, reason })
        .then(() => {
          this.successMessage = 'Waste logged successfully!'
          this.formError = ''
          this.newWaste = {
            product_id: '',
            quantity_wasted: '',
            date: new Date().toISOString().split('T')[0],
            reason: '',
          }
          this.showForm = false
          this.loadWaste()
          setTimeout(() => {
            this.successMessage = ''
          }, 3000)
        })
        .catch(() => {
          this.formError = 'Failed to log waste'
        })
    },
    donateWaste(waste) {
      this.donatingWaste = waste
      this.showDonateModal = true
      this.donateError = ''
      this.donateSuccess = ''
    },
    confirmDonation() {
      if (!this.donationCharity) {
        this.donateError = 'Please enter a charity name'
        return
      }

      axios
        .post(`${API}/donations`, {
          product_id: this.donatingWaste.product_id,
          quantity: this.donatingWaste.quantity_wasted,
          charity_name: this.donationCharity,
          date: this.donationDate,
        })
        .then(() => {
          this.donateSuccess = 'Donation logged successfully!'
          this.donationCharity = ''
          setTimeout(() => {
            this.showDonateModal = false
            this.donateSuccess = ''
          }, 1500)
        })
        .catch(() => {
          this.donateError = 'Failed to log donation'
        })
    },
  },
  mounted() {
    this.loadWaste()
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

.btn-donate {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: background-color 0.2s;
}

.btn-donate:hover {
  background-color: #388e3c;
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

.qty-wasted {
  font-weight: 600;
  color: #e53935;
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

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: #fffdf9;
  border-radius: 16px;
  padding: 2rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal h2 {
  color: #6b4226;
  margin-bottom: 1rem;
}

.modal p {
  margin-bottom: 1rem;
  color: #888;
  font-size: 0.95rem;
}
</style>
