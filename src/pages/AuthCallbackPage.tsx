// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FILE: client/src/pages/AuthCallbackPage.tsx  (NEW FILE — create this)
// PURPOSE: Google redirects here after login. We call /api/auth/me
//          to load the user into Zustand, then go to homepage.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const { fetchMe }    = useAuthStore()

  useEffect(() => {
    const error = searchParams.get('error')

    if (error) {
      toast.error('Google sign-in failed. Please try again.')
      navigate('/login')
      return
    }

    // Cookie is already set by backend — just fetch the user
    fetchMe()
      .then(() => {
        toast.success('Signed in with Google!')
        navigate('/')
      })
      .catch(() => {
        toast.error('Something went wrong. Please try again.')
        navigate('/login')
      })
  }, [])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-stone-200 border-t-terra rounded-full animate-spin" />
      <p className="text-stone-500 text-sm">Signing you in…</p>
    </div>
  )
}
