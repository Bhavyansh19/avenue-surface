import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import AdminLoginModal from '../ui/AdminLoginModal'

const MAIN_CATS = [
  { label: 'Hybrid',           href: '/shop/hybrid' },
  { label: 'Vinyl',            href: '/shop/vinyl' },
  { label: 'Timber',           href: '/shop/timber' },
  { label: 'Laminate',         href: '/shop/laminate' },
  { label: 'Bamboo',           href: '/shop/bamboo' },
  { label: 'Carpet Tiles',     href: '/shop/carpet' },
  { label: 'Tiles',            href: '/shop/tiles' },
  { label: 'Artificial Grass', href: '/shop/grass' },
]

const SHOP_BY_ROOM = [
  { label: 'Bathroom',    href: '/shop?tag=bathroom' },
  { label: 'Bedroom',     href: '/shop?tag=bedroom' },
  { label: 'Kitchen',     href: '/shop?tag=kitchen' },
  { label: 'Living Room', href: '/shop?tag=living' },
  { label: 'Outdoor',     href: '/shop?tag=outdoor' },
  { label: 'Commercial',  href: '/shop?tag=commercial' },
]

const SHOP_BY_ATTR = [
  { label: 'Waterproof',   href: '/shop?waterproof=true' },
  { label: 'Herringbone',  href: '/shop?herringbone=true' },
  { label: 'Pet-Friendly', href: '/shop?petFriendly=true' },
  { label: 'DIY-Friendly', href: '/shop?diyFriendly=true' },
  { label: '🎉 On Sale',  href: '/shop?onSale=true' },
]

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ]       = useState('')
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [adminModal, setAdminModal] = useState(false)
  const [dotClicks, setDotClicks]   = useState(0)
  const dotTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuRef  = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const { totalItems }   = useCartStore()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setActiveMenu(null) }, [location])

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setActiveMenu(null)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  // Hidden admin trigger: double-click the invisible dot after the logo text
  const handleDotClick = () => {
    const next = dotClicks + 1
    setDotClicks(next)
    if (dotTimer.current) clearTimeout(dotTimer.current)
    dotTimer.current = setTimeout(() => setDotClicks(0), 500)
    if (next >= 2) { setDotClicks(0); setAdminModal(true) }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQ)}`)
      setSearchOpen(false); setSearchQ('')
    }
  }

  const handleLogout = async () => { await logout(); navigate('/') }

  return (
    <>
      <nav className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'border-b border-stone-200'}`}>

        {/* Top utility bar */}
        <div className="hidden lg:block border-b border-stone-100">
          <div className="max-w-screen-xl mx-auto px-6 flex justify-between items-center h-9 text-xs text-stone-500">
            <div className="flex gap-6 items-center">
              <Link to="/blog"    className="hover:text-terra transition-colors">Ideas & Advice</Link>
              <Link to="/about"   className="hover:text-terra transition-colors">About</Link>
              <Link to="/contact" className="hover:text-terra transition-colors">Contact</Link>
              <span className="border-l border-stone-200 pl-5 text-stone-400">🇦🇺 Victoria Only</span>
            </div>
            <div className="flex gap-6 items-center">
              <Link to="/floor-finder" className="hover:text-terra transition-colors font-medium">Floor Finder</Link>
              {user ? (
                <>
                  <Link to="/account" className="hover:text-terra transition-colors">My Account</Link>
                  <button onClick={handleLogout} className="hover:text-terra transition-colors">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="hover:text-terra transition-colors">Sign In</Link>
              )}
            </div>
          </div>
        </div>

        {/* Main bar */}
        <div className="max-w-screen-xl mx-auto px-6" ref={menuRef}>
          <div className="flex items-center justify-between h-16">

            {/* Logo + hidden admin dot */}
            <div className="flex items-center flex-shrink-0">
              {/* Single click = go home */}
              <Link to="/" className="font-serif text-2xl font-semibold text-stone-900 tracking-wide">
                Avenue Surface
              </Link>
              {/* Invisible dot: double-click opens admin modal */}
              <span
                onClick={handleDotClick}
                style={{ width: 8, height: 8, opacity: 0, cursor: 'default', display: 'inline-block', marginLeft: 4 }}
                aria-hidden="true"
              />
            </div>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">

              {/* Shop By mega menu */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveMenu('shopby')}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeMenu === 'shopby' ? 'text-terra' : 'text-stone-700 hover:text-terra'}`}
                >
                  Shop By <ChevronDown size={13} className={`transition-transform ${activeMenu === 'shopby' ? 'rotate-180' : ''}`} />
                </button>

                {activeMenu === 'shopby' && (
                  <div
                    onMouseLeave={() => setActiveMenu(null)}
                    className="absolute top-full left-0 bg-white border border-stone-200 rounded-xl shadow-2xl p-6 z-50 grid gap-6"
                    style={{ width: 540, gridTemplateColumns: '1fr 1fr 1fr' }}
                  >
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">By Material</p>
                      {MAIN_CATS.map(c => (
                        <Link key={c.href} to={c.href} className="block py-1.5 text-sm text-stone-600 hover:text-terra transition-colors">{c.label}</Link>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">By Room</p>
                      {SHOP_BY_ROOM.map(r => (
                        <Link key={r.href} to={r.href} className="block py-1.5 text-sm text-stone-600 hover:text-terra transition-colors">{r.label}</Link>
                      ))}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-3">By Feature</p>
                      {SHOP_BY_ATTR.map(a => (
                        <Link key={a.href} to={a.href} className="block py-1.5 text-sm text-stone-600 hover:text-terra transition-colors">{a.label}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Direct category links */}
              {MAIN_CATS.slice(0, 7).map(cat => (
                <Link
                  key={cat.href}
                  to={cat.href}
                  className="px-3 py-2 text-sm font-medium text-stone-700 hover:text-terra transition-colors rounded-md whitespace-nowrap"
                >
                  {cat.label}
                </Link>
              ))}

              {/* More dropdown */}
              <div className="relative">
                <button
                  onMouseEnter={() => setActiveMenu('more')}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-stone-700 hover:text-terra transition-colors rounded-md"
                >
                  More <ChevronDown size={13} />
                </button>
                {activeMenu === 'more' && (
                  <div
                    onMouseLeave={() => setActiveMenu(null)}
                    className="absolute top-full right-0 bg-white border border-stone-200 rounded-xl shadow-xl p-4 z-50 min-w-[180px]"
                  >
                    <Link to="/shop/grass"       className="block py-2 px-2 text-sm text-stone-600 hover:text-terra hover:bg-stone-50 rounded-lg transition-colors">Artificial Grass</Link>
                    <Link to="/shop/rugs"         className="block py-2 px-2 text-sm text-stone-600 hover:text-terra hover:bg-stone-50 rounded-lg transition-colors">Rugs</Link>
                    <Link to="/shop?onSale=true"  className="block py-2 px-2 text-sm font-medium text-terra hover:bg-stone-50 rounded-lg">🎉 On Sale</Link>
                    <Link to="/floor-finder"      className="block py-2 px-2 text-sm text-stone-600 hover:text-terra hover:bg-stone-50 rounded-lg transition-colors">Floor Finder</Link>
                    <Link to="/visualizer"        className="block py-2 px-2 text-sm text-stone-600 hover:text-terra hover:bg-stone-50 rounded-lg transition-colors">Room Visualiser</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <input
                    autoFocus
                    value={searchQ}
                    onChange={e => setSearchQ(e.target.value)}
                    placeholder="Search products…"
                    className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm w-44 focus:outline-none focus:border-terra"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-stone-400 p-1"><X size={15} /></button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 text-stone-600 hover:text-terra transition-colors">
                  <Search size={18} />
                </button>
              )}

              {user && (
                <Link to="/account" className="p-2 text-stone-600 hover:text-terra transition-colors">
                  <User size={18} />
                </Link>
              )}

              <Link to="/cart" className="p-2 text-stone-600 hover:text-terra transition-colors relative">
                <ShoppingCart size={18} />
                {totalItems() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-terra text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems()}
                  </span>
                )}
              </Link>

              <Link to="/book-measure" className="hidden sm:block btn-primary text-sm px-4 py-2 ml-1">
                Free Measure
              </Link>

              <button className="lg:hidden p-2 text-stone-700" onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 flex flex-col gap-1">
              <form onSubmit={handleSearch} className="flex gap-2 mb-4">
                <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search…" className="input-field flex-1 py-2" />
                <button type="submit" className="btn-primary px-4 py-2 text-sm">Go</button>
              </form>
              {MAIN_CATS.map(c => (
                <Link key={c.href} to={c.href} className="py-2.5 text-sm font-medium text-stone-700 border-b border-stone-100">{c.label}</Link>
              ))}
              <Link to="/shop?onSale=true" className="py-2.5 text-sm font-medium text-terra">🎉 On Sale</Link>
              <Link to="/floor-finder"     className="py-2.5 text-sm text-stone-600">Floor Finder</Link>
              <Link to="/blog"             className="py-2.5 text-sm text-stone-600">Ideas & Advice</Link>
              <Link to="/visualizer"       className="py-2.5 text-sm text-stone-600">Room Visualiser</Link>
              <Link to="/about"            className="py-2.5 text-sm text-stone-600">About</Link>
              <Link to="/contact"          className="py-2.5 text-sm text-stone-600">Contact</Link>
              <Link to="/terms"            className="py-2.5 text-sm text-stone-600">Terms & Privacy</Link>
              {user ? (
                <>
                  <Link to="/account" className="py-2.5 text-sm text-stone-600">My Account</Link>
                  <button onClick={handleLogout} className="py-2.5 text-sm text-left text-stone-600">Sign Out</button>
                </>
              ) : (
                <Link to="/login" className="py-2.5 text-sm text-stone-600">Sign In / Register</Link>
              )}
              <Link to="/book-measure" className="btn-primary text-center mt-3">Book Free Home Measure</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Admin modal */}
      {adminModal && <AdminLoginModal onClose={() => setAdminModal(false)} />}

      {/* WhatsApp button — ⚠️ CHANGE: replace 61400000000 with your real AU mobile number */}
      <a
        href="https://wa.me/61400000000?text=Hi%20Avenue%20Surface%2C%20I%27d%20like%20to%20enquire%20about%20flooring."
        target="_blank"
        rel="noreferrer"
        title="Chat on WhatsApp"
        style={{ backgroundColor: '#25D366' }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <svg viewBox="0 0 24 24" fill="white" width="28" height="28">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  )
}