import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import api from '../../lib/api'

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [page,  setPage]  = useState(1)
  const [search,setSearch]= useState('')
  const [loading,setLoading]=useState(true)

  const load = () => {
    setLoading(true)
    api.get('/admin/users', { params: { page, limit: 20, search } }).then(r => { setUsers(r.data.users); setTotal(r.data.total) }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [page, search])

  const toggleRole = async (user: any) => {
    const newRole = user.role === 'admin' ? 'customer' : 'admin'
    if (!confirm(`Make ${user.firstName} ${user.lastName} a${newRole === 'admin' ? 'n admin' : ' customer'}?`)) return
    try { await api.put(`/admin/users/${user._id}/role`, { role: newRole }); toast.success('Role updated'); load() }
    catch { toast.error('Failed to update role') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} placeholder="Search by name or email…" className="input-field max-w-xs py-2 text-sm" />
        <span className="text-sm text-stone-400">{total} users</span>
      </div>

      <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>{['User','Email','Phone','Role','Joined','Action'].map(h => <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {loading ? <tr><td colSpan={6} className="text-center py-10 text-stone-400">Loading…</td></tr>
              : users.map(u => (
              <tr key={u._id} className="hover:bg-stone-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-terra/10 flex items-center justify-center text-xs font-bold text-terra">{u.firstName?.[0]}{u.lastName?.[0]}</div>
                    <span className="font-medium text-stone-900">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-stone-500">{u.email}</td>
                <td className="px-5 py-3.5 text-stone-400">{u.phone || '—'}</td>
                <td className="px-5 py-3.5"><span className={`badge text-xs ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-stone-100 text-stone-600'}`}>{u.role}</span></td>
                <td className="px-5 py-3.5 text-xs text-stone-400">{new Date(u.createdAt).toLocaleDateString('en-AU')}</td>
                <td className="px-5 py-3.5">
                  <button onClick={() => toggleRole(u)} className={`text-xs font-medium hover:underline ${u.role === 'admin' ? 'text-red-500' : 'text-terra'}`}>
                    {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {Math.ceil(total / 20) > 1 && (
        <div className="flex gap-2">
          {Array.from({ length: Math.ceil(total / 20) }, (_, i) => i + 1).map(n => (
            <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded text-sm ${page === n ? 'bg-stone-800 text-white' : 'bg-white border border-stone-200 text-stone-600'}`}>{n}</button>
          ))}
        </div>
      )}
    </div>
  )
}
