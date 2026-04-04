<template>
  <div class="page-container">
    <div class="page-header">
      <h1>📊 Forecast</h1>
    </div>

    <!-- Date Picker -->
    <div class="date-card">
      <h2>Select a date to get production recommendations</h2>
      <div class="date-picker">
        <input v-model="selectedDate" type="date" @change="loadForecast" />
        <button class="btn-primary" @click="loadForecast">Get Forecast</button>
      </div>
    </div>

    <!-- Forecast Results -->
    <em v-if="loading">Generating forecast...</em>
    <div v-else>
      <div v-if="forecasts.length === 0" class="empty-state">
        No forecast available. Make sure you have products and sales data!
      </div>
      <div v-else>
        <div class="forecast-summary">
          <h2>📅 Forecast for {{ formattedDate }} — {{ dayOfWeek }}</h2>
        </div>
        <div class="forecast-grid">
          <div v-for="forecast in forecasts" :key="forecast.product_id" class="forecast-card">
            <div class="forecast-header">
              <span class="forecast-icon">🍞</span>
              <h3>{{ forecast.product_name }}</h3>
            </div>
            <div class="forecast-recommendation">
              <span class="recommendation-number">{{ forecast.recommended_quantity }}</span>
              <span class="recommendation-label">units to bake</span>
            </div>
            <div class="forecast-breakdown">
              <div class="breakdown-item">
                <span class="breakdown-label">Avg Daily Sales</span>
                <span class="breakdown-value">{{ forecast.avg_daily_sales }}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Avg Daily Waste</span>
                <span class="breakdown-value waste">{{ forecast.avg_daily_waste }}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Day Multiplier</span>
                <span class="breakdown-value">x{{ forecast.day_multiplier }}</span>
              </div>
              <div class="breakdown-item">
                <span class="breakdown-label">Season Multiplier</span>
                <span class="breakdown-value">x{{ forecast.seasonality_multiplier }}</span>
              </div>
            </div>
            <div class="data-points">Based on {{ forecast.data_points_used }} data points</div>
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
      forecasts: [],
      loading: false,
      error: '',
      selectedDate: new Date().toISOString().split('T')[0],
    }
  },
  computed: {
    formattedDate() {
      return new Date(this.selectedDate).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    },
    dayOfWeek() {
      return new Date(this.selectedDate).toLocaleDateString('en-GB', {
        weekday: 'long',
      })
    },
  },
  methods: {
    loadForecast() {
      this.loading = true
      this.error = ''

      axios
        .get(`${API}/forecast?date=${this.selectedDate}`)
        .then((res) => {
          this.forecasts = res.data
          this.loading = false
        })
        .catch(() => {
          this.error = 'Failed to load forecast'
          this.loading = false
        })
    },
  },
  mounted() {
    this.loadForecast()
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

.date-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
}

.date-card h2 {
  color: #6b4226;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.date-picker {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.date-picker input {
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
}

.date-picker input:focus {
  outline: none;
  border-color: #6b4226;
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

.forecast-summary {
  margin-bottom: 1.5rem;
}

.forecast-summary h2 {
  color: #6b4226;
  font-size: 1.2rem;
}

.forecast-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.forecast-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-top: 4px solid #f4a623;
}

.forecast-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.forecast-icon {
  font-size: 1.5rem;
}

.forecast-header h3 {
  font-size: 1rem;
  color: #2c2c2c;
  font-weight: 600;
}

.forecast-recommendation {
  text-align: center;
  padding: 1rem;
  background: linear-gradient(135deg, #6b4226, #8b5e3c);
  border-radius: 10px;
  margin-bottom: 1rem;
}

.recommendation-number {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #f4a623;
}

.recommendation-label {
  color: #f5f0e8;
  font-size: 0.85rem;
}

.forecast-breakdown {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.breakdown-item {
  background: #f5f0e8;
  border-radius: 6px;
  padding: 0.5rem;
  text-align: center;
}

.breakdown-label {
  display: block;
  font-size: 0.7rem;
  color: #888;
  margin-bottom: 0.2rem;
}

.breakdown-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b4226;
}

.breakdown-value.waste {
  color: #e53935;
}

.data-points {
  font-size: 0.75rem;
  color: #888;
  text-align: center;
  font-style: italic;
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
</style>
