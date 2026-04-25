import { Link } from 'react-router-dom'
import { ShoppingCart, Heart, GitCompare } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useAuthStore } from '../../store/authStore'
import { useCompareStore } from '../../store/compareStore'
import toast from 'react-hot-toast'

interface Props { product: any; className?: string }

// ── Recently viewed helpers ─────────────────────────────────────────────────
export const trackRecentlyViewed = (product: any) => {
  try {
    const key     = 'av-recently-viewed'
    const stored: any[] = JSON.parse(localStorage.getItem(key) || '[]')
    const updated = [product, ...stored.filter(p => p._id !== product._id)].slice(0, 8)
    localStorage.setItem(key, JSON.stringify(updated))
  } catch {}
}

export const getRecentlyViewed = (): any[] => {
  try { return JSON.parse(localStorage.getItem('av-recently-viewed') || '[]') }
  catch { return [] }
}

// ── Main component ───────────────────────────────────────────────────────────
export default function ProductCard({ product, className = '' }: Props) {
  const { addItem }              = useCartStore()
  const { user, toggleWishlist } = useAuthStore()
  const { items: compareItems, toggle: toggleCompare, canAdd } = useCompareStore()

  const effectivePrice = product.onSale && product.salePrice ? product.salePrice : product.price
  const inWish   = user?.wishlist?.some((w: any) => (w._id || w) === product._id)
  const inComp   = compareItems.some(p => p._id === product._id)
  const loggedIn = !!user

  // Pick first available image
  const imgSrc = product.images?.[0]?.url || product.coverImage || null

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!loggedIn) { toast.error('Please sign in to add items to cart'); return }
    addItem(product)
    toast.success(`${product.name.slice(0, 28)}… added to cart`)
  }

  const handleWish = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { toast.error('Please sign in to save favourites'); return }
    await toggleWishlist(product._id)
    toast.success(inWish ? 'Removed from wishlist' : 'Saved!')
  }

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!inComp && !canAdd()) { toast.error('You can compare up to 3 products'); return }
    toggleCompare(product)
    toast.success(inComp ? 'Removed from comparison' : 'Added to compare')
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`card-hover group flex flex-col ${className}`}
      onClick={() => trackRecentlyViewed(product)}
    >
      {/* Image area */}
      <div className="relative overflow-hidden aspect-square">
        <img
  src={
    product.images?.[0]?.url ||
    product.coverImage ||
    `https://picsum.photos/400/400?random=${product._id || Math.random()}`
  }
  alt={product.name}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
  loading="lazy"
/>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.onSale      && <span className="badge bg-terra text-white text-[11px]">SALE</span>}
          {product.isNew       && <span className="badge bg-stone-800 text-white text-[11px]">NEW</span>}
          {product.isBestseller && <span className="badge bg-amber-400 text-amber-900 text-[11px]">BESTSELLER</span>}
        </div>

        {/* Wishlist + Compare — appear on hover */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleWish}
            className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-colors ${inWish ? 'text-red-500' : 'text-stone-400 hover:text-red-400'}`}
          >
            <Heart size={14} fill={inWish ? 'currentColor' : 'none'} />
          </button>
          <button
            onClick={handleCompare}
            className={`w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm transition-colors ${inComp ? 'text-blue-500' : 'text-stone-400 hover:text-blue-400'}`}
            title="Add to comparison"
          >
            <GitCompare size={14} />
          </button>
        </div>

        {/* Add to cart — slides up on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            onClick={handleAdd}
            className="w-full bg-stone-900 hover:bg-terra text-white text-xs font-medium py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingCart size={13} />
            {loggedIn ? 'Add to Cart' : 'Sign In to Buy'}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider mb-1">
          {product.brand || product.supplier || product.category?.name || ''}
        </p>

        <h3 className="text-sm font-medium text-stone-800 leading-snug mb-1 flex-1 line-clamp-2">
          {product.name}
        </h3>

        {product.dimension && (
          <p className="text-xs text-stone-400 mb-2">{product.dimension}</p>
        )}

        {/* Rating stars */}
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <svg key={s} className={`w-3 h-3 ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
            </div>
            <span className="text-[11px] text-stone-400">({product.numReviews})</span>
          </div>
        )}

        {/* Price — blurred for guests */}
        <div className="mt-auto pt-2">
          {loggedIn ? (
            <div className="flex items-baseline gap-2">
              <span className="text-base font-semibold text-stone-900">${effectivePrice?.toFixed(2)}</span>
              {product.onSale && product.salePrice && (
                <span className="text-sm text-stone-400 line-through">${product.price?.toFixed(2)}</span>
              )}
              <span className="text-xs text-stone-400">/{product.unit || 'm²'}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span
                className="text-base font-semibold text-stone-900 select-none"
                style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}
                aria-hidden
              >
                $00.00/m²
              </span>
              <Link
                to="/login"
                onClick={e => e.stopPropagation()}
                className="text-[11px] font-medium text-terra hover:underline flex-shrink-0"
              >
                Sign in to view
              </Link>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}