import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchRSSFeed, Episode } from './rss'
import { useAudioPlayer } from './useAudioPlayer'
import { useMetaTags, shareUrl } from './utils'

interface Props {
  player: ReturnType<typeof useAudioPlayer>
  title: string
  subtitle: string
  rssUrl: string
  icon: string
  podcastName: string
  verse: { text: string; ref: string }
}

export function PodcastPage({ player, title, subtitle, rssUrl, icon, podcastName, verse }: Props) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(!!rssUrl)

  useMetaTags({ title: `${title} — RCM`, description: subtitle })

  useEffect(() => {
    if (!rssUrl) { setLoading(false); return }
    fetchRSSFeed(rssUrl)
      .then(eps => setEpisodes(eps))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [rssUrl])

  const pagePath = rssUrl === '' ? '/school-of-prayer' : '/bible-study'

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="relative pt-32 pb-12 text-center overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5">
          <Link to="/" className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold no-underline hover:underline mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back to Home
          </Link>
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-3">{title}</h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">{subtitle}</p>
          <div className="bg-accent/5 border-l-[3px] border-accent rounded-r-xl p-4 max-w-md mx-auto text-left">
            <p className="italic text-gray-700 text-sm leading-relaxed mb-1">"{verse.text}"</p>
            <span className="text-accent text-xs font-semibold">— {verse.ref}</span>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Episodes</span>
          <h2 className="text-3xl font-extrabold mb-8">Recent Teachings</h2>

          {loading && (
            <div className="animate-pulse flex flex-col gap-2">
              {[1,2,3].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50">
                  <div className="w-10 h-6 bg-gray-100 rounded" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                  <div className="w-11 h-11 bg-gray-100 rounded-full" />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2">
            {episodes.map((ep, i) => (
              <div key={i} onClick={() => ep.audioUrl && player.openPreview(ep)}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition w-full select-none ${
                  player.current?.audioUrl === ep.audioUrl && player.playing
                    ? 'bg-accent/5 border-accent/20'
                    : 'bg-accent-light border-purple-100/50 hover:bg-accent-mid hover:border-accent/15 active:scale-[0.98]'
                } ${!ep.audioUrl ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}>
                {/* Fix #13 — episode number: use RSS episodeNumber or count from bottom (oldest=1) */}
                <span className="text-2xl font-extrabold text-gray-300 w-10 text-center flex-shrink-0 tabular-nums">
                  {String(ep.episodeNumber || i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold mb-0.5">{ep.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 hidden sm:block">{ep.description}</p>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    <span>{ep.date}</span>
                    {ep.duration && <><span>·</span><span>{ep.duration}</span></>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={e => { e.stopPropagation(); shareUrl(window.location.href, `🎧 ${ep.title} — ${podcastName}`) }}
                    className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 active:scale-95 flex items-center justify-center transition text-gray-500" title="Share" aria-label="Share episode">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  </button>
                  <button onClick={e => { e.stopPropagation(); ep.audioUrl && player.play(ep) }}
                    aria-label={player.current?.audioUrl === ep.audioUrl && player.playing ? 'Pause' : 'Play'}
                    className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition active:scale-95 ${
                      player.current?.audioUrl === ep.audioUrl && player.playing
                        ? 'bg-accent text-white' : 'bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white'
                    }`}>
                    {player.current?.audioUrl === ep.audioUrl && player.loading ? '⏳' : player.current?.audioUrl === ep.audioUrl && player.playing ? '⏸' : '▶'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!episodes.length && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No episodes yet.</p>
              <p className="text-sm text-gray-400">New teachings coming soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
