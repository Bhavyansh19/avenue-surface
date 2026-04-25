import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

export const applyTheme = (theme: Theme) => {
  const root = document.documentElement
  root.classList.remove('dark') // forcing light mode
}