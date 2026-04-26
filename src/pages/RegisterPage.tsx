// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE: client/src/pages/RegisterPage.tsx
// CHANGES: Added Google sign-up button and divider
// Replace your entire RegisterPage.tsx with this file
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

// ⚠️ CHANGE THIS: replace with your actual Render backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', phone: '', newsletter: false,
  })
  const [loading, setLoading] = useState(false)
  const { register }          = useAuthStore()
  const navigate              = useNavigate()

  const set = (k: string) => (e: any) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created! Welcome to Avenue Surface.')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = () => {
    window.location.href = `${API_URL}/api/auth/google`
  }

  return (
    <>
      <Helmet><title>Create Account — Avenue Surface</title></Helmet>

      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-2">Create Account</h1>
            <p className="text-stone-500">Join Avenue Surface — Victoria's flooring specialists</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm space-y-5">

            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogle}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-stone-300 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 hover:border-stone-400 transition-all duration-150"
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400 font-medium">or create with email</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Email form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">First name</label>
                  <input required value={form.firstName} onChange={set('firstName')} className="input-field" placeholder="Jane" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-700 mb-1.5 block">Last name</label>
                  <input required value={form.lastName} onChange={set('lastName')} className="input-field" placeholder="Smith" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">Email</label>
                <input type="email" required value={form.email} onChange={set('email')} className="input-field" placeholder="you@example.com.au" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">Phone (optional)</label>
                <input value={form.phone} onChange={set('phone')} className="input-field" placeholder="04XX XXX XXX" />
              </div>
              <div>
                <label className="text-sm font-medium text-stone-700 mb-1.5 block">Password</label>
                <input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input-field" placeholder="Min. 6 characters" />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.newsletter} onChange={set('newsletter')} className="accent-terra w-4 h-4" />
                <span className="text-sm text-stone-600">Subscribe for exclusive deals and flooring inspiration</span>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3.5 disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500">
              Already have an account?{' '}
              <Link to="/login" className="text-terra font-medium hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
