import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, Heart, Check, Star, ChevronRight, Minus, Plus } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useCartStore } from '../store/cartStore'
import { useAuthStore } from '../store/authStore'
import ProductCard from '../components/ui/ProductCard'

export default function ProductPage() {
  const { slug } = useParams()
  const [product, setProduct]   = useState<any>(null)
  const [related, setRelated]   = useState<any[]>([])
  const [qty, setQty]           = useState(1)
  const [tab, setTab]           = useState<'desc'|'specs'|'reviews'>('desc')
  const [reviewForm, setReview] = useState({ rating: 5, comment: '' })
  const [loading, setLoading]   = useState(true)
  const { addItem }             = useCartStore()
  const { user, toggleWishlist } = useAuthStore()

  useEffect(() => {
    setLoading(true)
    api.get(`/products/${slug}`).then(r => {
      setProduct(r.data.product)
      // fetch related
      api.get('/products', { params: { category: r.data.product.category?._id, limit: 4 } })
        .then(r2 => setRelated(r2.data.products.filter((p: any) => p.slug !== slug)))
    }).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="max-w-screen-xl mx-auto px-6 py-20 text-center text-stone-400">Loading…</div>
  if (!product) return <div className="max-w-screen-xl mx-auto px-6 py-20 text-center"><h2 className="font-serif text-3xl">Product not found</h2><Link to="/shop" className="btn-primary mt-4 inline-block">Back to Shop</Link></div>

  const price   = product.onSale && product.salePrice ? product.salePrice : product.price
  const inWish  = user?.wishlist?.some((w: any) => (w._id || w) === product._id)

  const handleAdd = () => { addItem(product, qty); toast.success(`Added ${qty} × ${product.name.slice(0, 25)}… to cart`) }
  const handleWish = async () => { if (!user) { toast.error('Please sign in'); return } await toggleWishlist(product._id); toast.success(inWish ? 'Removed from wishlist' : 'Saved!') }
  const handleReview = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await api.post(`/products/${product._id}/reviews`, reviewForm); toast.success('Review submitted!'); const r = await api.get(`/products/${slug}`); setProduct(r.data.product) }
    catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
  }

  return (
    <>
      <Helmet><title>{product.name} — Avenue Surface</title></Helmet>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-400 mb-8">
          <Link to="/" className="hover:text-terra">Home</Link><ChevronRight size={13} />
          <Link to="/shop" className="hover:text-terra">Shop</Link><ChevronRight size={13} />
          {product.category && <><Link to={`/shop/${product.category.slug}`} className="hover:text-terra">{product.category.name}</Link><ChevronRight size={13} /></>}
          <span className="text-stone-700 truncate max-w-xs">{product.name}</span>
        </div>

        {/* Main product grid */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="space-y-3">
            <div className="aspect-square rounded-2xl overflow-hidden">
  <img
    src={`https://picsum.photos/400/400?random=${Math.random()}`}
    alt="random"
    className="w-full h-full object-cover"
  />
</div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.slice(0,4).map((img: any, i: number) => (
                  <div key={i} className="w-20 h-20 rounded-lg overflow-hidden border-2 border-stone-200 cursor-pointer">
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.brand && <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-2">{product.brand}</p>}
            <h1 className="font-serif text-3xl font-semibold text-stone-900 mb-3 leading-snug">{product.name}</h1>

            {/* Rating */}
            {product.numReviews > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={14} className={s <= Math.round(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'} />)}</div>
                <span className="text-sm text-stone-500">{product.rating?.toFixed(1)} ({product.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-stone-900">${price.toFixed(2)}</span>
              {product.onSale && <span className="text-lg text-stone-400 line-through">${product.price.toFixed(2)}</span>}
              <span className="text-stone-500">/{product.unit}</span>
              {product.onSale && <span className="badge bg-terra text-white">SALE</span>}
            </div>

            <p className="text-stone-600 leading-relaxed mb-6">{product.shortDescription || product.description?.slice(0, 200)}</p>

            {/* Quick attributes */}
            <div className="flex flex-wrap gap-2 mb-6">
              {product.attributes?.waterproof && <span className="badge bg-blue-50 text-blue-700 text-xs">💧 Waterproof</span>}
              {product.attributes?.fscCertified && <span className="badge bg-green-50 text-green-700 text-xs">🌿 FSC Certified</span>}
              {product.attributes?.diyFriendly && <span className="badge bg-amber-50 text-amber-700 text-xs">🔨 DIY-Friendly</span>}
              {product.attributes?.slipRating && <span className="badge bg-stone-100 text-stone-700 text-xs">Slip: {product.attributes.slipRating}</span>}
              {product.attributes?.warranty && <span className="badge bg-stone-100 text-stone-700 text-xs">⚡ {product.attributes.warranty} warranty</span>}
            </div>

            {/* Qty + Add to cart */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center border border-stone-300 rounded-lg">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-3 text-stone-500 hover:text-stone-900 transition-colors"><Minus size={14} /></button>
                <span className="px-4 text-sm font-medium w-12 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="px-3 py-3 text-stone-500 hover:text-stone-900 transition-colors"><Plus size={14} /></button>
              </div>
              <button onClick={handleAdd} className="btn-primary flex-1 flex items-center justify-center gap-2"><ShoppingCart size={16} />Add to Cart</button>
              <button onClick={handleWish} className={`p-3 border rounded-lg transition-colors ${inWish ? 'border-red-300 text-red-500' : 'border-stone-300 text-stone-400 hover:text-red-400'}`}><Heart size={16} fill={inWish ? 'currentColor' : 'none'} /></button>
            </div>

            <Link to="/contact" className="btn-outline w-full text-center block mb-6">Get a Quote for This Product</Link>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 pt-6 border-t border-stone-200">
              {[['🚛','Free delivery over $500'],['📦','Sample for $8.33'],['🛡️','Up to 25yr warranty'],['✅','AS 1884 compliant']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-xs text-stone-500"><span>{icon}</span>{text}</div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex gap-1 border-b border-stone-200 mb-8">
            {([['desc','Description'],['specs','Specifications'],['reviews',`Reviews (${product.numReviews})`]] as const).map(([key, label]) => (
              <button key={key} onClick={() => setTab(key as any)} className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${tab === key ? 'border-stone-900 text-stone-900' : 'border-transparent text-stone-500 hover:text-stone-700'}`}>{label}</button>
            ))}
          </div>

          {tab === 'desc' && <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed">{product.description}</div>}

          {tab === 'specs' && (
            <div className="max-w-lg">
              <table className="w-full text-sm">
                <tbody>
                  {product.specs?.map((s: any) => (
                    <tr key={s.key} className="border-b border-stone-100">
                      <td className="py-3 pr-6 font-medium text-stone-700 w-1/3">{s.key}</td>
                      <td className="py-3 text-stone-500">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'reviews' && (
            <div className="max-w-2xl space-y-8">
              {product.reviews?.map((r: any) => (
                <div key={r._id} className="border-b border-stone-100 pb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'} />)}</div>
                    <span className="font-medium text-sm text-stone-800">{r.name}</span>
                    <span className="text-xs text-stone-400">{new Date(r.createdAt).toLocaleDateString('en-AU')}</span>
                  </div>
                  <p className="text-sm text-stone-600">{r.comment}</p>
                </div>
              ))}

              {user && (
                <form onSubmit={handleReview} className="bg-stone-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-stone-900">Write a Review</h3>
                  <div>
                    <label className="text-sm text-stone-600 mb-1 block">Rating</label>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(s => (
                        <button key={s} type="button" onClick={() => setReview(r => ({ ...r, rating: s }))} className={`text-xl transition-colors ${s <= reviewForm.rating ? 'text-amber-400' : 'text-stone-300'}`}>★</button>
                      ))}
                    </div>
                  </div>
                  <textarea value={reviewForm.comment} onChange={e => setReview(r => ({ ...r, comment: e.target.value }))} rows={4} placeholder="Share your experience…" className="input-field" required />
                  <button type="submit" className="btn-primary">Submit Review</button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
