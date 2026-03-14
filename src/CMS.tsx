import { useState } from 'react'
import { AdminBlog } from './AdminBlog'
import { AdminProgrammes } from './AdminProgrammes'
import { AdminContent } from './AdminContent'
import { AdminAnnouncements } from './AdminAnnouncements'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'blog', label: 'Blog Posts', icon: '✍️' },
  { id: 'programmes', label: 'Programmes', icon: '🎙' },
  { id: 'content', label: 'Site Content', icon: '📝' },
  { id: 'announcements', label: 'Announcements', icon: '📢' },
] as const

type Tab = typeof TABS[number]['id']

export function CMS() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('rcm-admin') === '1')
  const [pw, setPw] = useState('')
  const [tab, setTab] = useState<Tab>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const ADMIN_PW = import.meta.env.VITE_ADMIN_PASSWORD || 'rcm-admin-2026'

  if (!authed) {
    return (
      <div className="min-h-screen bg-accent-dark flex items-center justify-center px-5">
        <form onSubmit={e => { e.preventDefault(); if (pw === ADMIN_PW) { sessionStorage.setItem('rcm-admin', '1'); setAuthed(true) } }} className="text-center w-full max-w-xs">
          <div className="w-14 h-14 bg-accent rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4">✝</div>
          <h2 className="text-2xl font-extrabold mb-1 text-white">RCM Admin</h2>
          <p className="text-sm text-gray-500 mb-6">Content Management System</p>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Admin password"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent placeholder:text-gray-600 mb-3" />
          <button type="submit" className="w-full bg-accent text-white py-3 rounded-xl font-semibold text-sm hover:bg-accent/90 transition">Sign In</button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#13111c] flex overflow-x-hidden">
      {/* Mobile menu toggle */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 right-4 z-50 w-10 h-10 bg-accent-dark border border-white/10 rounded-xl flex items-center justify-center text-white text-sm">
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-60 bg-accent-dark border-r border-white/5 flex flex-col transition-transform md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-accent rounded-[10px] flex items-center justify-center text-white text-sm">✝</span>
            <div>
              <span className="font-extrabold text-white text-sm block">RCM Admin</span>
              <span className="text-[10px] text-gray-500">Content Manager</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => { setTab(t.id); setSidebarOpen(false) }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition w-full ${
                tab === t.id ? 'bg-accent/15 text-purple-300 font-semibold' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}>
              <span>{t.icon}</span>{t.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/5">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-white hover:bg-white/5 transition no-underline">
            🌐 View Website
          </a>
          <button onClick={() => setAuthed(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-500 hover:text-red-400 hover:bg-white/5 transition w-full text-left">
            🚪 Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="md:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 min-h-screen overflow-x-hidden min-w-0">
        <div className="max-w-4xl mx-auto px-5 md:px-8 pt-16 md:pt-16 pb-8 md:pb-10">
          {tab === 'dashboard' && <Dashboard onNav={setTab} />}
          {tab === 'blog' && <AdminBlog />}
          {tab === 'programmes' && <AdminProgrammes />}
          {tab === 'content' && <AdminContent />}
          {tab === 'announcements' && <AdminAnnouncements />}
        </div>
      </main>
    </div>
  )
}

function Dashboard({ onNav }: { onNav: (t: Tab) => void }) {
  return (
    <>
      <h1 className="text-2xl font-extrabold text-white mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome back. Manage your website content.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {[
          { icon: '✍️', title: 'Blog Posts', desc: 'Create and manage articles', tab: 'blog' as Tab, color: 'from-accent to-purple-700' },
          { icon: '🎙', title: 'Programmes', desc: 'Edit podcast programmes', tab: 'programmes' as Tab, color: 'from-amber-500 to-orange-600' },
          { icon: '📝', title: 'Site Content', desc: 'Update hero, about, quotes', tab: 'content' as Tab, color: 'from-emerald-500 to-teal-600' },
          { icon: '📢', title: 'Announcements', desc: 'Manage site banners', tab: 'announcements' as Tab, color: 'from-rose-500 to-pink-600' },
        ].map(c => (
          <button key={c.tab} onClick={() => onNav(c.tab)}
            className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition text-left w-full group">
            <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center text-lg flex-shrink-0 group-hover:scale-105 transition`}>{c.icon}</div>
            <div>
              <h3 className="text-sm font-bold text-white mb-0.5">{c.title}</h3>
              <p className="text-xs text-gray-500">{c.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}
