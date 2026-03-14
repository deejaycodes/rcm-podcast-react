import { useState } from 'react'
import { useAudioPlayer } from './useAudioPlayer'

const RATES = [0.5, 0.75, 1, 1.25, 1.5, 2]

export function Player({ player }: { player: ReturnType<typeof useAudioPlayer> }) {
  const [expanded, setExpanded] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [showRate, setShowRate] = useState(false)

  if (!player.current) return null

  const ep = player.current

  // Mini player (bottom bar)
  if (!expanded) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-t border-purple-100/60 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] animate-slide-up">
        {/* Progress bar on top of mini player */}
        <div className="h-1 bg-gray-100 cursor-pointer relative overflow-hidden" onClick={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          player.seek(((e.clientX - rect.left) / rect.width) * 100)
        }}>
          <div className="h-full bg-purple-200 absolute left-0 top-0" style={{ width: `${player.buffered}%` }} />
          <div className="h-full bg-accent absolute left-0 top-0 z-10" style={{ width: `${player.progress}%` }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 py-2.5 flex items-center gap-3">
          {/* Art */}
          <div className="w-12 h-12 bg-gradient-to-br from-accent to-purple-700 rounded-xl flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 cursor-pointer" onClick={() => setExpanded(true)}>
            RCM
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(true)}>
            <p className="text-sm font-semibold truncate">{ep.title}</p>
            <p className="text-[11px] text-gray-400">{player.fmt(player.currentTime)} / {player.fmt(player.duration)}</p>
          </div>
          {/* Controls */}
          <button onClick={() => player.skip(-15)} className="w-8 h-8 text-gray-400 hover:text-gray-700 transition hidden sm:flex items-center justify-center text-xs">-15</button>
          <button onClick={() => player.play(ep)} className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-accent/20 text-sm">
            {player.loading ? '⏳' : player.playing ? '⏸' : '▶'}
          </button>
          <button onClick={() => player.skip(30)} className="w-8 h-8 text-gray-400 hover:text-gray-700 transition hidden sm:flex items-center justify-center text-xs">+30</button>
          {/* Expand */}
          <button onClick={() => setExpanded(true)} className="w-8 h-8 text-gray-400 hover:text-gray-700 transition flex items-center justify-center">
            ↑
          </button>
        </div>
      </div>
    )
  }

  // Expanded player (full screen overlay)
  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-gray-700 transition text-sm font-medium flex items-center gap-1">
          ↓ Minimize
        </button>
        <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Now Playing</span>
        <div className="w-20" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-w-lg mx-auto w-full">
        {/* Album Art */}
        <div className="w-64 h-64 sm:w-72 sm:h-72 bg-gradient-to-br from-accent via-purple-600 to-purple-800 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-accent/20">
          <span className="text-white text-4xl font-black tracking-widest">RCM</span>
        </div>

        {/* Title & Meta */}
        <h2 className="text-xl sm:text-2xl font-extrabold text-center mb-1 leading-tight">{ep.title}</h2>
        <p className="text-sm text-gray-400 mb-1">Christ Revealed Bible Study Podcast</p>
        {ep.date && <p className="text-xs text-gray-300 mb-6">{ep.date} {ep.duration && `· ${ep.duration}`}</p>}

        {/* Progress */}
        <div className="w-full mb-2">
          <div className="w-full h-2 bg-gray-100 rounded-full cursor-pointer relative overflow-hidden group" onClick={e => {
            const rect = e.currentTarget.getBoundingClientRect()
            player.seek(((e.clientX - rect.left) / rect.width) * 100)
          }}>
            <div className="h-full bg-gray-200 absolute rounded-full" style={{ width: `${player.buffered}%` }} />
            <div className="h-full bg-accent rounded-full relative z-10 transition-all" style={{ width: `${player.progress}%` }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full shadow-md opacity-0 group-hover:opacity-100 transition" />
            </div>
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[11px] text-gray-400 tabular-nums">{player.fmt(player.currentTime)}</span>
            <span className="text-[11px] text-gray-400 tabular-nums">-{player.fmt(Math.max(0, player.duration - player.currentTime))}</span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <button onClick={() => player.skip(-15)} className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center text-gray-500 text-xs font-bold">
            -15
          </button>
          <button onClick={() => player.play(ep)} className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-xl shadow-accent/25 hover:scale-105 transition text-lg">
            {player.loading ? '⏳' : player.playing ? '⏸' : '▶'}
          </button>
          <button onClick={() => player.skip(30)} className="w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100 transition flex items-center justify-center text-gray-500 text-xs font-bold">
            +30
          </button>
        </div>

        {/* Secondary Controls */}
        <div className="flex items-center justify-center gap-8 relative">
          {/* Speed */}
          <div className="relative">
            <button onClick={() => { setShowRate(!showRate); setShowVolume(false) }} className="text-xs font-bold text-gray-400 hover:text-gray-700 transition px-2 py-1 rounded-lg hover:bg-gray-50">
              {player.playbackRate}x
            </button>
            {showRate && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white border border-gray-100 rounded-xl shadow-lg p-1.5 flex flex-col gap-0.5 min-w-[60px]">
                {RATES.map(r => (
                  <button key={r} onClick={() => { player.changeRate(r); setShowRate(false) }}
                    className={`text-xs px-3 py-1.5 rounded-lg transition ${player.playbackRate === r ? 'bg-accent text-white' : 'hover:bg-gray-50 text-gray-600'}`}>
                    {r}x
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume */}
          <div className="relative flex items-center gap-2">
            <button onClick={() => { player.toggleMute(); }} className="text-gray-400 hover:text-gray-700 transition text-sm">
              {player.muted || player.volume === 0 ? '🔇' : player.volume < 0.5 ? '🔉' : '🔊'}
            </button>
            <div className="hidden sm:block">
              <input type="range" min="0" max="1" step="0.01" value={player.muted ? 0 : player.volume}
                onChange={e => player.changeVolume(parseFloat(e.target.value))}
                className="w-24 h-1 accent-accent cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {ep.description && (
        <div className="px-6 pb-6 max-w-lg mx-auto w-full">
          <p className="text-xs text-gray-400 leading-relaxed text-center">{ep.description}</p>
        </div>
      )}
    </div>
  )
}
