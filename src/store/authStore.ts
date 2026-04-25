import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'

interface User { _id: string; firstName: string; lastName: string; email: string; role: string; phone?: string; addresses: any[]; wishlist: any[] }

interface AuthStore {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  updateProfile: (data: any) => Promise<void>
  toggleWishlist: (productId: string) => Promise<void>
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password })
        set({ user: data.user })
      },
      register: async (formData) => {
        const { data } = await api.post('/auth/register', formData)
        set({ user: data.user })
      },
      logout: async () => {
        await api.post('/auth/logout')
        set({ user: null })
      },
      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data.user })
        } catch { set({ user: null }) }
      },
      updateProfile: async (formData) => {
        const { data } = await api.put('/auth/profile', formData)
        set({ user: data.user })
      },
      toggleWishlist: async (productId) => {
        const { data } = await api.put(`/auth/wishlist/${productId}`)
        set(s => s.user ? { user: { ...s.user, wishlist: data.wishlist } } : {})
      },
    }),
    { name: 'avenue-auth', partialize: (s) => ({ user: s.user }) }
  )
)
