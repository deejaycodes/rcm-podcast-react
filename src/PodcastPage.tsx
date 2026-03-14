import { useState, useEffect } from 'react'
import { fetchRSSFeed, Episode } from './rss'
import { useAudioPlayer } from './useAudioPlayer'
import { Player } from './Player'

interface Props {
  title: string
  subtitle: string
  description: string
  rssUrl: string
  accent: string
  icon: string
  verse: { text: string; ref: string }
}

export function PodcastPage({ title, subtitle, description, rssUrl, accent, icon, verse }: Props) {
  const [episodes, setEpisodes] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)
  const player = useAudioPlayer()

  useEffect(() => {
    fetchRSSFeed(rssUrl)
      .then(eps => setEpisodes(eps))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [rssUrl])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative pt-32 pb-16 text-center overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5">
          <div className="text-5xl mb-4">{icon}</div>
          <h1 className="text-4xl sm:text-5xl font-black leading-[1.1] tracking-tight mb-3">
            {title}
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-6 leading-relaxed">{subtitle}</p>
          <div className="bg-accent/5 border-l-[3px] border-accent rounded-r-xl p-4 max-w-md mx-auto text-left">
            <p className="italic text-gray-700 text-sm leading-relaxed mb-1">"{verse.text}"</p>
            <span className="text-accent text-xs font-semibold">— {verse.ref}</span>
          </div>
        </div>
      </section>

      <Player player={player} />

      {/* Episodes */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Episodes</span>
          <h2 className="text-3xl font-extrabold mb-8">Recent Teachings</h2>

          {loading && <p className="text-gray-400 text-sm">Loading episodes...</p>}

          <div className="flex flex-col gap-2">
            {episodes.map((ep, i) => (
              <div key={i} onClick={() => ep.audioUrl && player.openPreview(ep)}
                className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition w-full ${
                  player.current?.audioUrl === ep.audioUrl && player.playing
                    ? 'bg-accent/5 border-accent/20'
                    : 'bg-accent-light border-purple-100/50 hover:bg-accent-mid hover:border-accent/15'
                } ${!ep.audioUrl ? 'opacity-60 cursor-default' : 'cursor-pointer'}`}>
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
                <div onClick={e => { e.stopPropagation(); ep.audioUrl && player.play(ep) }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition ${
                    player.current?.audioUrl === ep.audioUrl && player.playing
                      ? 'bg-accent text-white' : 'bg-accent/10 border border-accent/20 text-accent hover:bg-accent hover:text-white'
                  }`}>
                  {player.current?.audioUrl === ep.audioUrl && player.loading ? '⏳' : player.current?.audioUrl === ep.audioUrl && player.playing ? '⏸' : '▶'}
                </div>
              </div>
            ))}
          </div>

          {!episodes.length && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No episodes yet.</p>
              <p className="text-sm text-gray-300">New teachings coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {player.current && <div className="h-20" />}
    </div>
  )
}
