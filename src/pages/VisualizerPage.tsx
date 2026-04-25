import { Helmet } from 'react-helmet-async'
import { Check, ExternalLink } from 'lucide-react'

// ⚠️ CHANGE THIS: Replace with your TilesView.ai store ID from https://tilesview.ai/tvdesh
// Set VITE_TILESVIEW_STORE_ID in .env.local (dev) or Vercel env vars (production)
const TILESVIEW_STORE_ID = import.meta.env.VITE_TILESVIEW_STORE_ID || ''

export default function VisualizerPage() {
  const hasStoreId = TILESVIEW_STORE_ID !== 'REPLACE_WITH_YOUR_TILESVIEW_STORE_ID'

  return (
    <>
      <Helmet><title>Room Visualiser — Avenue Surface</title></Helmet>

      {/* Header */}
      <div className="bg-stone-800 py-12 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-6 justify-between">
          <div>
            <p className="text-terra text-xs font-semibold tracking-widest uppercase mb-2">Powered by TilesView.ai</p>
            <h1 className="font-serif text-4xl font-semibold text-white mb-2">Room Visualiser</h1>
            <p className="text-stone-400 max-w-lg">See exactly how any tile or floor looks in your actual room before you buy. Upload a photo or choose from our preset rooms.</p>
          </div>
          <a href="https://tilesview.ai" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-stone-400 hover:text-white transition-colors flex-shrink-0">
            Visit TilesView.ai <ExternalLink size={14} />
          </a>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-stone-50 border-b border-stone-200 py-8 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-wrap gap-8 justify-center">
          {[['📷','Upload Your Room','Take a photo or choose a preset room'],['🎨','Select a Product','Browse our full catalogue in the visualiser'],['✨','See It Rendered','AI applies the floor to your actual space in seconds'],['💾','Share or Order','Save your design or add directly to cart']].map(([icon, title, desc]) => (
            <div key={title} className="flex items-center gap-3 text-sm">
              <span className="text-2xl">{icon}</span>
              <div><p className="font-medium text-stone-800">{title}</p><p className="text-stone-500 text-xs">{desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Visualiser embed */}
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {hasStoreId ? (
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-lg" style={{ height: '700px' }}>
            <iframe
              src={`https://tilesview.ai/visualizer/embed?store=${TILESVIEW_STORE_ID}`}
              width="100%"
              height="100%"
              frameBorder="0"
              title="Avenue Surface Room Visualiser — Powered by TilesView.ai"
              allow="camera"
            />
          </div>
        ) : (
          /* Setup instructions shown until TilesView is configured */
          <div className="border-2 border-dashed border-stone-300 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-6">🔧</div>
            <h2 className="font-serif text-3xl font-semibold text-stone-900 mb-3">TilesView.ai Setup Required</h2>
            <p className="text-stone-500 max-w-lg mx-auto mb-8">To activate the Room Visualiser, you need to connect your TilesView.ai account. This takes about 10 minutes to set up.</p>

            <div className="bg-white border border-stone-200 rounded-xl p-6 max-w-lg mx-auto text-left space-y-4 mb-8">
              <p className="font-semibold text-stone-900 mb-3">Setup Steps:</p>
              {[
                ['Sign up at tilesview.ai/signup (14-day free trial)', 'https://tilesview.ai/signup'],
                ['Choose the E-Commerce or Retailer plan','https://tilesview.ai/packages'],
                ['Upload your product catalogue in the TilesView admin','https://tilesview.ai/tvdesh'],
                ['Get your Store ID from Admin → Website Integration','https://tilesview.ai/integrate-web'],
                ['Replace TILESVIEW_STORE_ID in client/src/pages/VisualizerPage.tsx', null],
                ['Also add TILESVIEW_STORE_ID to your server/.env file', null],
              ].map(([step, link], i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-terra/10 text-terra text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
                  {link ? <a href={link as string} target="_blank" rel="noreferrer" className="text-sm text-terra hover:underline">{step}</a> : <span className="text-sm text-stone-600">{step}</span>}
                </div>
              ))}
            </div>

            <a href="https://tilesview.ai/signup" target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
              Get Started with TilesView.ai <ExternalLink size={14} />
            </a>
          </div>
        )}

        {/* Features below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
          {[['🖼️','2D Visualiser','See floors rendered in a flat 2D room view'],['🌐','360° Panorama','Immersive full-room visualisation'],['📱','Mobile Friendly','Works on phones and tablets'],['🔗','Direct to Cart','Add to cart directly from the visualiser']].map(([icon, title, desc]) => (
            <div key={title} className="bg-stone-50 border border-stone-200 rounded-xl p-5 text-center">
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-semibold text-stone-900 text-sm mb-1">{title}</h3>
              <p className="text-xs text-stone-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
