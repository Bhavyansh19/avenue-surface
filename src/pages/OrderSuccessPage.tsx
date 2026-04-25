import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import api from '../lib/api'

export function OrderSuccessPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<any>(null)
  useEffect(() => { api.get(`/orders/${id}`).then(r => setOrder(r.data.order)) }, [id])
  return (
    <div className="max-w-lg mx-auto px-6 py-20 text-center">
      <CheckCircle size={64} className="text-green-500 mx-auto mb-6" />
      <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">Order Confirmed!</h1>
      {order && <p className="text-stone-500 mb-2">Order <strong>{order.orderNumber}</strong></p>}
      <p className="text-stone-500 mb-8">Thank you for your order. We'll send a confirmation email shortly and keep you updated on delivery.</p>
      <div className="flex gap-3 justify-center">
        <Link to="/account" className="btn-primary">View My Orders</Link>
        <Link to="/shop" className="btn-outline">Continue Shopping</Link>
      </div>
    </div>
  )
}

export default OrderSuccessPage
