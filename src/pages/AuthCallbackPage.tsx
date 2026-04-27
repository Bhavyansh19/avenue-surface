// FILE: client/src/pages/AuthCallbackPage.tsx
// Replace your existing AuthCallbackPage.tsx with this

import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
import api from '../lib/api'

export default function AuthCallbackPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const ran            = useRef(false)

  useEffect(() => {
    // Prevent double-run in React StrictMode
    if (ran.current) return
    ran.current = true

    const error = searchParams.get('error')

    if (error) {
      toast.error('Google sign-in failed. Please try again.')
      navigate('/login')
      return
    }

    // Backend already set the httpOnly cookie.
    // Call /me to get the user object, then manually hydrate Zustand.
    api.get('/auth/me')
      .then(res => {
        const user = res.data.user
        if (!user) throw new Error('No user')

        // Write into Zustand persist storage in localStorage
        try {
          const raw     = localStorage.getItem('avenue-auth')
          const parsed  = raw ? JSON.parse(raw) : {}
          parsed.state  = { ...(parsed.state || {}), user }
          localStorage.setItem('avenue-auth', JSON.stringify(parsed))
        } catch {}

        // Update live Zustand state directly
        useAuthStore.setState({ user })

        toast.success(`Welcome, ${user.firstName}!`)
        navigate('/')
      })
      .catch(() => {
        toast.error('Sign-in failed. Please try again.')
        navigate('/login')
      })
  }, [])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div
        className="w-10 h-10 border-4 border-stone-200 rounded-full animate-spin"
        style={{ borderTopColor: '#C4622D' }}
      />
      <p className="text-stone-500 text-sm">Signing you in with Google…</p>
    </div>
  )
}
