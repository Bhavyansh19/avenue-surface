import { create } from 'zustand'

interface CompareStore {
  items: any[]
  toggle: (product: any) => void
  canAdd: () => boolean
  clear: () => void
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  toggle: (product) => {
    const { items } = get()
    const exists = items.find(p => p._id === product._id)
    if (exists) {
      set({ items: items.filter(p => p._id !== product._id) })
    } else {
      if (items.length >= 3) return
      set({ items: [...items, product] })
    }
  },
  canAdd: () => get().items.length < 3,
  clear: () => set({ items: [] }),
}))