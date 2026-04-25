import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft } from 'lucide-react'
import api from '../lib/api'

const BLOG_TABS = ['all','hybrid','vinyl','timber','laminate','bamboo','tiles','general']
const BLOG_COLOURS: Record<string,string> = { hybrid:'bg-teal-100 text-teal-800', laminate:'bg-amber-100 text-amber-800', vinyl:'bg-blue-100 text-blue-800', bamboo:'bg-green-100 text-green-800', timber:'bg-orange-100 text-orange-800', tiles:'bg-red-100 text-red-800', general:'bg-stone-100 text-stone-600' }

export function BlogPage() {
  const [blogs, setBlogs]   = useState<any[]>([])
  const [tab, setTab]       = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = tab === 'all' ? {} : { category: tab }
    api.get('/blog', { params }).then(r => setBlogs(r.data.blogs)).finally(() => setLoading(false))
  }, [tab])

  return (
    <>
      <Helmet><title>Ideas & Advice — Avenue Surface</title></Helmet>

      {/* Hero */}
      <div className="bg-stone-800 py-16 px-6 text-center">
        <p className="text-terra text-xs font-semibold tracking-widest uppercase mb-3">Expert Guides</p>
        <h1 className="font-serif text-5xl font-semibold text-white mb-3">Ideas & Advice</h1>
        <p className="text-stone-400 max-w-lg mx-auto">Expert flooring guides from our Australian specialists — installation tips, product comparisons, and inspiration.</p>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-12">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {BLOG_TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${tab === t ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}>
              {t === 'all' ? 'All Articles' : t}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({length: 6}).map((_,i) => <div key={i} className="rounded-xl border border-stone-200 animate-pulse"><div className="h-44 bg-stone-200 rounded-t-xl"/><div className="p-5 space-y-3"><div className="h-3 bg-stone-100 rounded w-1/4"/><div className="h-4 bg-stone-100 rounded"/><div className="h-4 bg-stone-100 rounded w-3/4"/></div></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map(b => (
              <Link key={b._id} to={`/blog/${b.slug}`} className="card-hover group">
                <div className="h-48 flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo})` }}>
                  {b.category === 'hybrid' ? '🌊' : b.category === 'tiles' ? '🪨' : b.category === 'timber' ? '🪵' : b.category === 'laminate' ? '📋' : b.category === 'vinyl' ? '🌿' : b.category === 'bamboo' ? '🎋' : '📝'}
                </div>
                <div className="p-5">
                  <span className={`badge text-[11px] mb-3 ${BLOG_COLOURS[b.category] || 'bg-stone-100 text-stone-600'}`}>{b.category}</span>
                  <h2 className="font-serif text-xl font-semibold text-stone-900 leading-snug mb-2 line-clamp-2 group-hover:text-terra transition-colors">{b.title}</h2>
                  <p className="text-sm text-stone-500 line-clamp-3 mb-4">{b.excerpt}</p>
                  <div className="flex justify-between text-xs text-stone-400">
                    <span>{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-AU',{month:'long',year:'numeric'}) : ''}</span>
                    <span className="text-stone-500">{b.readTime}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export function BlogPostPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/blog/${slug}`).then(r => setBlog(r.data.blog)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div className="max-w-2xl mx-auto px-6 py-20 text-center text-stone-400">Loading…</div>
  if (!blog) return <div className="max-w-2xl mx-auto px-6 py-20 text-center"><h2 className="font-serif text-3xl">Article not found</h2><Link to="/blog" className="btn-primary mt-4 inline-block">Back to Blog</Link></div>

  return (
    <>
      <Helmet><title>{blog.title} — Avenue Surface</title></Helmet>
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-terra mb-8 transition-colors"><ArrowLeft size={14} />Back to Ideas & Advice</Link>
        <div className="max-w-2xl mx-auto">
          <span className={`badge text-xs mb-4 ${BLOG_COLOURS[blog.category] || ''}`}>{blog.category}</span>
          <h1 className="font-serif text-4xl font-semibold text-stone-900 leading-tight mb-4">{blog.title}</h1>
          <div className="flex items-center gap-4 text-sm text-stone-400 mb-8">
            <span>{blog.authorName}</span>
            <span>·</span>
            <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'}) : ''}</span>
            <span>·</span>
            <span>{blog.readTime}</span>
          </div>
          <div className="h-64 rounded-2xl mb-10 flex items-center justify-center text-6xl" style={{ background: `linear-gradient(135deg, ${blog.gradientFrom}, ${blog.gradientTo})` }}>
            {blog.category === 'hybrid' ? '🌊' : blog.category === 'tiles' ? '🪨' : blog.category === 'timber' ? '🪵' : '📝'}
          </div>
          <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed whitespace-pre-line text-base">{blog.content}</div>
          <div className="mt-12 pt-8 border-t border-stone-200">
            <p className="text-sm text-stone-500 mb-4">Ready to get started? Explore our full range of products.</p>
            <Link to="/shop" className="btn-primary">Browse All Products</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default BlogPage
