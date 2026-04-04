import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import SalesView from '../views/SalesView.vue'
import WasteView from '../views/WasteView.vue'
import DonationsView from '../views/DonationsView.vue'
import ForecastView from '../views/ForecastView.vue'

const ifAuthenticated = (to, from, next) => {
  const token = localStorage.getItem('session_token')
  if (token) {
    next()
    return
  }
  next('/login')
}

const routes = [
  { path: '/', component: HomeView },
  { path: '/login', component: LoginView },
  { path: '/register', component: LoginView },
  { path: '/dashboard', component: DashboardView, beforeEnter: ifAuthenticated },
  { path: '/products', component: ProductsView, beforeEnter: ifAuthenticated },
  { path: '/sales', component: SalesView, beforeEnter: ifAuthenticated },
  { path: '/waste', component: WasteView, beforeEnter: ifAuthenticated },
  { path: '/donations', component: DonationsView, beforeEnter: ifAuthenticated },
  { path: '/forecast', component: ForecastView, beforeEnter: ifAuthenticated },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
