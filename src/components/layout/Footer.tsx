import { Link } from 'react-router-dom'
import { useState } from 'react'
import toast from 'react-hot-toast'

const cols = [
  { title: 'Shop', links: [
    { label: 'Hybrid Flooring',    to: '/shop/hybrid' },
    { label: 'Vinyl Plank',        to: '/shop/vinyl' },
    { label: 'Engineered Timber',  to: '/shop/timber' },
    { label: 'Laminate',           to: '/shop/laminate' },
    { label: 'Bamboo',             to: '/shop/bamboo' },
    { label: 'Carpet Tiles',       to: '/shop/carpet' },
    { label: 'Tiles',              to: '/shop/tiles' },
    { label: '🎉 On Sale',         to: '/shop?onSale=true', accent: true },
  ]},
  { title: 'Help', links: [
    { label: 'Book Free Home Measure', to: '/book-measure' },
    { label: 'FAQ',                to: '/contact' },
    { label: 'Installation Guides',to: '/blog' },
    { label: 'Request a Sample',   to: '/contact' },
    { label: 'Floor Finder',       to: '/floor-finder' },
    { label: 'Room Visualiser',    to: '/visualizer' },
    { label: 'Contact Us',         to: '/contact' },
  ]},
  { title: 'Company', links: [
    { label: 'About Us',           to: '/about' },
    { label: 'Why Shop With Us',   to: '/about' },
    { label: 'Customer Reviews',   to: '/about' },
    { label: 'Ideas & Advice',     to: '/blog' },
    { label: 'Terms & Conditions', to: '/terms' },
    { label: 'Privacy Policy',     to: '/terms' },
  ]},
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subbed, setSubbed] = useState(false)

  const handleSub = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast.success('Thanks! We\'ll be in touch with the best deals.')
    setSubbed(true)
  }

  return (
    <footer className="bg-stone-50 border-t border-stone-200">
      <div className="max-w-screen-xl mx-auto px-6 pt-16 pb-8">

        {/* Email signup banner */}
        <div className="bg-stone-800 rounded-2xl p-8 mb-16 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div>
            <h3 className="font-serif text-2xl text-white font-semibold mb-1">Stay in the Loop</h3>
            <p className="text-stone-400 text-sm">Get exclusive deals, new arrivals, and flooring inspiration for your Victorian home.</p>
          </div>
          {subbed ? (
            <p className="text-green-400 text-sm font-medium bg-green-400/10 px-6 py-3 rounded-lg">✓ You're subscribed!</p>
          ) : (
            <form onSubmit={handleSub} className="flex gap-2 w-full md:w-auto">
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" className="input-field bg-stone-700 border-stone-600 text-white placeholder:text-stone-400 min-w-[240px]" />
              <button type="submit" className="btn-primary flex-shrink-0">Subscribe</button>
            </form>
          )}
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="font-serif text-2xl font-semibold text-stone-900 mb-3">Avenue Surface</div>
            <p className="text-sm text-stone-500 leading-relaxed mb-2 max-w-xs">
              Victoria's trusted tiles and flooring specialist. Quality products, honest advice, and service that actually shows up.
            </p>
            <p className="text-xs text-stone-400 mb-5">ABN 78 670 943 825 · Victoria, Australia</p>
            <div className="flex gap-3 mb-5">
              {['In','Fb','Pt','Yt'].map(s => (
                <a key={s} href="#" aria-label={s} className="w-9 h-9 rounded-full border border-stone-300 flex items-center justify-center text-xs text-stone-500 hover:bg-terra hover:border-terra hover:text-white transition-all duration-200 font-medium">{s}</a>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="badge bg-stone-100 text-stone-600 text-[11px]">🇦🇺 Victoria Only</span>
              <span className="badge bg-stone-100 text-stone-600 text-[11px]">✅ AS Compliant</span>
              <span className="badge bg-stone-100 text-stone-600 text-[11px]">🌿 FSC Certified</span>
            </div>
          </div>

          {/* Link cols */}
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-stone-400 mb-5">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.label}>
                    <Link to={l.to} className={`text-sm transition-colors ${(l as any).accent ? 'text-terra font-medium' : 'text-stone-500 hover:text-terra'}`}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="border-t border-stone-200 pt-6 mb-4 flex flex-wrap gap-6 text-sm text-stone-400">
          <a href="mailto:info@avenuesurrface.com.au" className="hover:text-terra transition-colors">📧 info@avenuesurrface.com.au</a>
          <span>📍 Victoria, Australia</span>
          <span>🇦🇺 Serving Melbourne Metro & surrounding suburbs</span>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-200 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-stone-400">
          <span>© 2026 Avenue Surface. All rights reserved. ABN 78 670 943 825</span>
          <div className="flex gap-4">
            <Link to="/terms" className="hover:text-terra transition-colors">Terms</Link>
            <Link to="/terms" className="hover:text-terra transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-terra transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
