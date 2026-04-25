import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem { _id: string; name: string; price: number; salePrice?: number; onSale: boolean; qty: number; unit: string; coverImage?: string; gradientFrom: string; gradientTo: string; slug: string }

interface CartStore {
  items: CartItem[]
  addItem: (product: any, qty?: number) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  totalItems: () => number
  subtotal: () => number
  shipping: () => number
  gst: () => number
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, qty = 1) => {
        set(s => {
          const existing = s.items.find(i => i._id === product._id)
          if (existing) return { items: s.items.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i) }
          return { items: [...s.items, { _id: product._id, name: product.name, price: product.price, salePrice: product.salePrice, onSale: product.onSale, qty, unit: product.unit || 'm²', coverImage: product.coverImage, gradientFrom: product.gradientFrom || '#D4C9BE', gradientTo: product.gradientTo || '#B8ADA0', slug: product.slug }] }
        })
      },
      removeItem: (id) => set(s => ({ items: s.items.filter(i => i._id !== id) })),
      updateQty: (id, qty) => set(s => ({ items: qty <= 0 ? s.items.filter(i => i._id !== id) : s.items.map(i => i._id === id ? { ...i, qty } : i) })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((a, i) => a + i.qty, 0),
      subtotal: () => get().items.reduce((a, i) => a + (i.onSale && i.salePrice ? i.salePrice : i.price) * i.qty, 0),
      shipping: () => { const s = get().subtotal(); return s >= 500 ? 0 : 49 },
      gst: () => parseFloat((get().subtotal() * 0.1).toFixed(2)),
      total: () => parseFloat((get().subtotal() + get().shipping() + get().gst()).toFixed(2)),
    }),
    { name: 'avenue-cart' }
  )
)
