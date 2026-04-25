import { useState, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

const STATUSES = ['pending','confirmed','processing','shipped','delivered','cancelled']
const STATUS_COLOUR: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800', confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800', shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800',
}

export default function AdminOrders() {
  const [orders,  setOrders]  = useState<any[]>([])
  const [total,   setTotal]   = useState(0)
  const [page,    setPage]    = useState(1)
  const [status,  setStatus]  = useState('')
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState<any>(null)
  const [updForm, setUpdForm] = useState({ status: '', trackingNumber: '' })
  const [saving,  setSaving]  = useState(false)

  const load = () => {
    setLoading(true)
    const params: any = { page, limit: 15 }
    if (status) params.status = status
    api.get('/orders', { params }).then(r => { setOrders(r.data.orders); setTotal(r.data.total) }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, status])

  const openUpdate = (order: any) => {
    setModal(order)
    setUpdForm({ status: order.status, trackingNumber: order.trackingNumber || '' })
  }

  const handleUpdate = async () => {
    setSaving(true)
    try {
      await api.put(`/orders/${modal._id}/status`, updForm)
      toast.success('Order updated')
      setModal(null); load()
    } catch { toast.error('Update failed') }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => { setStatus(''); setPage(1) }} className={`px-3 py-1.5 rounded-full text-xs font-medium ${!status ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}>All</button>
          {STATUSES.map(s => <button key={s} onClick={() => { setStatus(s); setPage(1) }} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${status === s ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}>{s}</button>)}
        </div>
        <span className="text-sm text-stone-400 ml-auto">{total} orders</span>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['Order','Customer','Date','Items','Total','Status','Action'].map(h => <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? <tr><td colSpan={7} className="text-center py-10 text-stone-400">Loading…</td></tr>
              : orders.map(o => (
              <tr key={o._id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-stone-900">{o.orderNumber}</td>
                <td className="px-5 py-3.5"><p className="text-stone-800">{o.user?.firstName} {o.user?.lastName}</p><p className="text-xs text-stone-400">{o.user?.email}</p></td>
                <td className="px-5 py-3.5 text-stone-500 text-xs">{new Date(o.createdAt).toLocaleDateString('en-AU')}</td>
                <td className="px-5 py-3.5 text-stone-500">{o.items?.length}</td>
                <td className="px-5 py-3.5 font-semibold text-stone-900">${o.total?.toFixed(2)}</td>
                <td className="px-5 py-3.5"><span className={`badge text-xs ${STATUS_COLOUR[o.status] || 'bg-stone-100 text-stone-600'}`}>{o.status}</span>{!o.isPaid && <span className="badge bg-red-50 text-red-600 text-[10px] ml-1">Unpaid</span>}</td>
                <td className="px-5 py-3.5"><button onClick={() => openUpdate(o)} className="text-xs font-medium text-terra hover:underline">Update</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {Math.ceil(total / 15) > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(total / 15) }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded text-sm ${page === n ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>{n}</button>
          ))}
        </div>
      )}

      {/* Update modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h2 className="font-semibold text-stone-900">Update Order {modal.orderNumber}</h2>
              <button onClick={() => setModal(null)} className="text-stone-400 hover:text-stone-700"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 block">Status</label>
                <select value={updForm.status} onChange={e => setUpdForm(f => ({...f, status: e.target.value}))} className="input-field">
                  {STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5 block">Tracking Number</label>
                <input value={updForm.trackingNumber} onChange={e => setUpdForm(f => ({...f, trackingNumber: e.target.value}))} className="input-field" placeholder="e.g. 1Z999AA1234567890" />
              </div>

              {/* Order summary */}
              <div className="bg-stone-50 rounded-lg p-3 text-xs space-y-1.5 text-stone-600">
                <div className="flex justify-between"><span>Subtotal</span><span>${modal.subtotal?.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>{modal.shippingCost === 0 ? 'FREE' : `$${modal.shippingCost?.toFixed(2)}`}</span></div>
                <div className="flex justify-between"><span>GST</span><span>${modal.gst?.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-stone-900 border-t border-stone-200 pt-1.5"><span>Total</span><span>${modal.total?.toFixed(2)}</span></div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 flex justify-end gap-3">
              <button onClick={() => setModal(null)} className="btn-outline text-sm py-2">Cancel</button>
              <button onClick={handleUpdate} disabled={saving} className="btn-primary text-sm py-2 flex items-center gap-2 disabled:opacity-60"><Check size={14} />{saving ? 'Saving…' : 'Update Order'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
