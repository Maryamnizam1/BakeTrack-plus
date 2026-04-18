<template>
  <div>
    <nav class="navbar" v-if="isLoggedIn">
      <div class="navbar-container">
        <div class="navbar-brand">
          <div class="brand-stack">
            <span class="logo-text">BakeTrack<span class="plus">+</span></span>
            <span class="bakery-name" v-if="bakeryName">{{ bakeryName }}</span>
          </div>
        </div>
        <div class="navbar-links">
          <router-link to="/dashboard">Dashboard</router-link>
          <router-link to="/products">Products</router-link>
          <router-link to="/sales">Sales</router-link>
          <router-link to="/waste">Waste</router-link>
          <router-link to="/donations">Donations</router-link>
          <router-link to="/forecast">Forecast</router-link>
          <button class="btn-logout" @click="logout">Logout</button>
        </div>
      </div>
    </nav>
    <div v-if="error">{{ error }}</div>
  </div>
  <router-view @login="handleLogin" />
</template>

<script>
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export default {
  data() {
    return {
      isLoggedIn: false,
      bakeryName: '',
      error: '',
    }
  },
  methods: {
    handleLogin() {
      this.isLoggedIn = !!localStorage.getItem('session_token')
      this.bakeryName = localStorage.getItem('bakery_name') || ''
    },
    logout() {
      const token = localStorage.getItem('session_token')
      axios
        .post(
          `${API}/logout`,
          {},
          {
            headers: { 'X-Authorization': token },
          },
        )
        .then(() => {
          localStorage.removeItem('session_token')
          localStorage.removeItem('user_id')
          localStorage.removeItem('bakery_name')
          this.isLoggedIn = false
          this.bakeryName = ''
          this.$router.push('/')
        })
        .catch(() => {
          localStorage.removeItem('session_token')
          localStorage.removeItem('user_id')
          localStorage.removeItem('bakery_name')
          this.isLoggedIn = false
          this.bakeryName = ''
          this.$router.push('/')
        })
    },
    checkLogin() {
      this.isLoggedIn = !!localStorage.getItem('session_token')
      this.bakeryName = localStorage.getItem('bakery_name') || ''
    },
  },
  created() {
    this.checkLogin()
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f0e8;
  color: #2c2c2c;
}

.navbar {
  background-color: #6b4226;
  padding: 0 2rem;
  height: 65px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.navbar-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo-text {
  color: #f5f0e8;
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 1px;
}

.plus {
  color: #f4a623;
}

.brand-stack {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.bakery-name {
  color: #f4a623;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.navbar-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.navbar-links a {
  color: #f5f0e8;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.navbar-links a:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.navbar-links a.router-link-active {
  background-color: #f4a623;
  color: #2c2c2c;
  font-weight: 600;
}

.btn-logout {
  background-color: transparent;
  color: #f5f0e8;
  border: 1px solid #f5f0e8;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.btn-logout:hover {
  background-color: #e53935;
  border-color: #e53935;
}
.page-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .navbar {
    height: auto;
    padding: 0.8rem 1rem;
  }
  .navbar-container {
    flex-direction: column;
    gap: 0.5rem;
  }
  .navbar-links {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }
  .navbar-links a {
    font-size: 0.85rem;
    padding: 0.3rem 0.6rem;
  }
}
</style>
