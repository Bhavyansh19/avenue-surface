import { Link } from 'react-router-dom'
export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <div className="font-serif text-9xl font-bold text-stone-100 mb-4">404</div>
      <h1 className="font-serif text-4xl font-semibold text-stone-900 mb-3">Page Not Found</h1>
      <p className="text-stone-500 mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex gap-3">
        <Link to="/"     className="btn-primary">Back to Home</Link>
        <Link to="/shop" className="btn-outline">Browse Products</Link>
      </div>
    </div>
  )
}
