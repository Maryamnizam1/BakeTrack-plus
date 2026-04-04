<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1>BakeTrack<span class="plus">+</span></h1>
        <p class="auth-subtitle">
          {{ isLogin ? 'Login to your bakery' : 'Create your bakery account' }}
        </p>
      </div>

      <!-- Toggle Tabs -->
      <div class="auth-tabs">
        <button :class="['tab', isLogin ? 'active' : '']" @click="isLogin = true">Login</button>
        <button :class="['tab', !isLogin ? 'active' : '']" @click="isLogin = false">
          Register
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="isLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Your password" />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <button class="btn-primary" @click="login">Login</button>
      </div>

      <!-- Register Form -->
      <div v-else>
        <div class="form-group">
          <label>Bakery Name</label>
          <input v-model="bakery_name" type="text" placeholder="e.g. Maryam's Bakery" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="your@email.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Create a password" />
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input v-model="confirmPassword" type="password" placeholder="Confirm your password" />
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
        <button class="btn-primary" @click="register">Create Account</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

const API = 'http://localhost:3000/api'

export default {
  data() {
    return {
      isLogin: true,
      bakery_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: '',
      successMessage: '',
    }
  },
  methods: {
    login() {
      const { email, password } = this
      if (!email || !password) {
        this.error = 'Email and password are required'
        return
      }
      axios
        .post(`${API}/login`, { email, password })
        .then((res) => {
          localStorage.setItem('session_token', res.data.session_token)
          localStorage.setItem('user_id', res.data.user_id)
          this.$emit('login')
          this.$router.push('/dashboard')
        })
        .catch(() => {
          this.error = 'Invalid email or password'
        })
    },
    register() {
      const { bakery_name, email, password, confirmPassword } = this
      if (!bakery_name || !email || !password || !confirmPassword) {
        this.error = 'All fields are required'
        return
      }
      if (password !== confirmPassword) {
        this.error = 'Passwords do not match'
        return
      }
      if (password.length < 6) {
        this.error = 'Password must be at least 6 characters'
        return
      }
      axios
        .post(`${API}/register`, { bakery_name, email, password })
        .then(() => {
          this.successMessage = 'Account created! Please login.'
          this.error = ''
          this.isLogin = true
          setTimeout(() => {
            this.successMessage = ''
          }, 3000)
        })
        .catch(() => {
          this.error = 'Email already exists or registration failed'
        })
    },
  },
  watch: {
    isLogin() {
      this.error = ''
      this.successMessage = ''
      this.email = ''
      this.password = ''
      this.confirmPassword = ''
      this.bakery_name = ''
    },
  },
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #6b4226, #8b5e3c);
  padding: 2rem;
}

.auth-card {
  background: #fffdf9;
  border-radius: 16px;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.auth-header h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #6b4226;
  margin-bottom: 0.3rem;
}

.plus {
  color: #f4a623;
}

.auth-subtitle {
  font-size: 0.95rem;
  color: #888;
}

.auth-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #ddd;
}

.tab {
  flex: 1;
  padding: 0.7rem;
  border: none;
  background: #f5f0e8;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  color: #888;
  transition: all 0.2s;
}

.tab.active {
  background: #6b4226;
  color: white;
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

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
  background: #fff;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #6b4226;
}

.btn-primary {
  width: 100%;
  background-color: #6b4226;
  color: white;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 0.5rem;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #8b5e3c;
}

.error-message {
  color: #e53935;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.success-message {
  color: #4caf50;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-align: center;
}
</style>
