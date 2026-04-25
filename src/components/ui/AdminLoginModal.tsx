import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Lock } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

interface Props { onClose: () => void }

export default function AdminLoginModal({ onClose }: Props) {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const { login }               = useAuthStore()
  const navigate                = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      // Read role from zustand state after login
      const state = useAuthStore.getState()
      if (state.user?.role === 'admin') {
        toast.success('Welcome, Admin')
        onClose()
        navigate('/admin')
      } else {
        toast.error('Access denied — admin accounts only')
        // Log out the non-admin user we just logged in
        await useAuthStore.getState().logout()
      }
    } catch {
      toast.error('Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 border border-stone-200"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Lock size={20} className="text-terra" />
          </div>
          <h2 className="font-serif text-2xl font-semibold text-stone-900">Admin Access</h2>
          <p className="text-xs text-stone-400 mt-1">Avenue Surface — Restricted</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 block">
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-field"
              placeholder="admin@avenuesurrface.com.au"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 block">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3 mt-2 disabled:opacity-60"
          >
            {loading ? 'Verifying…' : 'Access Admin Panel'}
          </button>
        </form>
      </div>
    </div>
  )
}