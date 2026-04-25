import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { applyTheme } from './store/themestore'
import './index.css'

// Apply saved theme before first paint (prevents flash)
const saved = localStorage.getItem('avenue-theme')
try {
  const parsed = saved ? JSON.parse(saved) : null
  applyTheme(parsed?.state?.theme || 'system')
} catch {
  applyTheme('system')
}

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  const saved2 = localStorage.getItem('avenue-theme')
  try {
    const parsed2 = saved2 ? JSON.parse(saved2) : null
    if (!parsed2?.state?.theme || parsed2.state.theme === 'system') applyTheme('system')
  } catch { applyTheme('system') }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { fontFamily: 'DM Sans, sans-serif', fontSize: '14px' },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)