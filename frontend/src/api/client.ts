import axios from 'axios'

const apiClient = axios.create({
  // Relative URL — Vite proxy forwards /api → http://localhost:8085 in dev.
  // In prod, set VITE_API_BASE_URL to the deployed backend URL.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

export default apiClient
