import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SAMPLE_POSTS } from './Blog'
import { useAudioPlayer } from './useAudioPlayer'

const programs = [
  {
    icon: '📖',
    title: 'Bible Study',
    subtitle: 'Christ Revealed Bible Study Podcast',
    desc: 'Your personal understanding of God\'s Word is pivotal to your relationship with Him. Learn God\'s Word and grow in your walk with Christ.',
    link: '/bible-study',
    color: 'from-accent to-purple-700',
  },
  {
    icon: '🙏',
    title: 'School of Prayer',
    subtitle: 'Learning to Pray Effectively',
    desc: 'A weekly programme where we learn about prayer and we pray. Grow your prayer life through teaching and practice.',
    link: '/school-of-prayer',
    color: 'from-amber-500 to-orange-600',
  },
]

export function Landing({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const [showTop, setShowTop] = useState(false)

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Use first 2 sample posts for preview
  const recentPosts = SAMPLE_POSTS.slice(0, 2)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative pt-36 pb-10 text-center overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-8">
            ✝ Revelation of Christ Ministries
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5">
            Grow in the<br />
            <span className="bg-gradient-to-r from-accent via-purple-400 to-amber-500 bg-clip-text text-transparent">Knowledge of Christ</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Bible study teachings and prayer sessions to help you deepen your relationship with God through His Word and prayer.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/bible-study" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 active:scale-[0.98] transition no-underline">
              <span className="text-xs">▶</span> Listen to Bible Study
            </Link>
            <Link to="/school-of-prayer" className="inline-flex items-center bg-accent/5 border border-accent/10 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-accent/10 active:scale-[0.98] transition no-underline">
              🙏 School of Prayer
            </Link>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Our Programmes</span>
          <h2 className="text-3xl font-extrabold mb-8">Listen & Learn</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {programs.map(p => (
              <Link key={p.link} to={p.link} className="group block p-6 rounded-2xl border border-purple-100/50 bg-accent-light hover:bg-accent-mid hover:border-accent/15 active:scale-[0.98] transition no-underline text-gray-900">
                <div className={`w-16 h-16 bg-gradient-to-br ${p.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition`}>
                  {p.icon}
                </div>
                <h3 className="text-xl font-extrabold mb-1">{p.title}</h3>
                <p className="text-sm text-accent font-semibold mb-2">{p.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{p.desc}</p>
                <span className="text-sm font-semibold text-accent group-hover:underline">Listen now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview — Fix #11: show actual recent post titles */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Blog</span>
          <h2 className="text-3xl font-extrabold mb-3">Articles & Reflections</h2>
          <p className="text-gray-600 mb-6">Written teachings, devotionals, and reflections on the Word of God.</p>
          <div className="flex flex-col gap-3 mb-6">
            {recentPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group flex items-center gap-4 p-4 rounded-2xl border border-purple-100/50 bg-accent-light hover:bg-accent-mid active:scale-[0.98] transition no-underline text-gray-900">
                {post.cover_image && (
                  <img src={post.cover_image} alt={post.title} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold group-hover:text-accent transition truncate">{post.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 active:scale-[0.98] transition no-underline">
            Read All Articles →
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-gradient-to-b from-accent-light to-accent-mid">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-extrabold mb-4">About RCM</h2>
          <p className="text-gray-600 leading-relaxed max-w-xl mx-auto mb-6">
            Revelation of Christ Ministries exists to open blind eyes and turn people from darkness to light, and from the power of Satan unto God, through the teaching of God's Word and prayer.
          </p>
          <div className="bg-white/80 border-l-[3px] border-accent rounded-r-xl p-4 max-w-md mx-auto text-left">
            <p className="italic text-gray-700 text-[15px] leading-relaxed mb-1">"To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God"</p>
            <span className="text-accent text-sm font-semibold">— Acts 26:18</span>
          </div>
        </div>
      </section>

      {/* Subscribe — Fix #9: real platform links */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Stay Connected</span>
          <h2 className="text-3xl font-extrabold mb-2">Never Miss a Teaching</h2>
          <p className="text-gray-600 mb-8 text-lg">Subscribe on your favourite podcast platform.</p>
          <div className="flex gap-3 justify-center flex-wrap mb-6">
            <a href="https://open.spotify.com/show/4VnpGdSCkRyJr0tgHELfwP" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 bg-[#1DB954]/10 border border-[#1DB954]/20 rounded-2xl no-underline text-gray-900 font-semibold hover:border-[#1DB954]/40 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">
              🎧 Spotify
            </a>
            <a href="https://podcasts.apple.com/podcast/id1772578109" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 bg-purple-50 border border-purple-100 rounded-2xl no-underline text-gray-900 font-semibold hover:border-purple-200 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">
              🎙 Apple Podcasts
            </a>
          </div>
          <p className="text-sm text-gray-400 mb-4">Or listen right here:</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/bible-study" className="flex items-center gap-2 px-5 py-3.5 bg-accent-light border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">📖 Bible Study</Link>
            <Link to="/school-of-prayer" className="flex items-center gap-2 px-5 py-3.5 bg-accent-light border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">🙏 School of Prayer</Link>
            <Link to="/blog" className="flex items-center gap-2 px-5 py-3.5 bg-accent-light border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">✍️ Blog</Link>
          </div>
        </div>
      </section>

      {/* Fix #18 — Scroll to top button */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-20 right-5 z-30 w-10 h-10 bg-accent text-white rounded-full shadow-lg shadow-accent/25 flex items-center justify-center hover:scale-110 active:scale-95 transition animate-slide-up"
          aria-label="Scroll to top">
          ↑
        </button>
      )}
    </div>
  )
}
