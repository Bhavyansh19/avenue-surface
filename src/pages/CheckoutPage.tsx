import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import api from '../lib/api'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

// ⚠️ CHANGE THIS: Replace with your Stripe publishable key from https://dashboard.stripe.com/test/apikeys
const stripePromise = loadStripe('' + import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY + '')

const AU_STATES = ['NSW','VIC','QLD','SA','WA','TAS','NT','ACT']

function CheckoutForm() {
  const stripe   = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { items, subtotal, shipping, gst, total, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [addr, setAddr] = useState({
    fullName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    line1: '', line2: '', suburb: '', state: 'NSW', postcode: '', phone: user?.phone || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    try {
      // 1. Create order
      const orderRes = await api.post('/orders', {
        items: items.map(i => ({ product: i._id, qty: i.qty })),
        shippingAddress: addr,
        paymentMethod: 'stripe',
      })
      const order = orderRes.data.order

      // 2. Create payment intent
      const piRes = await api.post('/payment/create-payment-intent', { orderId: order._id })
      const { clientSecret } = piRes.data

      // 3. Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      })

      if (result.error) {
        toast.error(result.error.message || 'Payment failed')
        setLoading(false)
        return
      }

      // 4. Mark as paid
      await api.put(`/orders/${order._id}/pay`, { id: result.paymentIntent.id, status: result.paymentIntent.status })
      clearCart()
      navigate(`/order-success/${order._id}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-10">
      {/* Shipping */}
      <div>
        <h2 className="font-semibold text-stone-900 mb-5">Shipping Address</h2>
        <div className="space-y-3">
          <input required placeholder="Full name" value={addr.fullName} onChange={e => setAddr(a => ({...a, fullName: e.target.value}))} className="input-field" />
          <input required placeholder="Street address" value={addr.line1} onChange={e => setAddr(a => ({...a, line1: e.target.value}))} className="input-field" />
          <input placeholder="Apt, suite, unit (optional)" value={addr.line2} onChange={e => setAddr(a => ({...a, line2: e.target.value}))} className="input-field" />
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Suburb" value={addr.suburb} onChange={e => setAddr(a => ({...a, suburb: e.target.value}))} className="input-field" />
            <select required value={addr.state} onChange={e => setAddr(a => ({...a, state: e.target.value}))} className="input-field">
              {AU_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Postcode" value={addr.postcode} onChange={e => setAddr(a => ({...a, postcode: e.target.value}))} className="input-field" />
            <input placeholder="Phone" value={addr.phone} onChange={e => setAddr(a => ({...a, phone: e.target.value}))} className="input-field" />
          </div>
        </div>

        <h2 className="font-semibold text-stone-900 mt-8 mb-5">Payment</h2>
        <div className="border border-stone-300 rounded-lg p-4">
          <CardElement options={{ style: { base: { fontSize: '15px', fontFamily: '"DM Sans", sans-serif', color: '#2C2C2C', '::placeholder': { color: '#8B7D72' } } } }} />
        </div>
        <p className="text-xs text-stone-400 mt-2 flex items-center gap-1">🔒 Payments processed securely by Stripe. We never store your card details.</p>

        {/* Test card hint */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4 text-xs text-amber-800">
          <strong>Test mode:</strong> Use card 4242 4242 4242 4242, any future date, any CVC.
        </div>
      </div>

      {/* Summary */}
      <div>
        <h2 className="font-semibold text-stone-900 mb-5">Order Summary</h2>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4 mb-6">
          {items.map(item => {
            const price = item.onSale && item.salePrice ? item.salePrice : item.price
            return (
              <div key={item._id} className="flex justify-between text-sm">
                <span className="text-stone-700 line-clamp-1 flex-1 pr-3">{item.name} × {item.qty}</span>
                <span className="font-medium flex-shrink-0">${(price * item.qty).toFixed(2)}</span>
              </div>
            )
          })}
          <div className="border-t border-stone-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>${subtotal().toFixed(2)}</span></div>
            <div className="flex justify-between text-stone-500"><span>Shipping</span><span>{shipping() === 0 ? <span className="text-green-600">FREE</span> : `$${shipping().toFixed(2)}`}</span></div>
            <div className="flex justify-between text-stone-500"><span>GST (10%)</span><span>${gst().toFixed(2)}</span></div>
            <div className="flex justify-between font-bold text-stone-900 text-base border-t pt-2"><span>Total (AUD)</span><span>${total().toFixed(2)}</span></div>
          </div>
        </div>

        <button type="submit" disabled={loading || !stripe} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Processing…' : `Pay $${total().toFixed(2)} AUD`}
        </button>
        <p className="text-xs text-stone-400 text-center mt-3">By placing your order you agree to our <a href="#" className="underline">Terms & Conditions</a></p>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Helmet><title>Checkout — Avenue Surface</title></Helmet>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <Link to="/cart" className="text-sm text-stone-500 hover:text-terra">← Back to Cart</Link>
          <span className="text-stone-300">|</span>
          <h1 className="font-serif text-3xl font-semibold text-stone-900">Checkout</h1>
        </div>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </>
  )
}
