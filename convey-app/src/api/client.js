import axios from 'axios'
import { getToken } from '../utils/storage'

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:8080' : '')

const client = axios.create({
  baseURL: API_BASE,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach JWT token to every request
client.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Handle 401 responses (expired/invalid token)
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear session
      localStorage.removeItem('convey_token')
      localStorage.removeItem('convey_user')
      window.location.href = '/create-profile'
    }
    return Promise.reject(error)
  }
)

export default client
