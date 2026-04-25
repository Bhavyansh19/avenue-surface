import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL + '/api' : '/api',
  withCredentials: true,
})

// No auto-redirect on 401 — pages are public, browsing without login is allowed
// Protected routes are handled by ProtectedRoute in App.tsx
api.interceptors.response.use(
  res => res,
  err => Promise.reject(err)
)
console.log('API URL:', import.meta.env.VITE_API_URL)
export default api