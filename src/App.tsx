import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/authStore'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import AuthCallbackPage from './pages/AuthCallbackPage'


import HomePage         from './pages/HomePage'
import ShopPage         from './pages/ShopPage'
import ProductPage      from './pages/ProductPage'
import CartPage         from './pages/CartPage'
import CheckoutPage     from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import BlogPage         from './pages/BlogPage'
import { BlogPostPage } from './pages/BlogPage'
import FloorFinderPage  from './pages/FloorFinderPage'
import AccountPage      from './pages/AccountPage'
import LoginPage        from './pages/LoginPage'
import RegisterPage     from './pages/RegisterPage'
import VisualizerPage   from './pages/VisualizerPage'
import { AboutPage }    from './pages/AboutPage'
import { ContactPage }  from './pages/AboutPage'
import BookMeasurePage  from './pages/BookMeasurePage'
import { TermsPage }    from './pages/TermsPage'
import NotFoundPage     from './pages/NotFoundPage'

import AdminDashboard   from './pages/admin/AdminDashboard'
import AdminProducts    from './pages/admin/AdminProducts'
import AdminOrders      from './pages/admin/AdminOrders'
import AdminBlog        from './pages/admin/AdminBlog'
import AdminUsers       from './pages/admin/AdminUsers'

const ProtectedRoute = ({ children }: { children: any }) => {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }: { children: any }) => {
  const { user } = useAuthStore()
  return user?.role === 'admin' ? children : <Navigate to="/" replace />
}

export default function App() {
  const { fetchMe } = useAuthStore()

  useEffect(() => {
    fetchMe()
  }, [])

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/"                   element={<HomePage />} />
        

        {/* 🔥 FIX ADDED HERE */}
        <Route path="/products"           element={<ShopPage />} />

        <Route path="/shop"               element={<ShopPage />} />
        <Route path="/shop/:category"     element={<ShopPage />} />

        <Route path="/product/:slug"      element={<ProductPage />} />
        <Route path="/cart"               element={<CartPage />} />
        <Route path="/blog"               element={<BlogPage />} />
        <Route path="/blog/:slug"         element={<BlogPostPage />} />
        <Route path="/floor-finder"       element={<FloorFinderPage />} />
        <Route path="/visualizer"         element={<VisualizerPage />} />
        <Route path="/about"              element={<AboutPage />} />
        <Route path="/contact"            element={<ContactPage />} />
        <Route path="/book-measure"       element={<BookMeasurePage />} />
        <Route path="/terms"              element={<TermsPage />} />
        <Route path="/privacy"            element={<TermsPage />} />
        <Route path="/login"              element={<LoginPage />} />
        <Route path="/register"           element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/checkout"           element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/order-success/:id"  element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
        <Route path="/account"            element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      </Route>

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index                      element={<AdminDashboard />} />
        <Route path="products"            element={<AdminProducts />} />
        <Route path="orders"              element={<AdminOrders />} />
        <Route path="blog"                element={<AdminBlog />} />
        <Route path="users"               element={<AdminUsers />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}