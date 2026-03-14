import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { SAMPLE_POSTS } from './Blog'
import { useAudioPlayer } from './useAudioPlayer'
import { fetchRSSFeed, Episode } from './rss'

const BIBLE_STUDY_RSS = 'https://anchor.fm/s/7431d14c/podcast/rss'

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

function AnimatedNumber({ target, label }: { target: string; label: string }) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className="text-center">
      <div className={`text-3xl sm:text-4xl font-black text-accent transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>{target}</div>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </div>
  )
}

export function Landing({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const [showTop, setShowTop] = useState(false)
  const [latestEp, setLatestEp] = useState<Episode | null>(null)

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fetch latest episode for hero player
  useEffect(() => {
    fetchRSSFeed(BIBLE_STUDY_RSS).then(eps => { if (eps.length) setLatestEp(eps[0]) }).catch(() => {})
  }, [])

  const recentPosts = SAMPLE_POSTS.slice(0, 2)

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-accent/8 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-[100px] right-[-100px] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-8">
            ✝ Revelation of Christ Ministries
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5">
            Grow in the<br />
            <span className="bg-gradient-to-r from-accent via-purple-400 to-amber-500 bg-clip-text text-transparent">Knowledge of Christ</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-8 leading-relaxed">
            Bible study teachings and prayer sessions to help you deepen your relationship with God through His Word and prayer.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-10">
            <Link to="/bible-study" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 active:scale-[0.98] transition no-underline">
              <span className="text-xs">▶</span> Listen to Bible Study
            </Link>
            <Link to="/school-of-prayer" className="inline-flex items-center bg-accent/5 border border-accent/10 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-accent/10 active:scale-[0.98] transition no-underline">
              🙏 School of Prayer
            </Link>
          </div>

          {/* Latest Episode Card — right on the hero */}
          {latestEp && (
            <div className="max-w-lg mx-auto bg-white border border-purple-100/60 rounded-2xl p-4 shadow-xl shadow-accent/5 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-accent mb-2">Latest Episode</p>
              <div className="flex items-center gap-3">
                <button onClick={() => player.play(latestEp)}
                  className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition">
                  {player.current?.audioUrl === latestEp.audioUrl && player.playing ? '⏸' : '▶'}
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold truncate">{latestEp.title}</h3>
                  <p className="text-xs text-gray-500">{latestEp.date} {latestEp.duration && `· ${latestEp.duration}`}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Available On — platform strip */}
      <section className="py-6 border-y border-gray-50">
        <div className="max-w-3xl mx-auto px-5">
          <p className="text-[10px] font-bold uppercase tracking-[2.5px] text-gray-400 text-center mb-4">Available On</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <a href="https://open.spotify.com/show/4VnpGdSCkRyJr0tgHELfwP" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-[#1DB954] transition no-underline">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              <span className="text-sm font-semibold">Spotify</span>
            </a>
            <a href="https://podcasts.apple.com/podcast/id1772578109" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-purple-600 transition no-underline">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.6-.12 1.2-.6 1.5-.48.3-1.14.24-1.56-.18-.3-.3-.42-.66-.36-1.08-.24-1.2-.72-2.22-1.56-3.12-1.26-1.32-2.88-2.04-4.68-1.98-3.6.12-6.24 3.12-5.76 6.6.24 1.68 1.08 3.06 2.46 4.02.36.24.54.6.48 1.02-.06.42-.36.78-.72.96-.48.24-1.02.18-1.44-.18C4.32 15.348 3.36 13.188 3.24 10.788c-.18-3.6 1.68-6.6 4.86-8.04.96-.42 2.04-.66 3.12-.72.22-.02.44-.02.65.54zm-.07 4.2c1.44-.06 2.76.48 3.72 1.5.84.9 1.32 2.04 1.38 3.24.06.72-.36 1.26-.96 1.38-.6.12-1.2-.18-1.44-.78-.06-.18-.06-.36-.06-.54 0-.72-.24-1.38-.72-1.92-.78-.84-2.04-1.08-3.12-.66-1.08.42-1.74 1.38-1.74 2.52 0 .42-.18.84-.54 1.08-.36.24-.78.3-1.14.12-.48-.24-.78-.72-.72-1.26.12-2.16 1.32-3.96 3.3-4.56.6-.18 1.2-.24 1.8-.18l.24.06zm.12 4.32c.84 0 1.56.72 1.56 1.56 0 .6-.36 1.14-.84 1.38v5.52c0 .84-.72 1.56-1.56 1.56-.84 0-1.56-.72-1.56-1.56v-5.4c-.6-.3-.96-.84-.96-1.5 0-.84.72-1.56 1.56-1.56h.24z"/></svg>
              <span className="text-sm font-semibold">Apple Podcasts</span>
            </a>
            <Link to="/bible-study" className="flex items-center gap-2 text-gray-400 hover:text-accent transition no-underline">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              <span className="text-sm font-semibold">Website</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5 grid grid-cols-3 gap-6">
          <AnimatedNumber target="50+" label="Episodes" />
          <AnimatedNumber target="2" label="Programmes" />
          <AnimatedNumber target="Weekly" label="New Teachings" />
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

      {/* About the Host */}
      <section className="py-16 bg-gradient-to-b from-white to-accent-light">
        <div className="max-w-3xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-accent via-purple-600 to-purple-800 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-2xl shadow-accent/20">
              <span className="text-white text-4xl font-black">DO</span>
            </div>
            <div className="text-center sm:text-left">
              <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Your Host</span>
              <h2 className="text-3xl font-extrabold mb-3">Deji Odetayo</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Founder of Revelation of Christ Ministries. Passionate about helping believers understand God's Word and grow in their walk with Christ through systematic Bible study and prayer.
              </p>
              <div className="bg-white/80 border-l-[3px] border-accent rounded-r-xl p-3 text-left inline-block">
                <p className="italic text-gray-700 text-sm leading-relaxed mb-0.5">"To open their eyes, and to turn them from darkness to light"</p>
                <span className="text-accent text-xs font-semibold">— Acts 26:18</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog preview */}
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

      {/* Subscribe — platforms + newsletter */}
      <section className="py-20 bg-gradient-to-b from-accent-light to-accent-mid text-center">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Stay Connected</span>
          <h2 className="text-3xl font-extrabold mb-2">Never Miss a Teaching</h2>
          <p className="text-gray-600 mb-8 text-lg">Subscribe on your favourite podcast platform.</p>
          <div className="flex gap-3 justify-center flex-wrap mb-10">
            <a href="https://open.spotify.com/show/4VnpGdSCkRyJr0tgHELfwP" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-[#1DB954]/20 rounded-2xl no-underline text-gray-900 font-semibold hover:border-[#1DB954]/40 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">
              <svg className="w-5 h-5 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>
              Spotify
            </a>
            <a href="https://podcasts.apple.com/podcast/id1772578109" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3.5 bg-white border border-purple-200 rounded-2xl no-underline text-gray-900 font-semibold hover:border-purple-300 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">
              <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor"><path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0H5.34zm6.525 2.568c2.336 0 4.448.902 6.056 2.587 1.224 1.272 1.912 2.619 2.264 4.392.12.6-.12 1.2-.6 1.5-.48.3-1.14.24-1.56-.18-.3-.3-.42-.66-.36-1.08-.24-1.2-.72-2.22-1.56-3.12-1.26-1.32-2.88-2.04-4.68-1.98-3.6.12-6.24 3.12-5.76 6.6.24 1.68 1.08 3.06 2.46 4.02.36.24.54.6.48 1.02-.06.42-.36.78-.72.96-.48.24-1.02.18-1.44-.18C4.32 15.348 3.36 13.188 3.24 10.788c-.18-3.6 1.68-6.6 4.86-8.04.96-.42 2.04-.66 3.12-.72.22-.02.44-.02.65.54zm-.07 4.2c1.44-.06 2.76.48 3.72 1.5.84.9 1.32 2.04 1.38 3.24.06.72-.36 1.26-.96 1.38-.6.12-1.2-.18-1.44-.78-.06-.18-.06-.36-.06-.54 0-.72-.24-1.38-.72-1.92-.78-.84-2.04-1.08-3.12-.66-1.08.42-1.74 1.38-1.74 2.52 0 .42-.18.84-.54 1.08-.36.24-.78.3-1.14.12-.48-.24-.78-.72-.72-1.26.12-2.16 1.32-3.96 3.3-4.56.6-.18 1.2-.24 1.8-.18l.24.06zm.12 4.32c.84 0 1.56.72 1.56 1.56 0 .6-.36 1.14-.84 1.38v5.52c0 .84-.72 1.56-1.56 1.56-.84 0-1.56-.72-1.56-1.56v-5.4c-.6-.3-.96-.84-.96-1.5 0-.84.72-1.56 1.56-1.56h.24z"/></svg>
              Apple Podcasts
            </a>
          </div>

          {/* Listen on site */}
          <p className="text-sm text-gray-400 mb-4">Or listen right here:</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/bible-study" className="flex items-center gap-2 px-5 py-3.5 bg-white border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">📖 Bible Study</Link>
            <Link to="/school-of-prayer" className="flex items-center gap-2 px-5 py-3.5 bg-white border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">🙏 School of Prayer</Link>
            <Link to="/blog" className="flex items-center gap-2 px-5 py-3.5 bg-white border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 active:scale-[0.98] transition shadow-sm">✍️ Blog</Link>
          </div>
        </div>
      </section>

      {/* Scroll to top */}
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
