export interface Episode {
  title: string
  description: string
  audioUrl: string
  date: string
  duration: string
  image?: string
  episodeNumber?: number
}

export async function fetchRSSFeed(url: string): Promise<Episode[]> {
  // Use a CORS proxy for RSS feeds
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`
  const res = await fetch(proxyUrl)
  const text = await res.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(text, 'text/xml')
  const items = xml.querySelectorAll('item')

  const episodes: Episode[] = []
  items.forEach((item, i) => {
    const enclosure = item.querySelector('enclosure')
    const audioUrl = enclosure?.getAttribute('url') || ''
    if (!audioUrl) return

    const title = item.querySelector('title')?.textContent || 'Untitled'
    const desc = item.querySelector('description')?.textContent || ''
    const pubDate = item.querySelector('pubDate')?.textContent || ''
    const duration =
      item.getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'duration')[0]?.textContent ||
      item.querySelector('duration')?.textContent || ''
    const image =
      item.getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'image')[0]?.getAttribute('href') || ''
    const epNum =
      item.getElementsByTagNameNS('http://www.itunes.com/dtds/podcast-1.0.dtd', 'episode')[0]?.textContent || ''

    episodes.push({
      title,
      description: desc.replace(/<[^>]*>/g, '').slice(0, 200),
      audioUrl,
      date: pubDate ? new Date(pubDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) : '',
      duration: formatDuration(duration),
      image: image || undefined,
      episodeNumber: epNum ? parseInt(epNum) : items.length - i,
    })
  })

  return episodes
}

function formatDuration(d: string): string {
  if (!d) return ''
  // Could be seconds (e.g. "2400") or HH:MM:SS
  if (d.includes(':')) return d
  const secs = parseInt(d)
  if (isNaN(secs)) return d
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
