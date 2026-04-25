import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check, Eye } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

const CATS = ['hybrid','vinyl','timber','laminate','bamboo','tiles','carpet','general']
const EMPTY = { title: '', slug: '', category: 'general', excerpt: '', content: '', gradientFrom: '#8B7D72', gradientTo: '#6B5D52', readTime: '5 min read', isPublished: false, featured: false, tags: '' }

export default function AdminBlog() {
  const [blogs,   setBlogs]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modal,   setModal]   = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form,    setForm]    = useState<any>(EMPTY)
  const [saving,  setSaving]  = useState(false)
  const [tab,     setTab]     = useState<'all'|'published'|'drafts'>('all')

  const load = () => {
    setLoading(true)
    // fetch all including unpublished for admin
    api.get('/blog', { params: { limit: 50 } }).then(r => setBlogs(r.data.blogs)).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const filtered = blogs.filter(b => tab === 'all' ? true : tab === 'published' ? b.isPublished : !b.isPublished)

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (b: any) => { setEditing(b); setForm({ ...b, tags: b.tags?.join(', ') || '' }); setModal(true) }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [] }
      if (editing) { await api.put(`/blog/${editing._id}`, body); toast.success('Post updated') }
      else         { await api.post('/blog', body);               toast.success('Post created') }
      setModal(false); load()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await api.delete(`/blog/${id}`); toast.success('Post deleted'); load()
  }

  const set = (k: string) => (e: any) => setForm((f: any) => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const BLOG_COLOURS: Record<string,string> = { hybrid:'bg-teal-100 text-teal-800', laminate:'bg-amber-100 text-amber-800', vinyl:'bg-blue-100 text-blue-800', bamboo:'bg-green-100 text-green-800', timber:'bg-orange-100 text-orange-800', tiles:'bg-red-100 text-red-800', general:'bg-stone-100 text-stone-600' }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex gap-2">
          {(['all','published','drafts'] as const).map(t => <button key={t} onClick={() => setTab(t)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize ${tab === t ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}>{t}</button>)}
        </div>
        <span className="text-sm text-stone-400">{filtered.length} posts</span>
        <button onClick={openCreate} className="btn-primary ml-auto flex items-center gap-2 text-sm py-2"><Plus size={15} />New Post</button>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['Post','Category','Date','Views','Status','Actions'].map(h => <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? <tr><td colSpan={6} className="text-center py-10 text-stone-400">Loading…</td></tr>
              : filtered.map(b => (
              <tr key={b._id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${b.gradientFrom}, ${b.gradientTo})` }} />
                    <div>
                      <p className="font-medium text-stone-900 line-clamp-1">{b.title}</p>
                      <p className="text-xs text-stone-400">{b.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5"><span className={`badge text-xs ${BLOG_COLOURS[b.category] || ''}`}>{b.category}</span></td>
                <td className="px-5 py-3.5 text-xs text-stone-400">{b.publishedAt ? new Date(b.publishedAt).toLocaleDateString('en-AU') : '—'}</td>
                <td className="px-5 py-3.5 text-stone-500">{b.views || 0}</td>
                <td className="px-5 py-3.5"><span className={`badge text-xs ${b.isPublished ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-600'}`}>{b.isPublished ? 'Published' : 'Draft'}</span>{b.featured && <span className="badge bg-purple-100 text-purple-700 text-[10px] ml-1">Featured</span>}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <a href={`/blog/${b.slug}`} target="_blank" rel="noreferrer" className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"><Eye size={13} /></a>
                    <button onClick={() => openEdit(b)}          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => handleDelete(b._id, b.title)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h2 className="font-semibold text-stone-900">{editing ? 'Edit Post' : 'New Blog Post'}</h2>
              <button onClick={() => setModal(false)} className="text-stone-400 hover:text-stone-700"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div><label className="admin-label">Title *</label><input value={form.title} onChange={set('title')} className="input-field" placeholder="Post title…" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Slug *</label><input value={form.slug} onChange={set('slug')} className="input-field" placeholder="url-friendly-slug" /></div>
                <div>
                  <label className="admin-label">Category *</label>
                  <select value={form.category} onChange={set('category')} className="input-field">
                    {CATS.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="admin-label">Excerpt *</label><textarea value={form.excerpt} onChange={set('excerpt')} rows={2} className="input-field resize-none" placeholder="Short summary shown on cards…" /></div>
              <div><label className="admin-label">Content *</label><textarea value={form.content} onChange={set('content')} rows={10} className="input-field resize-none font-mono text-xs" placeholder="Full article content…" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Gradient From</label><input type="color" value={form.gradientFrom} onChange={set('gradientFrom')} className="input-field h-10 px-2 py-1" /></div>
                <div><label className="admin-label">Gradient To</label><input type="color" value={form.gradientTo} onChange={set('gradientTo')} className="input-field h-10 px-2 py-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="admin-label">Read Time</label><input value={form.readTime} onChange={set('readTime')} className="input-field" placeholder="5 min read" /></div>
                <div><label className="admin-label">Tags (comma separated)</label><input value={form.tags} onChange={set('tags')} className="input-field" placeholder="tag1, tag2" /></div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.isPublished} onChange={set('isPublished')} className="accent-terra w-4 h-4" />Published</label>
                <label className="flex items-center gap-2 cursor-pointer text-sm"><input type="checkbox" checked={form.featured} onChange={set('featured')} className="accent-terra w-4 h-4" />Featured</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-stone-200 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-outline text-sm py-2">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 flex items-center gap-2 disabled:opacity-60"><Check size={14} />{saving ? 'Saving…' : editing ? 'Update Post' : 'Publish Post'}</button>
            </div>
          </div>
        </div>
      )}
      <style>{`.admin-label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #8B7D72; margin-bottom: 4px; }`}</style>
    </div>
  )
}
