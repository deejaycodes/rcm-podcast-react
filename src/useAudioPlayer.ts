import { useState, useRef, useCallback } from 'react'
import { Episode } from './rss'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [current, setCurrent] = useState<Episode | null>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const play = useCallback((episode: Episode) => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
      audioRef.current.addEventListener('timeupdate', () => {
        const a = audioRef.current!
        setCurrentTime(a.currentTime)
        setDuration(a.duration || 0)
        setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
      })
      audioRef.current.addEventListener('ended', () => {
        setPlaying(false)
        setProgress(0)
      })
    }

    if (current?.audioUrl === episode.audioUrl) {
      // Toggle play/pause
      if (playing) {
        audioRef.current.pause()
        setPlaying(false)
      } else {
        audioRef.current.play()
        setPlaying(true)
      }
    } else {
      audioRef.current.src = episode.audioUrl
      audioRef.current.play()
      setCurrent(episode)
      setPlaying(true)
    }
  }, [current, playing])

  const seek = useCallback((pct: number) => {
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (pct / 100) * audioRef.current.duration
    }
  }, [])

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return { current, playing, progress, currentTime, duration, play, seek, formatTime }
}
