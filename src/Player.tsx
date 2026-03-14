import { useState } from 'react'
import { useAudioPlayer } from './useAudioPlayer'

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function Player({ player, podcastName = 'Christ Revealed Bible Study Podcast' }: { player: ReturnType<typeof useAudioPlayer>; podcastName?: string }) {
  const [expanded, setExpanded] = useState(false)
  const [showRate, setShowRate] = useState(false)

  const isPreview = !!player.preview && player.current?.audioUrl !== player.preview.audioUrl
  const ep = isPreview ? player.preview : player.current

  if (!ep) return null

  // Preview mode
  if (isPreview) {
    return (
      <div className="fixed inset-0 z-50 bg-white flex flex-col animate-slide-up">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <button onClick={() => player.closePreview()} className="text-gray-700 hover:text-accent transition text-sm font-semibold flex items-center gap-1">↓ Close</button>
          <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Episode Details</span>
          <div className="w-20" />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center px-6 pt-8 max-w-lg mx-auto w-full">
            <div className="w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-br from-accent via-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-accent/20 flex-shrink-0">
              <span className="text-white text-3xl font-black tracking-widest">RCM</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-center mb-1 leading-tight">{ep.title}</h2>
            <p className="text-sm text-gray-600 mb-1">{podcastName}</p>
            {ep.date && <p className="text-xs text-gray-500 mb-6">{ep.date} {ep.duration && `· ${ep.duration}`}</p>}
            {ep.audioUrl && (
              <button onClick={() => { player.play(ep); setExpanded(true) }} className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/25 hover:scale-105 transition text-lg mb-6 flex-shrink-0">▶</button>
            )}
            {ep.description && (
              <div className="w-full pb-16">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Episode Description</p>
                <p className="text-sm text-gray-600 leading-relaxed">{ep.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Mini player
  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-purple-100/60 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] animate-slide-up">
        <div className="h-1 bg-gray-100 cursor-pointer relative overflow-hidden"
          onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            player.seek(((e.clientX - rect.left) / rect.width) * 100)
          }}
          onTouchMove={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            player.seek(Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100)))
          }}
        >
          <div className="h-full bg-purple-200 absolute left-0 top-0 pointer-events-none" style={{ width: `${player.buffered}%` }} />
          <div className="h-full bg-accent absolute left-0 top-0 z-10 pointer-events-none" style={{ width: `${player.progress}%` }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-purple-700 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 cursor-pointer" onClick={() => setExpanded(true)}>RCM</div>
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(true)}>
            <p className="text-sm font-semibold truncate">{ep.title}</p>
            <p className="text-[11px] text-gray-400">{player.fmt(player.currentTime)} / {player.fmt(player.duration)}</p>
          </div>
          <button onClick={() => player.skip(-15)} className="w-8 h-8 text-gray-400 hover:text-gray-700 transition hidden sm:flex items-center justify-center text-xs">-15</button>
          <button onClick={() => player.play(ep)} className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20 text-sm">
            {player.loading ? '⏳' : player.playing ? '⏸' : '▶'}
          </button>
          <button onClick={() => player.skip(30)} className="w-8 h-8 text-gray-400 hover:text-gray-700 transition hidden sm:flex items-center justify-center text-xs">+30</button>
          <button onClick={() => setExpanded(true)} className="w-8 h-8 text-accent hover:text-purple-800 transition flex items-center justify-center text-lg font-bold">↑</button>
          <button onClick={() => player.stop()} className="w-8 h-8 text-gray-400 hover:text-gray-700 transition flex items-center justify-center text-xs">✕</button>
        </div>
      </div>
    )
  }

  // Expanded now-playing
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button onClick={() => setExpanded(false)} className="text-gray-700 hover:text-accent transition text-sm font-semibold flex items-center gap-1">↓ Minimize</button>
        <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Now Playing</span>
        <div className="w-20" />
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-6 pt-6 max-w-lg mx-auto w-full">
          <div className="w-56 h-56 sm:w-64 sm:h-64 bg-gradient-to-br from-accent via-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-accent/20 flex-shrink-0">
            <span className="text-white text-3xl font-black tracking-widest">RCM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-center mb-1 leading-tight">{ep.title}</h2>
          <p className="text-sm text-gray-600 mb-1">{podcastName}</p>
          {ep.date && <p className="text-xs text-gray-500 mb-5">{ep.date} {ep.duration && `· ${ep.duration}`}</p>}
          <div className="w-full mb-2">
            <div className="w-full h-2 bg-gray-100 rounded-full cursor-pointer relative overflow-hidden"
              onClick={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                player.seek(((e.clientX - rect.left) / rect.width) * 100)
              }}
              onMouseDown={e => {
                const bar = e.currentTarget
                const move = (ev: MouseEvent) => {
                  const rect = bar.getBoundingClientRect()
                  player.seek(Math.max(0, Math.min(100, ((ev.clientX - rect.left) / rect.width) * 100)))
                }
                const up = () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseup', up) }
                window.addEventListener('mousemove', move)
                window.addEventListener('mouseup', up)
              }}
              onTouchMove={e => {
                const rect = e.currentTarget.getBoundingClientRect()
                const touch = e.touches[0]
                player.seek(Math.max(0, Math.min(100, ((touch.clientX - rect.left) / rect.width) * 100)))
              }}
            >
              <div className="h-full bg-gray-200 absolute rounded-full pointer-events-none" style={{ width: `${player.buffered}%` }} />
              <div className="h-full bg-accent rounded-full relative z-10 pointer-events-none" style={{ width: `${player.progress}%` }} />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[11px] text-gray-500 tabular-nums">{player.fmt(player.currentTime)}</span>
              <span className="text-[11px] text-gray-500 tabular-nums">-{player.fmt(Math.max(0, player.duration - player.currentTime))}</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-6 mb-5">
            <button onClick={() => player.skip(-15)} className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center text-gray-500 text-xs font-bold">-15</button>
            <button onClick={() => player.play(ep)} className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/25 hover:scale-105 transition text-lg">
              {player.loading ? '⏳' : player.playing ? '⏸' : '▶'}
            </button>
            <button onClick={() => player.skip(30)} className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center text-gray-500 text-xs font-bold">+30</button>
          </div>
          <div className="flex items-center justify-center gap-8 relative mb-6">
            <div className="relative">
              <button onClick={() => setShowRate(!showRate)} className="text-xs font-bold text-gray-500 hover:text-gray-700 transition px-2 py-1 rounded-lg hover:bg-gray-50">{player.playbackRate}x</button>
              {showRate && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-gray-100 rounded-xl shadow-lg p-1.5 flex flex-col gap-0.5 min-w-[60px]">
                  {RATES.map(r => (
                    <button key={r} onClick={() => { player.changeRate(r); setShowRate(false) }}
                      className={`text-xs px-3 py-1.5 rounded-lg transition ${player.playbackRate === r ? 'bg-accent text-white' : 'hover:bg-gray-50 text-gray-600'}`}>{r}x</button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative flex items-center gap-2">
              <button onClick={() => player.toggleMute()} className="text-gray-500 hover:text-gray-700 transition text-sm">
                {player.muted || player.volume === 0 ? '🔇' : player.volume < 0.5 ? '🔉' : '🔊'}
              </button>
              <div className="hidden sm:block">
                <input type="range" min="0" max="1" step="0.01" value={player.muted ? 0 : player.volume}
                  onChange={e => player.changeVolume(parseFloat(e.target.value))} className="w-24 h-1 accent-accent cursor-pointer" />
              </div>
            </div>
          </div>
          {ep.description && (
            <div className="w-full pb-16">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Episode Description</p>
              <p className="text-sm text-gray-600 leading-relaxed">{ep.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
