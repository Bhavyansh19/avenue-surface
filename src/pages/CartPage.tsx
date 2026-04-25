// CartPage
import { Link, useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'

export function CartPage() {
  const { items, removeItem, updateQty, subtotal, shipping, gst, total } = useCartStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  if (items.length === 0) return (
    <div className="max-w-screen-xl mx-auto px-6 py-20 text-center">
      <ShoppingBag size={64} className="text-stone-200 mx-auto mb-6" />
      <h2 className="font-serif text-4xl text-stone-700 mb-3">Your cart is empty</h2>
      <p className="text-stone-500 mb-8">Discover over 1,200 premium flooring products.</p>
      <Link to="/shop" className="btn-primary">Browse Products</Link>
    </div>
  )

  return (
    <>
      <Helmet><title>Cart — Avenue Surface</title></Helmet>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-10">Your Cart</h1>
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const price = item.onSale && item.salePrice ? item.salePrice : item.price
              return (
                <div key={item._id} className="flex gap-4 bg-white border border-stone-200 rounded-xl p-4">
                  <div className="w-20 h-20 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.coverImage ? <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover" /> :
                      <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.slug}`} className="text-sm font-medium text-stone-900 hover:text-terra transition-colors line-clamp-2">{item.name}</Link>
                    <p className="text-sm text-stone-500 mt-1">${price.toFixed(2)}/{item.unit}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-stone-200 rounded-lg">
                        <button onClick={() => updateQty(item._id, item.qty - 1)} className="px-2.5 py-1.5 text-stone-500 hover:text-stone-900"><Minus size={12} /></button>
                        <span className="px-3 text-sm font-medium">{item.qty}</span>
                        <button onClick={() => updateQty(item._id, item.qty + 1)} className="px-2.5 py-1.5 text-stone-500 hover:text-stone-900"><Plus size={12} /></button>
                      </div>
                      <button onClick={() => removeItem(item._id)} className="text-stone-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-stone-900">${(price * item.qty).toFixed(2)}</p>
                    <p className="text-xs text-stone-400">{item.qty} {item.unit}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-semibold text-stone-900 mb-5">Order Summary</h2>
            <div className="space-y-3 text-sm mb-5">
              <div className="flex justify-between text-stone-600"><span>Subtotal</span><span>${subtotal().toFixed(2)}</span></div>
              <div className="flex justify-between text-stone-600"><span>Shipping</span><span className={shipping() === 0 ? 'text-green-600 font-medium' : ''}>{shipping() === 0 ? 'FREE' : `$${shipping().toFixed(2)}`}</span></div>
              <div className="flex justify-between text-stone-600"><span>GST (10%)</span><span>${gst().toFixed(2)}</span></div>
              {subtotal() < 500 && <p className="text-xs text-stone-400 bg-stone-100 rounded-lg px-3 py-2">Add ${(500 - subtotal()).toFixed(2)} more for free shipping</p>}
              <div className="flex justify-between font-bold text-stone-900 text-base border-t border-stone-200 pt-3"><span>Total</span><span>${total().toFixed(2)}</span></div>
            </div>
            <button onClick={() => user ? navigate('/checkout') : navigate('/login')} className="btn-primary w-full mb-3">
              {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
            </button>
            <Link to="/shop" className="btn-outline w-full text-center block text-sm">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default CartPage
