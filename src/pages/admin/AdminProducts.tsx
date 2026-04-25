import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

const EMPTY: any = {
  name: '', slug: '', sku: '', description: '', shortDescription: '', price: '', salePrice: '', onSale: false,
  unit: 'm²', subCategory: '', brand: '', tags: '', coverImage: '', gradientFrom: '#D4C9BE', gradientTo: '#B8ADA0',
  isFeatured: false, isNew: false, isBestseller: false, stock: 100,
  attributes: { waterproof: false, herringbone: false, diyFriendly: false, petFriendly: false, outdoorRated: false, fscCertified: false, lowVoc: false, slipRating: '', colour: '', finish: '', thickness: '', warranty: '' },
}

export default function AdminProducts() {
  const [products,   setProducts]   = useState<any[]>([])
  const [categories, setCats]       = useState<any[]>([])
  const [total,      setTotal]      = useState(0)
  const [page,       setPage]       = useState(1)
  const [loading,    setLoading]    = useState(true)
  const [modal,      setModal]      = useState(false)
  const [editing,    setEditing]    = useState<any>(null)
  const [form,       setForm]       = useState<any>(EMPTY)
  const [search,     setSearch]     = useState('')
  const [saving,     setSaving]     = useState(false)

  const load = () => {
    setLoading(true)
    const params: any = { page, limit: 15 }
    if (search) params.search = search
    api.get('/products', { params }).then(r => { setProducts(r.data.products); setTotal(r.data.total) }).finally(() => setLoading(false))
  }

  useEffect(() => { api.get('/categories').then(r => setCats(r.data.categories)) }, [])
  useEffect(() => { load() }, [page, search])

  const openCreate = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit   = (p: any) => {
    setEditing(p)
    setForm({ ...p, price: p.price, salePrice: p.salePrice || '', tags: p.tags?.join(', ') || '', category: p.category?._id || p.category })
    setModal(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const body = { ...form, tags: form.tags ? form.tags.split(',').map((t: string) => t.trim()) : [], price: parseFloat(form.price), salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined }
      if (editing) { await api.put(`/products/${editing._id}`, body); toast.success('Product updated') }
      else         { await api.post('/products', body);              toast.success('Product created') }
      setModal(false); load()
    } catch (err: any) { toast.error(err.response?.data?.message || 'Error saving') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This will hide it from the store.`)) return
    await api.delete(`/products/${id}`)
    toast.success('Product removed'); load()
  }

  const set = (key: string) => (e: any) => setForm((f: any) => ({ ...f, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))
  const setAttr = (key: string) => (e: any) => setForm((f: any) => ({ ...f, attributes: { ...f.attributes, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value } }))

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search products…" className="input-field max-w-xs py-2 text-sm" />
        <span className="text-sm text-stone-400">{total} products</span>
        <button onClick={openCreate} className="btn-primary ml-auto flex items-center gap-2 text-sm py-2"><Plus size={15} />Add Product</button>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['Product','Category','Price','Stock','Status','Actions'].map(h => <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? <tr><td colSpan={6} className="text-center py-10 text-stone-400">Loading…</td></tr> :
              products.map(p => (
                <tr key={p._id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex-shrink-0" style={{ background: `linear-gradient(135deg, ${p.gradientFrom}, ${p.gradientTo})` }} />
                      <div>
                        <p className="font-medium text-stone-900 line-clamp-1">{p.name}</p>
                        <p className="text-xs text-stone-400">{p.brand || '—'} · {p.sku || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-stone-500">{p.category?.name || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className="font-medium text-stone-900">${p.price?.toFixed(2)}</span>
                    {p.onSale && p.salePrice && <span className="text-xs text-terra ml-1">(${p.salePrice?.toFixed(2)} sale)</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`badge text-xs ${p.stock < 10 ? 'bg-red-100 text-red-700' : p.stock < 30 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-1">
                      {p.isFeatured    && <span className="badge bg-purple-100 text-purple-700 text-[10px]">Featured</span>}
                      {p.isNew         && <span className="badge bg-blue-100 text-blue-700 text-[10px]">New</span>}
                      {p.isBestseller  && <span className="badge bg-amber-100 text-amber-700 text-[10px]">Bestseller</span>}
                      {p.onSale        && <span className="badge bg-red-100 text-red-700 text-[10px]">On Sale</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {Math.ceil(total / 15) > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(total / 15) }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded text-sm ${page === n ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}>{n}</button>
          ))}
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200">
              <h2 className="font-semibold text-stone-900">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setModal(false)} className="text-stone-400 hover:text-stone-700"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Name *</label><input value={form.name} onChange={set('name')} className="input-field" placeholder="Product name" /></div>
                <div><label className="label">Slug *</label><input value={form.slug} onChange={set('slug')} className="input-field" placeholder="product-slug" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">SKU</label><input value={form.sku} onChange={set('sku')} className="input-field" placeholder="ABC-001" /></div>
                <div>
                  <label className="label">Category *</label>
                  <select value={form.category} onChange={set('category')} className="input-field">
                    <option value="">Select category…</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
              </div>
              <div><label className="label">Short Description</label><input value={form.shortDescription} onChange={set('shortDescription')} className="input-field" placeholder="One-liner shown on product cards" /></div>
              <div><label className="label">Full Description *</label><textarea value={form.description} onChange={set('description')} rows={4} className="input-field resize-none" placeholder="Full product description…" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="label">Price (AUD) *</label><input type="number" step="0.01" value={form.price} onChange={set('price')} className="input-field" placeholder="54.95" /></div>
                <div><label className="label">Sale Price</label><input type="number" step="0.01" value={form.salePrice} onChange={set('salePrice')} className="input-field" placeholder="Optional" /></div>
                <div><label className="label">Unit</label><input value={form.unit} onChange={set('unit')} className="input-field" placeholder="m²" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Brand</label><input value={form.brand} onChange={set('brand')} className="input-field" /></div>
                <div><label className="label">Sub-category</label><input value={form.subCategory} onChange={set('subCategory')} className="input-field" /></div>
              </div>
              <div><label className="label">Tags (comma separated)</label><input value={form.tags} onChange={set('tags')} className="input-field" placeholder="waterproof, oak, herringbone" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Cover Image URL</label><input value={form.coverImage} onChange={set('coverImage')} className="input-field" placeholder="/uploads/image.jpg" /></div>
                <div><label className="label">Stock</label><input type="number" value={form.stock} onChange={set('stock')} className="input-field" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="label">Gradient From</label><input type="color" value={form.gradientFrom} onChange={set('gradientFrom')} className="input-field h-10 px-2 py-1 cursor-pointer" /></div>
                <div><label className="label">Gradient To</label><input type="color" value={form.gradientTo} onChange={set('gradientTo')} className="input-field h-10 px-2 py-1 cursor-pointer" /></div>
              </div>

              {/* Flags */}
              <div>
                <label className="label mb-2">Product Flags</label>
                <div className="flex flex-wrap gap-4">
                  {[['onSale','On Sale'],['isFeatured','Featured'],['isNew','New Arrival'],['isBestseller','Bestseller']].map(([k, l]) => (
                    <label key={k} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" checked={form[k]} onChange={set(k)} className="accent-terra w-4 h-4" />{l}
                    </label>
                  ))}
                </div>
              </div>

              {/* Attributes */}
              <div>
                <label className="label mb-2">Attributes</label>
                <div className="flex flex-wrap gap-4 mb-3">
                  {[['waterproof','Waterproof'],['herringbone','Herringbone'],['diyFriendly','DIY-Friendly'],['petFriendly','Pet-Friendly'],['outdoorRated','Outdoor Rated'],['fscCertified','FSC Certified'],['lowVoc','Low VOC']].map(([k, l]) => (
                    <label key={k} className="flex items-center gap-2 cursor-pointer text-sm">
                      <input type="checkbox" checked={form.attributes?.[k]} onChange={setAttr(k)} className="accent-terra w-4 h-4" />{l}
                    </label>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[['slipRating','Slip Rating (e.g. P4)'],['colour','Colour'],['finish','Finish'],['thickness','Thickness'],['warranty','Warranty']].map(([k, l]) => (
                    <div key={k}><label className="label">{l}</label><input value={form.attributes?.[k] || ''} onChange={setAttr(k)} className="input-field" /></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-stone-200 flex justify-end gap-3">
              <button onClick={() => setModal(false)} className="btn-outline text-sm py-2">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2 flex items-center gap-2 disabled:opacity-60">
                <Check size={14} />{saving ? 'Saving…' : editing ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.label { display: block; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #8B7D72; margin-bottom: 4px; }`}</style>
    </div>
  )
}
