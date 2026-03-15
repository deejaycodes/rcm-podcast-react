import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

export function Nav() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const links = [
    { to: '/bible-study', label: 'Bible Study' },
    { to: '/school-of-prayer', label: 'Prayer' },
    { to: '/blog', label: 'Blog' },
  ]

  // Fix #17 — Close mobile menu on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <nav ref={menuRef} className="fixed top-0 w-full z-40 bg-accent-dark/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline text-white">
          <span className="w-9 h-9 bg-accent rounded-[10px] flex items-center justify-center text-white text-sm">✝</span>
          <span className="font-extrabold text-lg">RCM</span>
        </Link>
        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-4">
          {links.map(l => (
            <Link key={l.to} to={l.to} className={`text-sm px-3 py-1.5 rounded-full transition no-underline ${pathname === l.to || pathname.startsWith(l.to + '/') ? 'bg-accent/20 text-purple-300 font-semibold' : 'text-gray-400 hover:text-white'}`}>
              {l.label}
            </Link>
          ))}
        </div>
        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="sm:hidden w-9 h-9 flex items-center justify-center text-gray-300 text-lg" aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
      </div>
      {/* Mobile menu */}
      {open && (
        <div className="sm:hidden border-t border-white/5 bg-accent-dark px-5 py-3 flex flex-col gap-1">
          {[{ to: '/', label: 'Home' }, ...links].map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className={`text-sm px-3 py-2.5 rounded-xl transition no-underline ${pathname === l.to ? 'bg-accent/20 text-purple-300 font-semibold' : 'text-gray-400 active:bg-white/5'}`}>
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
    <footer className="bg-accent-dark border-t border-white/5 py-10">
      <div className="max-w-3xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs">✝</span>
            <div>
              <strong className="text-sm block text-white">Revelation of Christ Ministries</strong>
              <span className="text-xs text-gray-500">Deji & Kemisola</span>
            </div>
          </div>
          <div className="flex gap-5 flex-wrap">
            {[{ to: '/bible-study', l: 'Bible Study' }, { to: '/school-of-prayer', l: 'Prayer' }, { to: '/blog', l: 'Blog' }].map(l => (
              <Link key={l.to} to={l.to} className="text-sm text-gray-400 hover:text-white transition no-underline">{l.l}</Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-white/5">
          <div className="flex items-center gap-4 flex-wrap">
            <a href="https://open.spotify.com/show/4VnpGdSCkRyJr0tgHELfwP" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-purple-400 transition no-underline">Spotify</a>
            <a href="https://podcasts.apple.com/podcast/id1772578109" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-purple-400 transition no-underline">Apple Podcasts</a>
          </div>
          <span className="text-xs text-gray-600">© 2026 RCM. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
