import { useState, useRef, useCallback, useEffect } from 'react'
import { Episode } from './rss'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [current, setCurrent] = useState<Episode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [muted, setMuted] = useState(false)
  const [playbackRate, setPlaybackRate] = useState(1)
  const [buffered, setBuffered] = useState(0)
  const [loading, setLoading] = useState(false)

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const a = new Audio()
      a.addEventListener('timeupdate', () => {
        setCurrentTime(a.currentTime)
        setDuration(a.duration || 0)
        setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
      })
      a.addEventListener('progress', () => {
        if (a.buffered.length > 0) {
          setBuffered((a.buffered.end(a.buffered.length - 1) / (a.duration || 1)) * 100)
        }
      })
      a.addEventListener('ended', () => { setPlaying(false); setProgress(0) })
      a.addEventListener('waiting', () => setLoading(true))
      a.addEventListener('canplay', () => setLoading(false))
      a.addEventListener('playing', () => setLoading(false))
      audioRef.current = a
    }
    return audioRef.current
  }, [])

  const play = useCallback((episode: Episode) => {
    const a = getAudio()
    if (current?.audioUrl === episode.audioUrl) {
      if (playing) { a.pause(); setPlaying(false) }
      else { a.play(); setPlaying(true) }
    } else {
      a.src = episode.audioUrl
      a.playbackRate = playbackRate
      a.volume = muted ? 0 : volume
      a.play()
      setCurrent(episode)
      setPlaying(true)
      setLoading(true)
    }
  }, [current, playing, getAudio, playbackRate, volume, muted])

  const seek = useCallback((pct: number) => {
    const a = audioRef.current
    if (a && a.duration) a.currentTime = (pct / 100) * a.duration
  }, [])

  const skip = useCallback((seconds: number) => {
    const a = audioRef.current
    if (a) a.currentTime = Math.max(0, Math.min(a.duration || 0, a.currentTime + seconds))
  }, [])

  const changeVolume = useCallback((v: number) => {
    setVolume(v)
    setMuted(false)
    if (audioRef.current) audioRef.current.volume = v
  }, [])

  const toggleMute = useCallback(() => {
    const next = !muted
    setMuted(next)
    if (audioRef.current) audioRef.current.volume = next ? 0 : volume
  }, [muted, volume])

  const changeRate = useCallback((rate: number) => {
    setPlaybackRate(rate)
    if (audioRef.current) audioRef.current.playbackRate = rate
  }, [])

  const fmt = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = Math.floor(s % 60)
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return {
    current, playing, progress, currentTime, duration, volume, muted,
    playbackRate, buffered, loading,
    play, seek, skip, changeVolume, toggleMute, changeRate, fmt,
  }
}
