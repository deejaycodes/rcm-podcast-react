import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export function PageTitle({ title }: { title: string }) {
  useEffect(() => { document.title = title }, [title])
  return null
}

const BASE_URL = 'https://rcm-podcast-react.vercel.app'

function setMeta(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) || document.querySelector(`meta[name="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(property.startsWith('og:') ? 'property' : 'name', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export function useMetaTags(opts: { title: string; description: string; image?: string; url?: string; type?: string }) {
  const { pathname } = useLocation()
  useEffect(() => {
    const url = opts.url || `${BASE_URL}${pathname}`
    const img = opts.image || `${BASE_URL}/og-default.png`
    document.title = opts.title
    setMeta('og:title', opts.title)
    setMeta('og:description', opts.description)
    setMeta('og:image', img)
    setMeta('og:url', url)
    setMeta('og:type', opts.type || 'website')
    setMeta('twitter:title', opts.title)
    setMeta('twitter:description', opts.description)
    setMeta('twitter:image', img)
  }, [opts.title, opts.description, opts.image, pathname])
}

export function shareUrl(url: string, title: string) {
  if (navigator.share) {
    navigator.share({ title, url }).catch(() => {})
  } else {
    navigator.clipboard.writeText(url).then(() => alert('Link copied!'))
  }
}

export function ShareButton({ url, title, className }: { url: string; title: string; className?: string }) {
  return (
    <button onClick={() => shareUrl(url, title)}
      className={`inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition ${className || ''}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share
    </button>
  )
}
