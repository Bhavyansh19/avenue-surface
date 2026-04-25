import { useState, useEffect } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import api from '../lib/api'
import ProductCard from '../components/ui/ProductCard'

const ATTR_FILTERS = [
  { key: 'waterproof',   label: 'Waterproof' },
  { key: 'herringbone',  label: 'Herringbone' },
  { key: 'petFriendly', label: 'Pet-Friendly' },
  { key: 'diyFriendly', label: 'DIY-Friendly' },
  { key: 'outdoorRated', label: 'Outdoor Rated' },
]

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'price',      label: 'Price: Low to High' },
  { value: '-price',     label: 'Price: High to Low' },
  { value: '-rating',    label: 'Top Rated' },
]

const CAT_LABELS: Record<string, string> = {
  hybrid: 'Hybrid Flooring', vinyl: 'Vinyl Plank', timber: 'Engineered Timber',
  laminate: 'Laminate', bamboo: 'Bamboo', carpet: 'Carpet Tiles',
  tiles: 'Tiles', grass: 'Artificial Grass', rugs: 'Rugs', accessories: 'Accessories',
}

export default function ShopPage() {
  const { category } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()

  const [products, setProducts]   = useState<any[]>([])
  const [total, setTotal]         = useState(0)
  const [pages, setPages]         = useState(1)
  const [categories, setCats]     = useState<any[]>([])
  const [loading, setLoading]     = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ price: true, attributes: true })
  const [localMin, setLocalMin]   = useState('')
  const [localMax, setLocalMax]   = useState('')

  // Read all params from URL
  const page     = parseInt(searchParams.get('page') || '1')
  const sort     = searchParams.get('sort') || '-createdAt'
  const search   = searchParams.get('search') || ''
  const onSale   = searchParams.get('onSale') || ''
  const minPrice = searchParams.get('minPrice') || ''
  const maxPrice = searchParams.get('maxPrice') || ''

  const activeAttrs = ATTR_FILTERS.filter(a => searchParams.get(a.key) === 'true')

  useEffect(() => {
    api.get('/categories').then(r => setCats(r.data.categories)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    const params: any = { page, sort, limit: 21 }
    if (search)   params.search = search
    if (onSale)   params.onSale = onSale
    if (minPrice) params.minPrice = minPrice
    if (maxPrice) params.maxPrice = maxPrice
    ATTR_FILTERS.forEach(a => { if (searchParams.get(a.key) === 'true') params[a.key] = 'true' })

    // Resolve category slug → ObjectId
    if (category) {
      const catObj = categories.find(c => c.slug === category)
      if (catObj) params.category = catObj._id
      else if (categories.length === 0) {
        // Categories not loaded yet — skip fetch, will retry when categories load
        setLoading(false)
        return
      }
    }

    api.get('/products', { params })
      .then(r => {
        setProducts(r.data.products || [])
        setTotal(r.data.total || 0)
        setPages(r.data.pages || 1)
      })
      .catch(() => { setProducts([]); setTotal(0); setPages(1) })
      .finally(() => setLoading(false))
  }, [category, searchParams, categories])

  // ── Param helpers ──────────────────────────────────────────────────────────

  // setFilter: change a filter param AND reset page to 1
  const setFilter = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams)
    if (val) p.set(key, val); else p.delete(key)
    p.set('page', '1')   // reset page when filter changes
    setSearchParams(p)
  }

  // goToPage: only change the page param, keep all other filters
  const goToPage = (n: number) => {
    const p = new URLSearchParams(searchParams)
    p.set('page', String(n))
    setSearchParams(p)
  }

  const toggleAttr = (key: string) => {
    setFilter(key, searchParams.get(key) === 'true' ? '' : 'true')
  }

  const clearAll = () => {
    const p = new URLSearchParams()
    if (category) p.set('category', category)
    setSearchParams(p)
    setLocalMin(''); setLocalMax('')
  }

  const toggleSection = (s: string) =>
    setOpenSections(prev => ({ ...prev, [s]: !prev[s] }))

  const currentCat = categories.find(c => c.slug === category)

  // ── Pagination: show max 7 page buttons with ellipsis ─────────────────────
  const getPageButtons = () => {
    if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
    const buttons: (number | '...')[] = []
    if (page <= 4) {
      buttons.push(1, 2, 3, 4, 5, '...', pages)
    } else if (page >= pages - 3) {
      buttons.push(1, '...', pages - 4, pages - 3, pages - 2, pages - 1, pages)
    } else {
      buttons.push(1, '...', page - 1, page, page + 1, '...', pages)
    }
    return buttons
  }

  return (
    <>
      <Helmet><title>{currentCat?.name || 'Shop All'} — Avenue Surface</title></Helmet>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-stone-400 mb-6">
          <Link to="/" className="hover:text-terra">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-terra">Shop</Link>
          {category && (
            <><span>/</span><span className="text-stone-700 font-medium">{CAT_LABELS[category] || category}</span></>
          )}
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-2">
            {search ? `Search: "${search}"` : currentCat?.name || 'All Flooring Products'}
          </h1>
          {currentCat?.description && <p className="text-stone-500 mb-1">{currentCat.description}</p>}
          <p className="text-sm text-stone-400">
            {total} products
            {pages > 1 && ` — Page ${page} of ${pages}`}
          </p>
        </div>

        {/* Sub-category pills */}
        {currentCat?.subCategories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-stone-200">
            <button
              onClick={() => setFilter('subCategory', '')}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${!searchParams.get('subCategory') ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'}`}>
              All
            </button>
            {currentCat.subCategories.map((s: any) => (
              <button
                key={s.slug}
                onClick={() => setFilter('subCategory', searchParams.get('subCategory') === s.slug ? '' : s.slug)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${searchParams.get('subCategory') === s.slug ? 'bg-stone-800 text-white border-stone-800' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-400'}`}>
                {s.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* SIDEBAR */}
          <aside className={`${sidebarOpen ? 'w-56 flex-shrink-0' : 'w-0 overflow-hidden'} transition-all duration-300 hidden lg:block`}>
            <div className="sticky top-24 space-y-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-stone-900 text-sm">Filters</h3>
                {(activeAttrs.length > 0 || minPrice || maxPrice || onSale) && (
                  <button onClick={clearAll} className="text-xs text-terra hover:underline">Clear all</button>
                )}
              </div>

              {/* Price */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <button onClick={() => toggleSection('price')} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50">
                  Price Range {openSections.price ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {openSections.price && (
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 mb-3">
                      <input type="number" placeholder="Min $" value={localMin} onChange={e => setLocalMin(e.target.value)} className="input-field text-xs py-1.5 px-2" />
                      <input type="number" placeholder="Max $" value={localMax} onChange={e => setLocalMax(e.target.value)} className="input-field text-xs py-1.5 px-2" />
                    </div>
                    <button onClick={() => { setFilter('minPrice', localMin); setFilter('maxPrice', localMax) }} className="btn-primary text-xs py-1.5 w-full">Apply</button>
                    {(minPrice || maxPrice) && (
                      <button onClick={() => { setFilter('minPrice', ''); setFilter('maxPrice', ''); setLocalMin(''); setLocalMax('') }} className="text-xs text-stone-400 hover:text-terra mt-2 w-full text-center">Clear price</button>
                    )}
                  </div>
                )}
              </div>

              {/* Attributes */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <button onClick={() => toggleSection('attributes')} className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-stone-800 hover:bg-stone-50">
                  Attributes {openSections.attributes ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {openSections.attributes && (
                  <div className="px-4 pb-4 space-y-2">
                    {ATTR_FILTERS.map(a => (
                      <label key={a.key} className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={searchParams.get(a.key) === 'true'} onChange={() => toggleAttr(a.key)} className="accent-terra w-3.5 h-3.5" />
                        <span className="text-sm text-stone-600">{a.label}</span>
                      </label>
                    ))}
                    <label className="flex items-center gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={onSale === 'true'} onChange={() => setFilter('onSale', onSale === 'true' ? '' : 'true')} className="accent-terra w-3.5 h-3.5" />
                      <span className="text-sm text-stone-600">On Sale</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:flex items-center gap-2 text-sm text-stone-600 hover:text-terra transition-colors">
                <SlidersHorizontal size={15} />{sidebarOpen ? 'Hide' : 'Show'} Filters
              </button>

              {/* Active filter tags */}
              <div className="flex flex-wrap gap-2 flex-1">
                {activeAttrs.map(a => (
                  <span key={a.key} onClick={() => toggleAttr(a.key)} className="flex items-center gap-1 px-2.5 py-1 bg-terra/10 text-terra text-xs font-medium rounded-full cursor-pointer hover:bg-terra/20">
                    {a.label} <X size={11} />
                  </span>
                ))}
                {onSale === 'true' && (
                  <span onClick={() => setFilter('onSale', '')} className="flex items-center gap-1 px-2.5 py-1 bg-terra/10 text-terra text-xs font-medium rounded-full cursor-pointer hover:bg-terra/20">
                    On Sale <X size={11} />
                  </span>
                )}
              </div>

              <select
                value={sort}
                onChange={e => setFilter('sort', e.target.value)}
                className="input-field text-sm w-48 py-2 flex-shrink-0">
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Products grid */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-stone-200 bg-stone-50 animate-pulse">
                    <div className="aspect-square bg-stone-200 rounded-t-xl" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-stone-200 rounded w-1/3" />
                      <div className="h-4 bg-stone-200 rounded" />
                      <div className="h-4 bg-stone-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-serif text-2xl text-stone-700 mb-2">No products found</h3>
                <p className="text-stone-500 mb-6">Try adjusting your filters or browse all products.</p>
                <Link to="/shop" className="btn-primary">Browse All Products</Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
                  {products.map(p => <ProductCard key={p._id} product={p} />)}
                </div>

                {/* ── PAGINATION ── */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {/* Prev button */}
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-stone-200 text-stone-600 hover:border-stone-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      <ChevronLeft size={14} /> Prev
                    </button>

                    {/* Page number buttons */}
                    {getPageButtons().map((btn, i) =>
                      btn === '...' ? (
                        <span key={`ellipsis-${i}`} className="px-2 text-stone-400 text-sm">…</span>
                      ) : (
                        <button
                          key={btn}
                          onClick={() => goToPage(btn as number)}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                            page === btn
                              ? 'bg-stone-800 text-white border border-stone-800'
                              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400 hover:bg-stone-50'
                          }`}>
                          {btn}
                        </button>
                      )
                    )}

                    {/* Next button */}
                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page === pages}
                      className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium border border-stone-200 text-stone-600 hover:border-stone-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                )}

                {/* Page info */}
                {pages > 1 && (
                  <p className="text-center text-xs text-stone-400 mt-3">
                    Showing {(page - 1) * 12 + 1}–{Math.min(page * 12, total)} of {total} products
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}