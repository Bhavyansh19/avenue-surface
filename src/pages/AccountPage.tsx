import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuthStore } from '../store/authStore'

const tabs = ['Orders','Profile','Wishlist','Addresses']

export default function AccountPage() {
  const [tab, setTab]     = useState('Orders')
  const [orders, setOrders] = useState<any[]>([])
  const { user, updateProfile } = useAuthStore()
  const [profile, setProfile] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' })

  useEffect(() => { api.get('/orders/my').then(r => setOrders(r.data.orders)) }, [])

  const handleProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await updateProfile(profile); toast.success('Profile updated') }
    catch { toast.error('Update failed') }
  }

  const STATUS_COLOUR: Record<string, string> = { pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800', processing: 'bg-purple-100 text-purple-800', shipped: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' }

  return (
    <>
      <Helmet><title>My Account — Avenue Surface</title></Helmet>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-semibold text-stone-900">My Account</h1>
          <p className="text-stone-500 mt-1">Welcome back, {user?.firstName}</p>
        </div>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 flex-shrink-0 hidden sm:block">
            <nav className="space-y-1">
              {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t ? 'bg-stone-800 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>{t}</button>)}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile tabs */}
            <div className="flex gap-2 mb-6 sm:hidden overflow-x-auto">
              {tabs.map(t => <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium flex-shrink-0 ${tab === t ? 'bg-stone-800 text-white' : 'bg-stone-100 text-stone-600'}`}>{t}</button>)}
            </div>

            {tab === 'Orders' && (
              <div>
                <h2 className="font-semibold text-stone-900 mb-5">My Orders</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-16 bg-stone-50 rounded-xl">
                    <p className="text-stone-500 mb-4">No orders yet</p>
                    <Link to="/shop" className="btn-primary">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map(o => (
                      <div key={o._id} className="bg-white border border-stone-200 rounded-xl p-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                          <div>
                            <p className="font-semibold text-stone-900">{o.orderNumber}</p>
                            <p className="text-xs text-stone-400">{new Date(o.createdAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`badge text-xs ${STATUS_COLOUR[o.status] || 'bg-stone-100 text-stone-600'}`}>{o.status}</span>
                            <span className="font-semibold text-stone-900">${o.total?.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-sm text-stone-500">{o.items?.length} item{o.items?.length > 1 ? 's' : ''}</div>
                        {o.trackingNumber && <p className="text-xs text-terra mt-2">Tracking: {o.trackingNumber}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'Profile' && (
              <div className="max-w-sm">
                <h2 className="font-semibold text-stone-900 mb-5">Profile Details</h2>
                <form onSubmit={handleProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div><label className="text-xs font-medium text-stone-500 mb-1 block">First name</label><input value={profile.firstName} onChange={e => setProfile(p => ({...p, firstName: e.target.value}))} className="input-field" /></div>
                    <div><label className="text-xs font-medium text-stone-500 mb-1 block">Last name</label><input value={profile.lastName} onChange={e => setProfile(p => ({...p, lastName: e.target.value}))} className="input-field" /></div>
                  </div>
                  <div><label className="text-xs font-medium text-stone-500 mb-1 block">Email</label><input value={user?.email} disabled className="input-field bg-stone-50 text-stone-400" /></div>
                  <div><label className="text-xs font-medium text-stone-500 mb-1 block">Phone</label><input value={profile.phone} onChange={e => setProfile(p => ({...p, phone: e.target.value}))} className="input-field" /></div>
                  <button type="submit" className="btn-primary">Save Changes</button>
                </form>
              </div>
            )}

            {tab === 'Wishlist' && (
              <div>
                <h2 className="font-semibold text-stone-900 mb-5">Saved Products</h2>
                {!user?.wishlist?.length ? (
                  <div className="text-center py-16 bg-stone-50 rounded-xl">
                    <p className="text-stone-500 mb-4">No saved products yet</p>
                    <Link to="/shop" className="btn-primary">Browse Products</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {user.wishlist.map((p: any) => (
                      <Link key={p._id || p} to={`/product/${p.slug}`} className="card-hover p-4 flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${p.gradientFrom || '#D4C9BE'}, ${p.gradientTo || '#B8ADA0'})` }} />
                        <div className="min-w-0"><p className="text-sm font-medium text-stone-800 line-clamp-2">{p.name}</p><p className="text-sm text-terra font-semibold mt-0.5">${p.price?.toFixed(2)}/m²</p></div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'Addresses' && (
              <div>
                <h2 className="font-semibold text-stone-900 mb-5">Saved Addresses</h2>
                {user?.addresses?.length === 0 ? <p className="text-stone-500">No saved addresses yet. Addresses are saved during checkout.</p> : (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {user?.addresses?.map((a: any, i: number) => (
                      <div key={i} className="border border-stone-200 rounded-xl p-5">
                        {a.isDefault && <span className="badge bg-stone-100 text-stone-600 text-xs mb-2">Default</span>}
                        <p className="font-medium text-stone-900">{a.fullName}</p>
                        <p className="text-sm text-stone-500 mt-1">{a.line1}{a.line2 && `, ${a.line2}`}</p>
                        <p className="text-sm text-stone-500">{a.suburb} {a.state} {a.postcode}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
