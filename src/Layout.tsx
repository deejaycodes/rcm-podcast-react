import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const links = [
    { to: '/bible-study', label: 'Bible Study' },
    { to: '/school-of-prayer', label: 'Prayer' },
    { to: '/blog', label: 'Blog' },
  ]
  return (
    <nav className="fixed top-0 w-full z-40 bg-white/85 backdrop-blur-xl border-b border-purple-100/50">
      <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline text-gray-900">
          <span className="w-9 h-9 bg-accent rounded-[10px] flex items-center justify-center text-white text-sm">✝</span>
          <span className="font-extrabold text-lg">RCM</span>
        </Link>
        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`text-sm px-3 py-1.5 rounded-full transition no-underline ${pathname === l.to ? 'bg-accent/10 text-accent font-semibold' : 'text-gray-700 hover:text-gray-900'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="sm:hidden w-9 h-9 flex items-center justify-center text-gray-700 text-lg">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-purple-100/50 bg-white px-5 py-3 flex flex-col gap-1">
          {[{ to: '/', label: 'Home' }, ...links].map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-sm px-3 py-2.5 rounded-xl transition no-underline ${pathname === l.to ? 'bg-accent/10 text-accent font-semibold' : 'text-gray-700'}`}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-purple-100/50 py-8">
      <div className="max-w-3xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs">✝</span>
          <div>
            <strong className="text-sm block">Revelation of Christ Ministries</strong>
            <span className="text-xs text-gray-500">Deji Odetayo</span>
          </div>
        </div>
        <div className="flex gap-5">
          {[{ to: '/bible-study', l: 'Bible Study' }, { to: '/school-of-prayer', l: 'Prayer' }, { to: '/blog', l: 'Blog' }].map(l => (
            <Link key={l.to} to={l.to} className="text-sm text-gray-600 hover:text-gray-900 transition no-underline">{l.l}</Link>
          ))}
        </div>
        <span className="text-xs text-gray-400">© 2026 RCM</span>
      </div>
    </footer>
  )
}
