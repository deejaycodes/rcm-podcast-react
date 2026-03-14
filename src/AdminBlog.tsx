import { useState, useEffect } from 'react'
import { supabase, BlogPost } from './supabase'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

const empty: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = { title: '', slug: '', content: '', excerpt: '', cover_image: '', published: false }

export function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null)
  const [saving, setSaving] = useState(false)

  const load = () => supabase.from('rcm_blog_posts').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setPosts(data) })
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    setSaving(true)
    const slug = editing.slug || editing.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || ''
    const data = { ...editing, slug }
    if (editing.id) {
      await supabase.from('rcm_blog_posts').update(data).eq('id', editing.id)
    } else {
      await supabase.from('rcm_blog_posts').insert(data)
    }
    setSaving(false)
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
      <>
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setEditing(null)} className="text-purple-400 text-sm font-semibold hover:text-white transition">← Back to Posts</button>
          <button onClick={save} disabled={saving}
            className="bg-accent text-white px-5 py-2 rounded-xl font-semibold text-sm hover:bg-accent/90 disabled:opacity-50 transition">
            {saving ? 'Saving...' : 'Save Post'}
          </button>
        </div>
        <h2 className="text-xl font-extrabold text-white mb-6">{editing.id ? 'Edit Post' : 'New Post'}</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Title</label>
            <input value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent placeholder:text-gray-600" placeholder="Post title" />
            {editing.title && <p className="text-[11px] text-gray-600 mt-1 ml-1">/blog/{editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Excerpt</label>
            <textarea value={editing.excerpt || ''} onChange={e => setEditing({ ...editing, excerpt: e.target.value })} rows={2}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent placeholder:text-gray-600 resize-none" placeholder="Short summary for previews" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Cover Image URL</label>
            <input value={editing.cover_image || ''} onChange={e => setEditing({ ...editing, cover_image: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent placeholder:text-gray-600" placeholder="https://images.unsplash.com/..." />
            {editing.cover_image && <img src={editing.cover_image} alt="" className="mt-2 h-32 object-cover rounded-xl" />}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">Content</label>
            <p className="text-[11px] text-gray-600 mb-2">💡 Use the <span className="text-purple-400 font-semibold">"</span> blockquote button in the toolbar to create shareable quotes — readers can tweet them or download as images.</p>
            <div className="[&_.ql-toolbar]:bg-white/5 [&_.ql-toolbar]:border-white/10 [&_.ql-toolbar]:rounded-t-xl [&_.ql-container]:bg-white/5 [&_.ql-container]:border-white/10 [&_.ql-container]:rounded-b-xl [&_.ql-container]:min-h-[250px] [&_.ql-container]:text-sm [&_.ql-editor]:text-gray-300 [&_.ql-stroke]:stroke-gray-400 [&_.ql-fill]:fill-gray-400 [&_.ql-picker-label]:text-gray-400">
              <ReactQuill theme="snow" value={editing.content || ''} onChange={v => setEditing({ ...editing, content: v })}
                modules={{ toolbar: [['bold', 'italic', 'underline'], [{ header: [2, 3, false] }], ['blockquote'], ['link', 'image'], [{ list: 'ordered' }, { list: 'bullet' }], ['clean']] }} />
            </div>
          </div>
          <label className="flex items-center gap-2.5 text-sm text-gray-400 cursor-pointer">
            <div className={`w-10 h-6 rounded-full transition flex items-center px-0.5 ${editing.published ? 'bg-accent' : 'bg-white/10'}`}>
              <div className={`w-5 h-5 bg-white rounded-full transition-transform ${editing.published ? 'translate-x-4' : ''}`} />
            </div>
            <input type="checkbox" checked={editing.published || false} onChange={e => setEditing({ ...editing, published: e.target.checked })} className="hidden" />
            {editing.published ? 'Published' : 'Draft'}
          </label>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-0.5">Blog Posts</h1>
          <p className="text-sm text-gray-500">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setEditing({ ...empty })} className="bg-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-accent/90 transition">+ New Post</button>
      </div>
      <div className="flex flex-col gap-2">
        {posts.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition group">
            {p.cover_image && <img src={p.cover_image} alt="" className="w-14 h-14 object-cover rounded-xl flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white truncate">{p.title}</h3>
              <p className="text-xs text-gray-500">{new Date(p.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })} · {p.published ? '🟢 Published' : '⚪ Draft'}</p>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
              <button onClick={() => setEditing(p)} className="text-xs text-purple-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Edit</button>
              <button onClick={() => del(p.id)} className="text-xs text-red-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-white/5 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
      {!posts.length && <p className="text-center text-gray-600 text-sm mt-12">No posts yet. Create your first article!</p>}
    </>
  )
}
