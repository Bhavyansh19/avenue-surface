import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, ShoppingBag, FileText, Users, LogOut, ExternalLink } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const navItems = [
  { label: 'Dashboard', to: '/admin',          icon: LayoutDashboard },
  { label: 'Products',  to: '/admin/products', icon: Package },
  { label: 'Orders',    to: '/admin/orders',   icon: ShoppingBag },
  { label: 'Blog',      to: '/admin/blog',     icon: FileText },
  { label: 'Users',     to: '/admin/users',    icon: Users },
]

export default function AdminLayout() {
  const { pathname } = useLocation()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Sidebar */}
      <aside className="w-60 bg-stone-900 flex flex-col">
        <div className="p-6 border-b border-stone-700">
          <div className="font-serif text-lg font-semibold text-white">Avenue Surface</div>
          <div className="text-xs text-stone-400 mt-0.5">Admin Dashboard</div>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(item => {
            const active = pathname === item.to || (item.to !== '/admin' && pathname.startsWith(item.to))
            return (
              <Link key={item.to} to={item.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-terra text-white' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}>
                <item.icon size={16} />{item.label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-stone-700 flex flex-col gap-2">
          <Link to="/" target="_blank" className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors px-3 py-2">
            <ExternalLink size={14} />View Store
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-stone-400 hover:text-red-400 transition-colors px-3 py-2">
            <LogOut size={14} />Sign Out ({user?.firstName})
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-stone-200 px-8 py-4">
          <h1 className="text-lg font-semibold text-stone-800">
            {navItems.find(n => pathname === n.to || (n.to !== '/admin' && pathname.startsWith(n.to)))?.label || 'Dashboard'}
          </h1>
        </header>
        <main className="flex-1 p-8"><Outlet /></main>
      </div>
    </div>
  )
}
