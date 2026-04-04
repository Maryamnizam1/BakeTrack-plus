<template>
  <div class="dashboard">
    <!-- Welcome Header -->
    <div class="welcome-banner">
      <h1>Welcome to BakeTrack+ 🍞</h1>
      <p>Here's your bakery overview for today — {{ today }}</p>
    </div>

    <!-- Summary Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <h3>Total Products</h3>
          <p class="stat-number">{{ stats.totalProducts }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <h3>Total Sales</h3>
          <p class="stat-number">{{ stats.totalSales }}</p>
        </div>
      </div>
      <div class="stat-card waste">
        <div class="stat-icon">🗑️</div>
        <div class="stat-info">
          <h3>Total Waste</h3>
          <p class="stat-number">{{ stats.totalWaste }}</p>
        </div>
      </div>
      <div class="stat-card donation">
        <div class="stat-icon">🎁</div>
        <div class="stat-info">
          <h3>Total Donations</h3>
          <p class="stat-number">{{ stats.totalDonations }}</p>
        </div>
      </div>
    </div>

    <div class="dashboard-grid">
      <!-- Today's Forecast -->
      <div class="dashboard-card">
        <h2>📊 Today's Forecast</h2>
        <em v-if="loading.forecast">Loading forecast...</em>
        <div v-else>
          <div v-if="forecasts.length === 0" class="empty-state">
            No forecast data available. Add products and sales first!
          </div>
          <div v-else>
            <div v-for="forecast in forecasts" :key="forecast.product_id" class="forecast-item">
              <div class="forecast-name">{{ forecast.product_name }}</div>
              <div class="forecast-details">
                <span class="forecast-qty">Bake: {{ forecast.recommended_quantity }} units</span>
                <span class="forecast-day">{{ forecast.day_of_week }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="dashboard-card">
        <h2>💰 Recent Sales</h2>
        <em v-if="loading.sales">Loading sales...</em>
        <div v-else>
          <div v-if="recentSales.length === 0" class="empty-state">No sales recorded yet.</div>
          <div v-else>
            <div v-for="sale in recentSales" :key="sale.id" class="list-item">
              <span class="item-name">{{ sale.product_name }}</span>
              <span class="item-value">{{ sale.quantity_sold }} sold</span>
              <span class="item-date">{{ sale.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Waste -->
      <div class="dashboard-card">
        <h2>🗑️ Recent Waste</h2>
        <em v-if="loading.waste">Loading waste...</em>
        <div v-else>
          <div v-if="recentWaste.length === 0" class="empty-state">No waste recorded yet.</div>
          <div v-else>
            <div v-for="waste in recentWaste" :key="waste.id" class="list-item waste-item">
              <span class="item-name">{{ waste.product_name }}</span>
              <span class="item-value">{{ waste.quantity_wasted }} wasted</span>
              <span class="item-date">{{ waste.date }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Donations -->
      <div class="dashboard-card">
        <h2>🎁 Recent Donations</h2>
        <em v-if="loading.donations">Loading donations...</em>
        <div v-else>
          <div v-if="recentDonations.length === 0" class="empty-state">
            No donations recorded yet.
          </div>
          <div v-else>
            <div
              v-for="donation in recentDonations"
              :key="donation.id"
              class="list-item donation-item"
            >
              <span class="item-name">{{ donation.product_name }}</span>
              <span class="item-value">{{ donation.quantity }} donated</span>
              <span class="item-date">{{ donation.charity_name }}</span>
            </div>
          </div>
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
      today: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
      stats: {
        totalProducts: 0,
        totalSales: 0,
        totalWaste: 0,
        totalDonations: 0,
      },
      forecasts: [],
      recentSales: [],
      recentWaste: [],
      recentDonations: [],
      loading: {
        forecast: true,
        sales: true,
        waste: true,
        donations: true,
      },
      error: '',
    }
  },
  methods: {
    loadDashboard() {
      // Load products count
      axios
        .get(`${API}/products`)
        .then((res) => {
          this.stats.totalProducts = res.data.length
        })
        .catch(() => {
          this.error = 'Failed to load products'
        })

      // Load sales
      axios
        .get(`${API}/sales`)
        .then((res) => {
          this.stats.totalSales = res.data.length
          this.recentSales = res.data.slice(0, 5)
          this.loading.sales = false
        })
        .catch(() => {
          this.error = 'Failed to load sales'
          this.loading.sales = false
        })

      // Load waste
      axios
        .get(`${API}/waste`)
        .then((res) => {
          this.stats.totalWaste = res.data.length
          this.recentWaste = res.data.slice(0, 5)
          this.loading.waste = false
        })
        .catch(() => {
          this.error = 'Failed to load waste'
          this.loading.waste = false
        })

      // Load donations
      axios
        .get(`${API}/donations`)
        .then((res) => {
          this.stats.totalDonations = res.data.length
          this.recentDonations = res.data.slice(0, 5)
          this.loading.donations = false
        })
        .catch(() => {
          this.error = 'Failed to load donations'
          this.loading.donations = false
        })

      // Load forecast for today
      const todayDate = new Date().toISOString().split('T')[0]
      axios
        .get(`${API}/forecast?date=${todayDate}`)
        .then((res) => {
          this.forecasts = res.data
          this.loading.forecast = false
        })
        .catch(() => {
          this.error = 'Failed to load forecast'
          this.loading.forecast = false
        })
    },
  },
  created() {
    this.loadDashboard()
  },
}
</script>

<style scoped>
.dashboard {
  padding: 1rem 0;
}

.welcome-banner {
  background: linear-gradient(135deg, #6b4226, #8b5e3c);
  color: #f5f0e8;
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(107, 66, 38, 0.3);
}

.welcome-banner h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
}

.welcome-banner p {
  opacity: 0.85;
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #f4a623;
}

.stat-card.waste {
  border-left-color: #e53935;
}

.stat-card.donation {
  border-left-color: #4caf50;
}

.stat-icon {
  font-size: 2rem;
}

.stat-info h3 {
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 0.25rem;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 700;
  color: #6b4226;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.dashboard-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.dashboard-card h2 {
  font-size: 1.1rem;
  color: #6b4226;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f5f0e8;
}

.forecast-item {
  padding: 0.75rem;
  background: #f5f0e8;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.forecast-name {
  font-weight: 600;
  color: #2c2c2c;
  margin-bottom: 0.25rem;
}

.forecast-details {
  display: flex;
  justify-content: space-between;
}

.forecast-qty {
  color: #6b4226;
  font-weight: 600;
}

.forecast-day {
  color: #888;
  font-size: 0.85rem;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f5f0e8;
  font-size: 0.9rem;
}

.item-name {
  font-weight: 500;
  flex: 1;
}

.item-value {
  color: #f4a623;
  font-weight: 600;
  margin: 0 1rem;
}

.waste-item .item-value {
  color: #e53935;
}

.donation-item .item-value {
  color: #4caf50;
}

.item-date {
  color: #888;
  font-size: 0.8rem;
}

.empty-state {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 1rem;
}

.error-message {
  color: #e53935;
  text-align: center;
  margin-top: 1rem;
}
</style>
