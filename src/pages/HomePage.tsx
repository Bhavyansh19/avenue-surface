import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Check, ArrowRight, Calculator, ChevronDown } from 'lucide-react'
import { Helmet } from 'react-helmet-async'
import api from '../lib/api'
import ProductCard from '../components/ui/ProductCard'

const CATEGORIES = [
  { label: 'On Sale',          emoji: '🏷️', slug: '?onSale=true' },
  { label: 'Hybrid',           emoji: '🌊', slug: 'hybrid' },
  { label: 'Vinyl',            emoji: '🌿', slug: 'vinyl' },
  { label: 'Timber',           emoji: '🪵', slug: 'timber' },
  { label: 'Laminate',         emoji: '📋', slug: 'laminate' },
  { label: 'Bamboo',           emoji: '🎋', slug: 'bamboo' },
  { label: 'Carpet Tiles',     emoji: '🧶', slug: 'carpet' },
  { label: 'Tiles',            emoji: '🪨', slug: 'tiles' },
  { label: 'Artificial Grass', emoji: '🌱', slug: 'grass' },
  { label: 'Rugs',             emoji: '🏠', slug: 'rugs' },
]

const ROOMS = [
  { label: 'Kitchen',     from: '#8B6E52', to: '#5C4430', tag: 'kitchen' },
  { label: 'Bathroom',    from: '#6B8E9A', to: '#3D6070', tag: 'bathroom' },
  { label: 'Living Room', from: '#7A8B6F', to: '#4E6045', tag: 'living' },
  { label: 'Bedroom',     from: '#A08060', to: '#6B5040', tag: 'bedroom' },
  { label: 'Outdoor',     from: '#7A9070', to: '#4E6048', tag: 'outdoor' },
  { label: 'Commercial',  from: '#607080', to: '#3A4E60', tag: 'commercial' },
]

const PROCESS = [
  { num: '01', title: 'Book a Free Measure', desc: 'Book a free home measure across Victoria. We come to you with samples and measure your space precisely.' },
  { num: '02', title: 'Select Your Flooring', desc: 'Browse curated samples in your own lighting and space. Our team guides you through every option.' },
  { num: '03', title: 'Receive Your Quote',   desc: 'Clear, transparent pricing with no hidden surprises. Confirmed in writing before we proceed.' },
  { num: '04', title: 'Professional Install', desc: 'Our certified installers handle everything from start to finish, in line with Australian Standards.' },
]

const WHY = [
  { icon: '🏆', title: 'Australian Standards Compliant',  desc: 'All products meet AS/NZS standards including slip resistance (P3–P5) and E0/E1 formaldehyde emission limits.' },
  { icon: '🚛', title: 'Delivery Across Victoria',        desc: 'We deliver across Victoria including Melbourne metro and surrounding suburbs. Contact us for your area.' },
  { icon: '📦', title: 'Free Sample Programme',           desc: 'See the real colour and texture of your chosen product in your own home before you commit.' },
  { icon: '✅', title: 'FSC & PEFC Certified Timber',     desc: 'Our timber products come from responsibly managed forests, certified to international sustainability standards.' },
  { icon: '🛡️', title: 'Genuine Product Warranties',     desc: 'All products carry manufacturer warranties. We honour every claim — no runaround, no fine print.' },
  { icon: '💬', title: 'Expert Local Advice',             desc: 'Our experienced team is here to help. Call, email, or book a home visit — real advice from real people.' },
  { icon: '🔄', title: 'Hassle-Free Returns',             desc: 'Straightforward returns on unopened stock in accordance with Australian Consumer Law.' },
  { icon: '🏠', title: 'Certified Installers',            desc: 'Our installers are certified and trained to manufacturer specifications and Australian Standards.' },
]

const TESTIMONIALS = [
  { quote: 'The team helped me choose the right tile for my bathroom renovation. The advice alone saved me from a costly mistake.', name: 'Sarah M.', location: 'Melbourne, VIC', product: 'Calacatta Marble Wall Tile' },
  { quote: 'Booked a free home measure, loved the Natural Oak Hybrid. Whole house done in 4 days. Could not be happier.', name: 'James T.', location: 'Melbourne, VIC', product: 'Natural Oak Hybrid Plank' },
  { quote: 'As a builder I need consistent supply and honest specs. Avenue Surface delivers both every single time.', name: 'Dave R.', location: 'Melbourne, VIC', product: 'Commercial Carpet Tiles' },
  { quote: 'The home visit was incredible — measured everything, brought samples, and we had our order placed the same day.', name: 'Lisa K.', location: 'Melbourne, VIC', product: 'European Oak Engineered Timber' },
  { quote: 'Seeing the Herringbone Vinyl in our actual lighting made the decision so easy. Great service from start to finish.', name: 'Priya S.', location: 'Melbourne, VIC', product: 'Herringbone Vinyl Plank' },
]

const BLOG_COLOURS: Record<string, string> = {
  hybrid: 'bg-teal-100 text-teal-800', laminate: 'bg-amber-100 text-amber-800',
  vinyl: 'bg-blue-100 text-blue-800', bamboo: 'bg-green-100 text-green-800',
  timber: 'bg-orange-100 text-orange-800', tiles: 'bg-red-100 text-red-800',
  general: 'bg-stone-100 text-stone-700',
}

export default function HomePage() {
  const [featured, setFeatured]     = useState<any[]>([])
  const [newArrivals, setNew]       = useState<any[]>([])
  const [blogs, setBlogs]           = useState<any[]>([])
  const [blogTab, setBlogTab]       = useState('all')
  const [calcL, setCalcL]           = useState('')
  const [calcW, setCalcW]           = useState('')
  const [calcWaste, setCalcWaste]   = useState('5')
  const [calcResult, setCalcResult] = useState<string | null>(null)

  useEffect(() => {
  api.get('/products', { params: { limit: 20 } })
    .then(res => {
      console.log("API RESPONSE:", res.data); // 👈 DEBUG

      const products = res.data.products || []

      setFeatured(products.slice(0, 8))
      setNew(products.slice(8, 16))
    })
    .catch(err => console.log(err))

  api.get('/blog', { params: { limit: 6 } })
    .then(res => setBlogs(res.data.blogs || []))
    .catch(() => {})
}, [])

  const filteredBlogs = blogTab === 'all' ? blogs : blogs.filter(b => b.category === blogTab)

  const calculate = () => {
    const l = parseFloat(calcL), w = parseFloat(calcW), waste = parseInt(calcWaste)
    if (!l || !w) return
    const area = l * w
    const withWaste = area * (1 + waste / 100)
    setCalcResult(`Area: ${area.toFixed(2)} m² — With ${waste}% wastage: ${withWaste.toFixed(2)} m²`)
  }

  return (
    <>
      <Helmet>
        <title>Avenue Surface — Premium Tiles & Flooring Victoria</title>
        <meta name="description" content="Victoria's trusted tiles and flooring specialist. Premium hybrid, vinyl, timber, laminate and tiles. Free home measure across Victoria." />
      </Helmet>

      {/* HERO */}
      <section className="relative min-h-[88vh] flex items-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #FAF7F2 0%, #F0E8DE 40%, #E8DDD0 100%)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30" style={{ background: 'radial-gradient(ellipse at top right, #C4622D22, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-1/3 h-2/3 opacity-20" style={{ background: 'radial-gradient(ellipse, #8B7D7222, transparent 70%)' }} />
        </div>
        <div className="relative max-w-screen-xl mx-auto px-6 py-20 w-full">
          <div className="max-w-2xl">
            <p className="section-label mb-4">Victoria's Premium Tiles & Flooring Specialist</p>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-none text-stone-900 mb-6">
              <span className="font-light italic block">Floors That</span>
              <span className="font-bold block">Tell Your Story.</span>
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-lg mb-8">
              Premium tiles and flooring for Victorian homes and businesses. We bring the showroom to you — book a free home measure today.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/book-measure" className="btn-primary text-base px-8 py-3.5">Book Free Home Measure</Link>
              <Link to="/shop" className="btn-outline text-base px-8 py-3.5">Browse Products</Link>
            </div>
            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-2">
                {['SM','JT','DR','LK'].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-stone-300 border-2 border-white flex items-center justify-center text-[10px] font-semibold text-stone-600">{i}</div>
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} size={13} className="text-amber-400 fill-amber-400" />)}</div>
                <p className="text-xs text-stone-500 mt-0.5">Trusted by Victorian homeowners & builders</p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-stone-400">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown size={16} className="animate-bounce" />
        </div>
      </section>

      {/* VICTORIA BANNER */}
      <div className="bg-stone-800 text-white py-3 px-6 text-center text-sm">
        🇦🇺 Proudly serving <strong>Victoria only</strong> — Melbourne Metro & surrounding suburbs &nbsp;·&nbsp;
        <Link to="/book-measure" className="underline text-orange-300 hover:text-orange-200">Book your free home measure →</Link>
      </div>

      {/* CATEGORY PILLS */}
      <section className="bg-white py-10 border-b border-stone-100">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex flex-wrap gap-2.5">
            {CATEGORIES.map(c => (
              <Link key={c.slug} to={c.slug.startsWith('?') ? `/shop${c.slug}` : `/shop/${c.slug}`}
                className="flex items-center gap-2 px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-full text-sm font-medium text-stone-700 hover:border-terra hover:text-terra transition-all duration-150">
                <span className="text-base">{c.emoji}</span>{c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY TYPE */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label">Browse by Type</p>
              <h2 className="section-title text-4xl">Shop by Flooring Type</h2>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-terra hover:underline">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.filter(c => !c.slug.startsWith('?')).map(c => (
              <Link key={c.slug} to={`/shop/${c.slug}`} className="group flex flex-col items-center gap-3 p-5 bg-white rounded-xl border border-stone-200 hover:border-terra hover:shadow-md transition-all duration-200">
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl" style={{ background: 'linear-gradient(135deg, #F5F0EA, #EDE5D8)' }}>{c.emoji}</div>
                <span className="text-sm font-medium text-stone-800 text-center group-hover:text-terra transition-colors">{c.label}</span>
                <ArrowRight size={12} className="text-stone-300 group-hover:text-terra transition-colors" />
              </Link>
            ))}
          </div>
          <div className="mt-8 bg-stone-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-terra/20 rounded-xl flex items-center justify-center text-2xl">🔍</div>
              <div>
                <h3 className="font-semibold text-white">Find Your Perfect Flooring</h3>
                <p className="text-sm text-stone-400">Answer a few questions — we'll recommend the ideal product for your Victorian home.</p>
              </div>
            </div>
            <Link to="/floor-finder" className="btn-primary flex-shrink-0">Start Floor Finder</Link>
          </div>
        </div>
      </section>

      {/* SHOP BY ROOM */}
      <section className="bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label">Discover by Space</p>
          <h2 className="section-title text-4xl mb-10">Shop by Room</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ROOMS.map((r, i) => (
              <Link key={r.label} to={`/shop?tag=${r.tag}`}
                className={`group relative overflow-hidden rounded-2xl ${i === 0 || i === 3 ? 'row-span-2' : ''}`}
                style={{ minHeight: i === 0 || i === 3 ? '360px' : '170px', background: `linear-gradient(160deg, ${r.from}, ${r.to})` }}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-serif text-2xl font-semibold text-white">{r.label}</h3>
                  <p className="text-white/70 text-sm flex items-center gap-1 mt-1">Explore <ArrowRight size={12} /></p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label">Our Range</p>
              <h2 className="section-title text-4xl">Best Selling Products</h2>
              <p className="text-stone-500 mt-2">Handpicked for quality, durability, and performance — browse our most popular floors.</p>
            </div>
            <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-terra hover:underline">View All <ArrowRight size={14} /></Link>
          </div>
          {featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-stone-200">
              <p className="text-stone-400 text-lg mb-2">Products loading…</p>
              <p className="text-stone-300 text-sm">Make sure your backend is connected and database is seeded.</p>
            </div>
          )}
        </div>
      </section>

      {/* NEW ARRIVALS */}
      {newArrivals.length > 0 && (
        <section className="bg-white py-16">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="section-label">Just In</p>
                <h2 className="section-title text-4xl">New at Avenue Surface</h2>
              </div>
              <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-medium text-terra hover:underline">View All <ArrowRight size={14} /></Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newArrivals.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* BOOK FREE HOME MEASURE CTA */}
      <section className="py-16 px-6" style={{ background: '#C4622D' }}>
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="font-serif text-4xl font-semibold text-white mb-3">We Bring the Showroom to You</h2>
            <p className="text-white/80 max-w-lg leading-relaxed">No guesswork. See real flooring and tile samples in your actual space, in your own lighting. Our team measures, advises, and quotes — all at your home, completely free.</p>
            <p className="text-white/60 text-sm mt-2 flex items-center gap-1">🇦🇺 Victoria only — Melbourne Metro & surrounding suburbs</p>
          </div>
          <Link to="/book-measure" className="bg-white font-semibold px-8 py-4 rounded-xl hover:bg-stone-50 transition-colors text-base flex-shrink-0 whitespace-nowrap" style={{ color: '#C4622D' }}>
            Book Free Home Measure →
          </Link>
        </div>
      </section>

      {/* VISUALISER */}
      <section className="bg-stone-800 py-16">
        <div className="max-w-screen-xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-3">Powered by TilesView.ai</p>
            <h2 className="font-serif text-4xl font-semibold text-white mb-4">See It In Your Space Before You Buy</h2>
            <p className="text-stone-400 leading-relaxed mb-6">Upload a photo of your room and instantly see how any tile or floor looks in your actual home. No guesswork. No regrets.</p>
            <ul className="space-y-3 mb-8">
              {['Upload your own room photo or choose from preset rooms','Visualise tiles, hybrid, vinyl, timber, and more','360° panorama view for full room immersion','Share your design or book a free home measure'].map(item => (
                <li key={item} className="flex items-center gap-3 text-stone-300 text-sm">
                  <span className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0"><Check size={11} className="text-white" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/visualizer" className="btn-primary">Launch Room Visualiser →</Link>
          </div>
          <div className="bg-stone-900 rounded-2xl p-5 hidden md:block">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-stone-500 text-xs ml-2">Room Visualiser — TilesView.ai</span>
            </div>
            <div className="grid grid-cols-5 gap-2 h-52">
              <div className="col-span-4 bg-stone-800 rounded-lg overflow-hidden grid grid-cols-7 grid-rows-6 gap-0.5 p-1">
                {Array.from({ length: 42 }).map((_, i) => <div key={i} className={`rounded-sm ${i % 7 === i % 5 ? 'bg-stone-600' : 'bg-stone-700'}`} />)}
              </div>
              <div className="bg-stone-800 rounded-lg p-2 flex flex-col gap-2">
                <p className="text-[9px] text-stone-500 uppercase tracking-wider font-semibold">Products</p>
                {['#C8A870','#8B8078','#D8CEC0','#6B8090','#A09080'].map((c, i) => (
                  <div key={i} className={`h-7 rounded ${i === 1 ? 'ring-2 ring-orange-400' : ''}`} style={{ background: c }} />
                ))}
              </div>
            </div>
            <p className="text-center text-stone-600 text-[10px] mt-3">Powered by TilesView.ai</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-label">Simple Process</p>
            <h2 className="section-title text-4xl">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PROCESS.map(s => (
              <div key={s.num} className="relative text-center">
                <div className="font-serif text-8xl font-bold text-stone-100 absolute -top-4 left-1/2 -translate-x-1/2 select-none">{s.num}</div>
                <div className="relative z-10 pt-8">
                  <h3 className="text-lg font-semibold text-stone-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label">Our Promise</p>
          <h2 className="section-title text-4xl mb-10">Why Victorians Choose Avenue Surface</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY.map(w => (
              <div key={w.title} className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="text-3xl mb-3">{w.icon}</div>
                <h3 className="font-semibold text-stone-900 text-sm mb-1.5">{w.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-stone-800 py-12">
        <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['1,200+','Products Available'],['4.9★','Average Rating'],['Victoria','Our Service Area'],['Certified','Installers']].map(([v, l]) => (
            <div key={l}><div className="font-serif text-4xl font-bold text-white mb-1">{v}</div><div className="text-stone-400 text-sm">{l}</div></div>
          ))}
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <p className="section-label">Free Tool</p>
            <h2 className="section-title text-4xl">How Much Do You Need?</h2>
            <p className="text-stone-500 mt-2">Enter your room dimensions — we'll calculate how much to order including wastage.</p>
          </div>
          <div className="max-w-xl mx-auto bg-stone-50 border border-stone-200 rounded-2xl p-8">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div><label className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">Length (m)</label><input type="number" value={calcL} onChange={e => setCalcL(e.target.value)} placeholder="5.4" className="input-field" /></div>
              <div><label className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">Width (m)</label><input type="number" value={calcW} onChange={e => setCalcW(e.target.value)} placeholder="4.2" className="input-field" /></div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-1.5 block">Wastage</label>
                <select value={calcWaste} onChange={e => setCalcWaste(e.target.value)} className="input-field">
                  <option value="5">5% — Straight lay</option>
                  <option value="10">10% — Herringbone</option>
                  <option value="15">15% — Complex</option>
                </select>
              </div>
            </div>
            <button onClick={calculate} className="btn-primary w-full flex items-center justify-center gap-2"><Calculator size={16} />Calculate</button>
            {calcResult && (
              <div className="mt-4 bg-white border-l-4 border-terra rounded-lg px-4 py-3">
                <p className="font-semibold text-stone-900 text-sm">{calcResult}</p>
                <p className="text-xs text-stone-400 mt-1">We recommend ordering 5–10% extra for future repairs.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section className="bg-stone-50 py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div><p className="section-label">Expert Guides</p><h2 className="section-title text-4xl">Ideas & Advice</h2></div>
            <Link to="/blog" className="hidden sm:flex items-center gap-1 text-sm font-medium text-terra hover:underline">View All <ArrowRight size={14} /></Link>
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {['all','hybrid','vinyl','timber','laminate','bamboo','tiles'].map(t => (
              <button key={t} onClick={() => setBlogTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-150 ${blogTab === t ? 'bg-terra text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-terra hover:text-terra'}`}>
                {t === 'all' ? 'All Articles' : t}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.slice(0, 6).map(b => (
              <Link key={b._id} to={`/blog/${b.slug}`} className="card-hover group">
                <div className="h-44 flex items-center justify-center text-4xl" style={{ background: `linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo})` }}>
                  {b.category === 'hybrid' ? '🌊' : b.category === 'tiles' ? '🪨' : b.category === 'timber' ? '🪵' : b.category === 'laminate' ? '📋' : b.category === 'vinyl' ? '🌿' : b.category === 'bamboo' ? '🎋' : '📝'}
                </div>
                <div className="p-5">
                  <span className={`badge text-[11px] mb-3 ${BLOG_COLOURS[b.category] || 'bg-stone-100 text-stone-600'}`}>{b.category}</span>
                  <h3 className="font-serif text-lg font-semibold text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-terra transition-colors">{b.title}</h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mb-3">{b.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-stone-400">
                    <span>{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }) : ''}</span>
                    <span className="text-terra font-medium">Read More →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-16">
        <div className="max-w-screen-xl mx-auto px-6">
          <p className="section-label">Customer Stories</p>
          <h2 className="section-title text-4xl mb-10">What Our Customers Say</h2>
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="min-w-[300px] bg-stone-50 border border-stone-200 rounded-xl p-6 flex-shrink-0 snap-start">
                <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(s => <Star key={s} size={13} className="text-amber-400 fill-amber-400" />)}</div>
                <p className="text-sm text-stone-700 leading-relaxed italic mb-4">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-stone-900">{t.name}</p>
                  <p className="text-xs text-stone-400">{t.location}</p>
                  <p className="text-xs text-terra mt-1">{t.product}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
