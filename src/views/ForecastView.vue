<template>
  <div class="page-wrapper">
    <div class="page-container">
      <div class="page-header">
        <h1>Production Forecast</h1>
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
            <h2>Forecast for {{ formattedDate }} — {{ dayOfWeek }}</h2>
          </div>

          <!-- Charts Section -->
          <div class="charts-grid">
            <div class="chart-card">
              <h3>📊 Recommended Production Quantities</h3>
              <div ref="recommendedChart" class="chart-container"></div>
            </div>
            <div class="chart-card">
              <h3>📈 Sales vs Waste vs Recommended</h3>
              <div ref="comparisonChart" class="chart-container"></div>
            </div>
          </div>

          <!-- Forecast Cards -->
          <div class="forecast-grid">
            <div v-for="forecast in forecasts" :key="forecast.product_id" class="forecast-card">
              <div class="forecast-header">
                <h3>{{ forecast.product_name }}</h3>
                <span class="forecast-category">{{ forecast.category }}</span>
              </div>
              <div class="forecast-recommendation">
                <span class="recommendation-number">{{ forecast.recommended_quantity }}</span>
                <span class="recommendation-label">units to bake</span>
              </div>
              <div class="forecast-stats">
                <div class="stat-row">
                  <span class="stat-label">Avg Daily Sales</span>
                  <span class="stat-value">{{ forecast.avg_daily_sales }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Avg Daily Waste</span>
                  <span class="stat-value waste">{{ forecast.avg_daily_waste }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Day Multiplier</span>
                  <span class="stat-value">{{ forecast.day_multiplier }}x</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Season Multiplier</span>
                  <span class="stat-value">{{ forecast.seasonality_multiplier }}x</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Data Points</span>
                  <span class="stat-value">{{ forecast.data_points_used }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import * as echarts from 'echarts'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  data() {
    return {
      forecasts: [],
      loading: false,
      error: '',
      selectedDate: new Date().toISOString().split('T')[0],
      recommendedChartInstance: null,
      comparisonChartInstance: null,
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
          this.$nextTick(() => {
            this.renderCharts()
          })
        })
        .catch(() => {
          this.error = 'Failed to load forecast'
          this.loading = false
        })
    },
    renderCharts() {
      this.renderRecommendedChart()
      this.renderComparisonChart()
    },
    renderRecommendedChart() {
      if (this.recommendedChartInstance) {
        this.recommendedChartInstance.dispose()
      }
      const chartDom = this.$refs.recommendedChart
      if (!chartDom) return

      this.recommendedChartInstance = echarts.init(chartDom)

      const names = this.forecasts.map((f) => f.product_name)
      const quantities = this.forecasts.map((f) => f.recommended_quantity)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            rotate: names.length > 4 ? 30 : 0,
            fontSize: 11,
            color: '#6b4226',
          },
          axisLine: { lineStyle: { color: '#ddd' } },
        },
        yAxis: {
          type: 'value',
          name: 'Units',
          nameTextStyle: { color: '#888', fontSize: 11 },
          axisLabel: { color: '#888' },
          axisLine: { lineStyle: { color: '#ddd' } },
          splitLine: { lineStyle: { color: '#f0ebe3' } },
        },
        series: [
          {
            name: 'Recommended',
            type: 'bar',
            data: quantities,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f4a623' },
                { offset: 1, color: '#e09520' },
              ]),
              borderRadius: [6, 6, 0, 0],
            },
            barMaxWidth: 50,
            label: {
              show: true,
              position: 'top',
              fontWeight: 'bold',
              color: '#6b4226',
              fontSize: 13,
            },
          },
        ],
      }

      this.recommendedChartInstance.setOption(option)
    },
    renderComparisonChart() {
      if (this.comparisonChartInstance) {
        this.comparisonChartInstance.dispose()
      }
      const chartDom = this.$refs.comparisonChart
      if (!chartDom) return

      this.comparisonChartInstance = echarts.init(chartDom)

      const names = this.forecasts.map((f) => f.product_name)
      const avgSales = this.forecasts.map((f) => f.avg_daily_sales)
      const avgWaste = this.forecasts.map((f) => f.avg_daily_waste)
      const recommended = this.forecasts.map((f) => f.recommended_quantity)

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
        },
        legend: {
          data: ['Avg Sales', 'Avg Waste', 'Recommended'],
          bottom: 0,
          textStyle: { color: '#888', fontSize: 11 },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: names,
          axisLabel: {
            rotate: names.length > 4 ? 30 : 0,
            fontSize: 11,
            color: '#6b4226',
          },
          axisLine: { lineStyle: { color: '#ddd' } },
        },
        yAxis: {
          type: 'value',
          name: 'Units',
          nameTextStyle: { color: '#888', fontSize: 11 },
          axisLabel: { color: '#888' },
          axisLine: { lineStyle: { color: '#ddd' } },
          splitLine: { lineStyle: { color: '#f0ebe3' } },
        },
        series: [
          {
            name: 'Avg Sales',
            type: 'bar',
            data: avgSales,
            itemStyle: {
              color: '#6b4226',
              borderRadius: [4, 4, 0, 0],
            },
            barMaxWidth: 35,
          },
          {
            name: 'Avg Waste',
            type: 'bar',
            data: avgWaste,
            itemStyle: {
              color: '#e53935',
              borderRadius: [4, 4, 0, 0],
            },
            barMaxWidth: 35,
          },
          {
            name: 'Recommended',
            type: 'bar',
            data: recommended,
            itemStyle: {
              color: '#f4a623',
              borderRadius: [4, 4, 0, 0],
            },
            barMaxWidth: 35,
          },
        ],
      }

      this.comparisonChartInstance.setOption(option)
    },
    handleResize() {
      if (this.recommendedChartInstance) this.recommendedChartInstance.resize()
      if (this.comparisonChartInstance) this.comparisonChartInstance.resize()
    },
  },
  mounted() {
    this.loadForecast()
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
    if (this.recommendedChartInstance) this.recommendedChartInstance.dispose()
    if (this.comparisonChartInstance) this.comparisonChartInstance.dispose()
  },
}
</script>

<style scoped>
.page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

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

/* Charts */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chart-card h3 {
  font-size: 1rem;
  color: #6b4226;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f5f0e8;
}

.chart-container {
  width: 100%;
  height: 320px;
}

/* Forecast Cards */
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
  margin-bottom: 1rem;
}

.forecast-header h3 {
  font-size: 1rem;
  color: #2c2c2c;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.forecast-category {
  font-size: 0.8rem;
  color: #888;
  text-transform: capitalize;
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

.forecast-stats {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
  border-bottom: 1px solid #f5f0e8;
  font-size: 0.85rem;
}

.stat-label {
  color: #888;
}

.stat-value {
  font-weight: 600;
  color: #6b4226;
}

.stat-value.waste {
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

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  .forecast-grid {
    grid-template-columns: 1fr;
  }
  .chart-container {
    height: 250px;
  }
}
</style>
