import { useState, useEffect } from 'react'
import { getLocal, setLocal, Announcement } from './supabase'

export function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>(() => getLocal('announcements', []))
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null)

  useEffect(() => { setLocal('announcements', items) }, [items])

  const save = () => {
    if (!editing?.text) return
    const item: Announcement = {
      id: editing.id || Date.now().toString(),
      text: editing.text,
      link: editing.link || '',
      active: editing.active ?? true,
      created_at: editing.created_at || new Date().toISOString(),
    }
    setItems(prev => {
      const exists = prev.find(a => a.id === item.id)
      if (exists) return prev.map(a => a.id === item.id ? item : a)
      return [item, ...prev]
    })
    setEditing(null)
  }

  const del = (id: string) => {
    if (!confirm('Delete?')) return
    setItems(prev => prev.filter(a => a.id !== id))
  }

  if (editing) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setEditing(null)} className="text-purple-400 text-sm font-semibold hover:text-white transition">← Back</button>
          <button onClick={save} className="bg-accent text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-accent/90 transition">Save</button>
        </div>
        <h2 className="text-xl font-extrabold text-white mb-6">{editing.id ? 'Edit' : 'New'} Announcement</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Message</label>
            <input value={editing.text || ''} onChange={e => setEditing({ ...editing, text: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent placeholder:text-gray-600" placeholder="🎉 New Bible Study series starting this week!" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Link (optional)</label>
            <input value={editing.link || ''} onChange={e => setEditing({ ...editing, link: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent placeholder:text-gray-600" placeholder="/bible-study" />
          </div>
          <label className="flex items-center gap-2.5 text-sm text-gray-400 cursor-pointer">
            <div className={`w-10 h-6 rounded-full transition flex items-center px-0.5 ${editing.active ? 'bg-accent' : 'bg-white/10'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${editing.active ? 'translate-x-4' : ''}`} />
            </div>
            <input type="checkbox" checked={editing.active ?? true} onChange={e => setEditing({ ...editing, active: e.target.checked })} className="hidden" />
            {editing.active ? 'Active' : 'Inactive'}
          </label>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-0.5">Announcements</h1>
          <p className="text-sm text-gray-500">Banner messages shown at the top of the site</p>
        </div>
        <button onClick={() => setEditing({ text: '', link: '', active: true })}
          className="bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent/90 transition">+ New</button>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(a => (
          <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition group">
            <span className="text-lg">{a.active ? '📢' : '🔇'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">{a.text}</p>
              <p className="text-xs text-gray-500">{a.active ? '🟢 Active' : '⚪ Inactive'}{a.link && ` · ${a.link}`}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => setEditing(a)} className="text-xs text-purple-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Edit</button>
              <button onClick={() => del(a.id)} className="text-xs text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {!items.length && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-sm">No announcements yet.</p>
          <p className="text-gray-700 text-xs mt-1">Create one to show a banner at the top of your website.</p>
        </div>
      )}
    </>
  )
}
