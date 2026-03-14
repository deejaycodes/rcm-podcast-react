import { useState, useEffect } from 'react'
import { supabase, BlogPost } from './supabase'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const empty: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = { title: '', slug: '', content: '', excerpt: '', cover_image: '', published: false }

export function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null)
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')

  const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || 'rcm-admin-2026'

  const load = () => supabase.from('rcm_blog_posts').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setPosts(data) })

  useEffect(() => { if (authed) load() }, [authed])

  if (!authed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <form onSubmit={e => { e.preventDefault(); if (pw === ADMIN_PW) setAuthed(true) }} className="text-center">
          <h2 className="text-2xl font-extrabold mb-4">Blog Admin</h2>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Admin password" className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent w-64 mb-3 block" />
          <button type="submit" className="bg-accent text-white px-6 py-2.5 rounded-full font-semibold text-sm">Enter</button>
        </form>
      </div>
    )
  }

  const save = async () => {
    if (!editing) return
    const slug = editing.slug || editing.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
    const data = { ...editing, slug }
    if (editing.id) {
      await supabase.from('rcm_blog_posts').update(data).eq('id', editing.id)
    } else {
      await supabase.from('rcm_blog_posts').insert(data)
    }
    setEditing(null)
    load()
  }

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return
    await supabase.from('rcm_blog_posts').delete().eq('id', id)
    load()
  }

  if (editing) {
    return (
      <div className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-5">
          <button onClick={() => setEditing(null)} className="text-accent text-sm font-medium mb-6 block">← Back</button>
          <h2 className="text-2xl font-extrabold mb-6">{editing.id ? 'Edit Post' : 'New Post'}</h2>
          <div className="flex flex-col gap-4">
            <input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} placeholder="Title" className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent" />
            <input value={editing.excerpt || ''} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Excerpt (short summary)" className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent" />
            <input value={editing.cover_image || ''} onChange={e => setEditing({ ...editing, cover_image: e.target.value })} placeholder="Cover image URL (optional)" className="px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-accent" />
            <ReactQuill theme="snow" value={editing.content || ''} onChange={v => setEditing({ ...editing, content: v })} className="bg-white rounded-xl [&_.ql-container]:min-h-[200px] [&_.ql-container]:text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.published || false} onChange={e => setEditing({ ...editing, published: e.target.checked })} className="accent-accent" />
              Published
            </label>
            <button onClick={save} className="bg-accent text-white px-6 py-3 rounded-full font-semibold text-sm self-start">Save Post</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-5">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-extrabold">Blog Admin</h2>
          <button onClick={() => setEditing({ ...empty })} className="bg-accent text-white px-5 py-2.5 rounded-full font-semibold text-sm">+ New Post</button>
        </div>
        <div className="flex flex-col gap-2">
          {posts.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-4 rounded-2xl border border-purple-100/50 bg-accent-light">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold truncate">{p.title}</h3>
                <p className="text-xs text-gray-400">{new Date(p.created_at).toLocaleDateString()} · {p.published ? '✅ Published' : '📝 Draft'}</p>
              </div>
              <button onClick={() => setEditing(p)} className="text-xs text-accent font-semibold">Edit</button>
              <button onClick={() => del(p.id)} className="text-xs text-red-400 font-semibold">Delete</button>
            </div>
          ))}
        </div>
        {!posts.length && <p className="text-center text-gray-400 text-sm mt-8">No posts yet. Create your first one!</p>}
      </div>
    </div>
  )
}
