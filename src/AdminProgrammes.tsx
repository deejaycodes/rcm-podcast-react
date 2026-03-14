import { useState, useEffect } from 'react'
import { supabase, Programme } from './supabase'

export function AdminProgrammes() {
  const [progs, setProgs] = useState<Programme[]>([])
  const [editing, setEditing] = useState<Partial<Programme> | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => supabase.from('rcm_programmes').select('*').order('sort_order').then(({ data }) => { if (data) setProgs(data) })
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    if (editing.id) {
      await supabase.from('rcm_programmes').update(editing).eq('id', editing.id)
    } else {
      await supabase.from('rcm_programmes').insert({ ...editing, sort_order: progs.length })
    }
    setSaving(false)
    setEditing(null)
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this programme?')) return
    await supabase.from('rcm_programmes').delete().eq('id', id)
    load()
  }

  if (editing) {
    return (
      <>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setEditing(null)} className="text-purple-400 text-sm font-semibold hover:text-white transition">← Back</button>
          <button onClick={save} disabled={saving} className="bg-accent text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-accent/90 disabled:opacity-50 transition">
            {saving ? 'Saving...' : 'Save Programme'}
          </button>
        </div>
        <h2 className="text-xl font-extrabold text-white mb-6">{editing.id ? 'Edit' : 'New'} Programme</h2>
        <div className="flex flex-col gap-4">
          {([
            ['title', 'Programme Title', 'Christ Revealed Bible Study'],
            ['subtitle', 'Subtitle', 'Podcast subtitle'],
            ['description', 'Description', 'Short description'],
            ['icon', 'Icon (emoji)', '📖'],
            ['rss_url', 'RSS Feed URL', 'https://anchor.fm/s/.../podcast/rss'],
            ['verse_text', 'Scripture Text', 'To open their eyes...'],
            ['verse_ref', 'Scripture Reference', 'Acts 26:18'],
          ] as const).map(([key, label, ph]) => (
            <div key={key}>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">{label}</label>
              <input value={(editing as any)[key] || ''} onChange={e => setEditing({ ...editing, [key]: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent placeholder:text-gray-600" placeholder={ph} />
            </div>
          ))}
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
          <h1 className="text-2xl font-extrabold text-white mb-0.5">Programmes</h1>
          <p className="text-sm text-gray-500">{progs.length} programme{progs.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setEditing({ title: '', subtitle: '', description: '', icon: '🎙', rss_url: '', color: 'from-accent to-purple-700', verse_text: '', verse_ref: '', active: true })}
          className="bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent/90 transition">+ New Programme</button>
      </div>
      <div className="flex flex-col gap-2">
        {progs.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition group">
            <span className="text-2xl">{p.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white">{p.title}</h3>
              <p className="text-xs text-gray-500">{p.rss_url ? '🔗 RSS connected' : '⚪ No RSS feed'} · {p.active ? '🟢 Active' : '⚪ Inactive'}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => setEditing(p)} className="text-xs text-purple-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Edit</button>
              <button onClick={() => del(p.id)} className="text-xs text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {!progs.length && <p className="text-center text-gray-600 text-sm mt-12">No programmes yet.</p>}
    </>
  )
}
