import { useState, useEffect } from 'react'
import { fetchRSSFeed, Episode } from './rss'
import { useAudioPlayer } from './useAudioPlayer'

// 🔧 RSS FEED
const RSS_URL = 'https://anchor.fm/s/7431d14c/podcast/rss'

const SAMPLE_EPISODES: Episode[] = [
  { title: 'The Finished Work of Christ in Redemption', description: 'Understanding the completeness of what Christ accomplished on the cross and its significance in our daily lives.', audioUrl: '', date: '10 Mar 2026', duration: '45:00', episodeNumber: 12 },
  { title: 'Walking in the Light of Revelation', description: 'How the revelation of Christ transforms our understanding and empowers us to walk in newness of life.', audioUrl: '', date: '3 Mar 2026', duration: '38:00', episodeNumber: 11 },
  { title: 'The New Testament Ministry', description: 'Exploring the practices clearly stated in the epistles and embraced as doctrines by all the Apostles of Christ.', audioUrl: '', date: '24 Feb 2026', duration: '52:00', episodeNumber: 10 },
  { title: 'Opening Blind Eyes — Acts 26:18', description: 'To open their eyes and turn them from darkness to light, and from the power of Satan to God.', audioUrl: '', date: '17 Feb 2026', duration: '41:00', episodeNumber: 9 },
  { title: 'The Significance of Redemption in Daily Life', description: 'The material and eternal significance of Christ\'s redemptive work in the lives of men.', audioUrl: '', date: '10 Feb 2026', duration: '36:00', episodeNumber: 8 },
  { title: 'A World Illuminated by the Knowledge of Jesus', description: 'Envisioning a world, a person at a time, transformed by the revelation of Jesus Christ.', audioUrl: '', date: '3 Feb 2026', duration: '44:00', episodeNumber: 7 },
]

export default function App() {
  const [episodes, setEpisodes] = useState<Episode[]>(SAMPLE_EPISODES)
  const [loading, setLoading] = useState(false)
  const player = useAudioPlayer()

  useEffect(() => {
    if (!RSS_URL) return
    setLoading(true)
    fetchRSSFeed(RSS_URL)
      .then(eps => { if (eps.length) setEpisodes(eps) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl border-b border-purple-100/50">
        <div className="max-w-3xl mx-auto px-5 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 no-underline text-gray-900">
            <span className="w-9 h-9 bg-accent rounded-[10px] flex items-center justify-center text-white text-sm">✝</span>
            <span className="font-extrabold text-lg">RCM <span className="font-normal text-gray-400">Podcast</span></span>
          </a>
          <div className="flex items-center gap-5">
            <a href="#episodes" className="hidden sm:inline text-sm text-gray-500 hover:text-gray-900 transition">Episodes</a>
            <a href="#about" className="hidden sm:inline text-sm text-gray-500 hover:text-gray-900 transition">About</a>
            <a href="#subscribe" className="text-sm font-semibold bg-accent text-white px-4 py-2 rounded-full hover:bg-accent/90 transition">Subscribe</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-40 pb-20 text-center overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-8">
            🎙️ New episodes weekly
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5">
            Christ Revealed<br />
            <span className="bg-gradient-to-r from-accent via-purple-400 to-amber-500 bg-clip-text text-transparent">Bible Study Podcast</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
            Your personal understanding of God's Word is pivotal to your relationship with Him. Join us to learn God's Word and grow in your walk with Christ.
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-10">
            <a href="#episodes" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition">
              <span className="text-xs">▶</span> Listen Now
            </a>
            <a href="#subscribe" className="inline-flex items-center bg-accent/5 border border-accent/10 text-gray-700 px-6 py-3 rounded-full font-semibold hover:bg-accent/10 transition">
              Subscribe Free
            </a>
          </div>
          <div className="text-center">
            <span className="text-[11px] text-gray-400 uppercase tracking-[2px] font-semibold block mb-2">Available on</span>
            <div className="flex gap-2 justify-center flex-wrap">
              {['🎵 Spotify', '🍎 Apple Podcasts', '📺 YouTube', '🎧 Google Podcasts'].map(p => (
                <a key={p} href="#" className="px-3 py-1.5 bg-accent-light border border-accent/10 rounded-full text-xs text-gray-500 hover:text-gray-700 hover:bg-accent-mid transition no-underline">{p}</a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Now Playing Bar */}
      {player.current && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-purple-100/50 px-5 py-3">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <button onClick={() => player.play(player.current!)} className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20">
              {player.playing ? '⏸' : '▶'}
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{player.current.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 h-1 bg-gray-100 rounded-full cursor-pointer overflow-hidden" onClick={e => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  player.seek(((e.clientX - rect.left) / rect.width) * 100)
                }}>
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${player.progress}%` }} />
                </div>
                <span className="text-[11px] text-gray-400 tabular-nums flex-shrink-0">
                  {player.formatTime(player.currentTime)} / {player.formatTime(player.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Episodes */}
      <section id="episodes" className="py-20">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Episodes</span>
          <h2 className="text-3xl font-extrabold mb-8">Recent Teachings</h2>

          {loading && <p className="text-gray-400 text-sm">Loading episodes from RSS feed...</p>}

          <div className="flex flex-col gap-2">
            {episodes.map((ep, i) => (
              <button
                key={i}
                onClick={() => ep.audioUrl && player.play(ep)}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition w-full ${
                  player.current?.audioUrl === ep.audioUrl && player.playing
                    ? 'bg-accent/5 border-accent/20'
                    : 'bg-accent-light border-purple-100/50 hover:bg-accent-mid hover:border-accent/15'
                } ${!ep.audioUrl ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}
              >
                <span className="text-2xl font-extrabold text-gray-300 w-10 text-center flex-shrink-0 tabular-nums">
                  {String(ep.episodeNumber || episodes.length - i).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold mb-0.5">{ep.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 hidden sm:block">{ep.description}</p>
                  <div className="flex gap-2 text-xs text-gray-400 mt-1">
                    <span>{ep.date}</span>
                    {ep.duration && <><span>·</span><span>{ep.duration}</span></>}
                  </div>
                </div>
                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                  player.current?.audioUrl === ep.audioUrl && player.playing
                    ? 'bg-accent text-white'
                    : 'bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white'
                }`}>
                  {player.current?.audioUrl === ep.audioUrl && player.playing ? '⏸' : '▶'}
                </div>
              </button>
            ))}
          </div>

          {!episodes.length && !loading && (
            <p className="text-center text-sm text-gray-400 mt-6">No episodes found.</p>
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20">
        <div className="max-w-3xl mx-auto px-5 grid md:grid-cols-2 gap-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">About the Podcast</span>
            <h2 className="text-3xl font-extrabold mb-4">Christ Revealed Bible Study</h2>
            <p className="text-gray-500 leading-relaxed mb-3">Your personal understanding of God's Word is pivotal to your relationship with Him and living the kind of life that He wants you to live.</p>
            <p className="text-gray-500 leading-relaxed mb-5">Many believers struggle with reading, studying and comprehending the Bible. Join us on this podcast to learn God's Word. If you feel you need to have a better relationship with God through His Word, then this podcast is for you.</p>
            <div className="bg-accent/5 border-l-[3px] border-accent rounded-r-xl p-4">
              <p className="italic text-gray-700 text-[15px] leading-relaxed mb-1">"To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God"</p>
              <span className="text-accent text-sm font-semibold">— Acts 26:18</span>
            </div>
          </div>
          <div className="bg-white border border-purple-100/50 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-3 border-b border-purple-100/50">
              {[
                { n: '4+', l: 'Episodes' },
                { n: 'Weekly', l: 'New Teachings' },
                { n: 'Free', l: 'Always' },
              ].map((s, i) => (
                <div key={i} className="p-5 text-center border-r border-purple-100/50 last:border-r-0">
                  <div className="text-xl font-extrabold text-accent">{s.n}</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="p-5">
              <h4 className="text-[11px] font-semibold uppercase tracking-[2px] text-gray-400 mb-3">Our Channels</h4>
              <div className="flex flex-wrap gap-1.5">
                {['Church Ministry', 'Campus Fellowships', 'Camp Meetings', 'Bible School', 'Social Media', 'Publications'].map(c => (
                  <span key={c} className="px-3 py-1.5 bg-accent-light rounded-full text-xs text-gray-500">{c}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section id="subscribe" className="py-24 bg-gradient-to-b from-accent-light to-accent-mid text-center">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Never Miss an Episode</span>
          <h2 className="text-3xl font-extrabold mb-2">Subscribe to the Podcast</h2>
          <p className="text-gray-500 mb-8 text-lg">Get notified when new teachings drop. Available on all major platforms.</p>
          <div className="flex gap-3 justify-center flex-wrap mb-10">
            {[
              { icon: '🎵', name: 'Spotify' },
              { icon: '🍎', name: 'Apple Podcasts' },
              { icon: '📺', name: 'YouTube' },
              { icon: '🎧', name: 'Google Podcasts' },
            ].map(p => (
              <a key={p.name} href="#" className="flex items-center gap-2 px-5 py-3.5 bg-white border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 transition shadow-sm">
                <span className="text-xl">{p.icon}</span> {p.name}
              </a>
            ))}
          </div>
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-400 mb-2">Or get episodes straight to your inbox:</p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input type="email" placeholder="your@email.com" required className="flex-1 px-5 py-3 border border-gray-200 rounded-full text-sm outline-none focus:border-accent bg-white" />
              <button type="submit" className="bg-accent text-white px-5 py-3 rounded-full font-semibold text-sm hover:bg-accent/90 transition">Subscribe</button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-100/50 py-8">
        <div className="max-w-3xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white text-xs">✝</span>
            <div>
              <strong className="text-sm block">Christ Revealed Bible Study</strong>
              <span className="text-xs text-gray-400">Revelation of Christ Ministries · Deji Odetayo</span>
            </div>
          </div>
          <div className="flex gap-5">
            {['Episodes', 'About', 'Subscribe'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="text-sm text-gray-400 hover:text-gray-700 transition no-underline">{l}</a>
            ))}
          </div>
          <span className="text-xs text-gray-400">© 2026 RCM</span>
        </div>
      </footer>

      {/* Bottom padding when player is showing */}
      {player.current && <div className="h-20" />}
    </div>
  )
}
