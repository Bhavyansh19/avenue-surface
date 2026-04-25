import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Package, ShoppingBag, Users, FileText, TrendingUp, AlertTriangle } from 'lucide-react'
import api from '../../lib/api'

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/stats').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  const STATUS_COLOUR: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  if (loading) return <div className="text-stone-400 text-sm">Loading dashboard…</div>

  const stats = data?.stats || {}
  const STAT_CARDS = [
    { label: 'Total Revenue', value: `$${(stats.totalRevenue || 0).toLocaleString('en-AU', { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-green-600 bg-green-50' },
    { label: 'Total Orders',  value: stats.totalOrders || 0,    icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Products',      value: stats.totalProducts || 0,  icon: Package,     color: 'text-purple-600 bg-purple-50' },
    { label: 'Customers',     value: stats.totalUsers || 0,     icon: Users,       color: 'text-orange-600 bg-orange-50' },
    { label: 'Blog Posts',    value: stats.totalBlogs || 0,     icon: FileText,    color: 'text-teal-600 bg-teal-50' },
  ]

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {STAT_CARDS.map(s => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-5">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon size={18} />
            </div>
            <div className="text-2xl font-bold text-stone-900 mb-0.5">{s.value}</div>
            <div className="text-xs text-stone-400">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-stone-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-terra hover:underline">View all →</Link>
          </div>
          <div className="space-y-3">
            {data?.recentOrders?.length === 0 && <p className="text-sm text-stone-400">No orders yet</p>}
            {data?.recentOrders?.map((o: any) => (
              <div key={o._id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-stone-900">{o.orderNumber}</p>
                  <p className="text-xs text-stone-400">{o.user?.firstName} {o.user?.lastName}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge text-[11px] ${STATUS_COLOUR[o.status] || 'bg-stone-100 text-stone-600'}`}>{o.status}</span>
                  <span className="text-sm font-semibold text-stone-900">${o.total?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white border border-stone-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-stone-900 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500" />Low Stock Alerts</h2>
            <Link to="/admin/products" className="text-xs text-terra hover:underline">Manage →</Link>
          </div>
          <div className="space-y-3">
            {data?.lowStock?.length === 0 && <p className="text-sm text-stone-400 flex items-center gap-2">✅ All products well stocked</p>}
            {data?.lowStock?.map((p: any) => (
              <div key={p._id} className="flex items-center justify-between py-2.5 border-b border-stone-100 last:border-0">
                <p className="text-sm text-stone-800 line-clamp-1 flex-1 pr-4">{p.name}</p>
                <span className={`badge text-xs flex-shrink-0 ${p.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{p.stock} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-6">
        <h2 className="font-semibold text-stone-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/products" className="btn-primary text-sm px-4 py-2">+ Add Product</Link>
          <Link to="/admin/blog"     className="btn-outline text-sm px-4 py-2">+ New Blog Post</Link>
          <Link to="/admin/orders"   className="btn-outline text-sm px-4 py-2">View All Orders</Link>
          <Link to="/admin/users"    className="btn-outline text-sm px-4 py-2">Manage Users</Link>
          <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer" className="btn-outline text-sm px-4 py-2">Stripe Dashboard ↗</a>
          <a href="https://tilesview.ai/tvdesh"  target="_blank" rel="noreferrer" className="btn-outline text-sm px-4 py-2">TilesView Admin ↗</a>
        </div>
      </div>
    </div>
  )
}
