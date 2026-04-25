import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try { await login(form.email, form.password); toast.success('Welcome back!'); navigate('/') }
    catch (err: any) { toast.error(err.response?.data?.message || 'Invalid credentials') }
    finally { setLoading(false) }
  }

  return (
    <>
      <Helmet><title>Sign In — Avenue Surface</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-2">Welcome Back</h1>
            <p className="text-stone-500">Sign in to your Avenue Surface account</p>
          </div>
          <form onSubmit={handle} className="bg-white border border-stone-200 rounded-2xl p-8 space-y-4 shadow-sm">
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Email address</label>
              <input type="email" required value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="input-field" placeholder="you@example.com.au" />
            </div>
            <div>
              <label className="text-sm font-medium text-stone-700 mb-1.5 block">Password</label>
              <input type="password" required value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className="input-field" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
            <p className="text-center text-sm text-stone-500">
              Don't have an account? <Link to="/register" className="text-terra font-medium hover:underline">Create one</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
