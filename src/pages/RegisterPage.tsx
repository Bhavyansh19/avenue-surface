import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '', newsletter: false })
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()
  const set = (k: string) => (e: any) => setForm(f => ({...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value}))

  const handle = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try { await register(form); toast.success('Account created! Welcome to Avenue Surface.'); navigate('/') }
    catch (err: any) { toast.error(err.response?.data?.message || 'Registration failed') }
    finally { setLoading(false) }
  }

  return (
    <>
      <Helmet><title>Create Account — Avenue Surface</title></Helmet>
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-2">Create Account</h1>
            <p className="text-stone-500">Join Avenue Surface and get $25 off your first order</p>
          </div>
          <form onSubmit={handle} className="bg-white border border-stone-200 rounded-2xl p-8 space-y-4 shadow-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">First name</label><input required value={form.firstName} onChange={set('firstName')} className="input-field" placeholder="Jane" /></div>
              <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Last name</label><input required value={form.lastName} onChange={set('lastName')} className="input-field" placeholder="Smith" /></div>
            </div>
            <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Email</label><input type="email" required value={form.email} onChange={set('email')} className="input-field" placeholder="you@example.com.au" /></div>
            <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Phone (optional)</label><input value={form.phone} onChange={set('phone')} className="input-field" placeholder="04XX XXX XXX" /></div>
            <div><label className="text-sm font-medium text-stone-700 mb-1.5 block">Password</label><input type="password" required minLength={6} value={form.password} onChange={set('password')} className="input-field" placeholder="Min. 6 characters" /></div>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={form.newsletter} onChange={set('newsletter')} className="accent-terra w-4 h-4" />
              <span className="text-sm text-stone-600">Subscribe to exclusive deals and flooring inspiration</span>
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-stone-500">Already have an account? <Link to="/login" className="text-terra font-medium hover:underline">Sign in</Link></p>
          </form>
        </div>
      </div>
    </>
  )
}
