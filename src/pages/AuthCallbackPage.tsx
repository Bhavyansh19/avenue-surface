import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function AuthCallbackPage() {
  const navigate       = useNavigate()
  const [searchParams] = useSearchParams()
  const { setTokenAndFetch } = useAuthStore()
  const ran = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const error = searchParams.get('error')
    const token = searchParams.get('token')

    if (error || !token) {
      toast.error('Google sign-in failed. Please try again.')
      navigate('/login')
      return
    }

    // Store token + fetch user in one call
    setTokenAndFetch(token)
      .then(() => {
        const user = useAuthStore.getState().user
        if (!user) throw new Error('no user')
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
