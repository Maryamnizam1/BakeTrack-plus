<template>
  <div class="home">
    <div class="hero">
      <div class="hero-content">
        <h1>BakeTrack<span class="plus">+</span></h1>
        <p class="hero-subtitle">Smart production planning for modern bakeries</p>
        <p class="hero-description">
          Stop guessing how much to bake. BakeTrack+ uses your sales history, seasonality and waste
          data to recommend the perfect batch sizes every day.
        </p>
        <div class="hero-buttons">
          <router-link to="/register" class="btn-primary">Get Started</router-link>
          <router-link to="/login" class="btn-secondary">Login</router-link>
        </div>
      </div>
    </div>

    <div class="features">
      <h2>Why BakeTrack+?</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Smart Forecasting</h3>
          <p>
            AI-powered batch size recommendations based on your historical sales data and seasonal
            patterns.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📉</div>
          <h3>Reduce Waste</h3>
          <p>Track and analyse unsold goods to minimise overproduction and cut operating costs.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🤝</div>
          <h3>Donate Surplus</h3>
          <p>
            Connect with local charities and redistribute unsold goods to support your community.
          </p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💰</div>
          <h3>Save Money</h3>
          <p>
            Data-driven decisions mean less waste, lower costs, and a more sustainable business.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  created() {
    if (localStorage.getItem('session_token')) {
      this.$router.push('/dashboard')
    }
  },
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #6b4226, #8b5e3c);
  padding: 5rem 2rem;
  text-align: center;
  color: #f5f0e8;
}

.hero-content {
  max-width: 700px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: 2px;
}

.plus {
  color: #f4a623;
}

.hero-subtitle {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1rem;
  opacity: 0.8;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  background-color: #f4a623;
  color: #2c2c2c;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #e09520;
}

.btn-secondary {
  background-color: transparent;
  color: #f5f0e8;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 1rem;
  border: 2px solid #f5f0e8;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.features {
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
}

.features h2 {
  font-size: 2rem;
  color: #6b4226;
  margin-bottom: 2rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: #fffdf9;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s;
}

.feature-card:hover {
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.1rem;
  color: #6b4226;
  margin-bottom: 0.5rem;
}

.feature-card p {
  font-size: 0.9rem;
  color: #888;
  line-height: 1.5;
}
</style>
