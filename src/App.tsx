import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav, Footer } from './Layout'
import { Landing } from './Landing'
import { PodcastPage } from './PodcastPage'
import { BlogList, BlogPost } from './Blog'
import { CMS } from './CMS'
import { ScrollToTop, PageTitle } from './utils'
import { useAudioPlayer } from './useAudioPlayer'
import { Player } from './Player'
import { Link } from 'react-router-dom'

const BIBLE_STUDY_RSS = 'https://anchor.fm/s/7431d14c/podcast/rss'
const PRAYER_RSS = ''

function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 text-center">
      <span className="text-6xl mb-4">🔍</span>
      <h1 className="text-3xl font-black mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="bg-accent text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition no-underline">← Back to Home</Link>
    </div>
  )
}

export default function App() {
  const player = useAudioPlayer()
  // Derive podcast name from what's currently playing
  const podcastName = player.current?.audioUrl?.includes('7431d14c') ? 'Christ Revealed Bible Study Podcast' : 'School of Prayer — RCM'

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<><PageTitle title="RCM — Revelation of Christ Ministries" /><Landing player={player} /><Footer /></>} />
        <Route path="/bible-study" element={
          <>
            <PodcastPage
              player={player}
              title="Christ Revealed Bible Study"
              subtitle="Your personal understanding of God's Word is pivotal to your relationship with Him."
              rssUrl={BIBLE_STUDY_RSS}
              icon="📖"
              podcastName="Christ Revealed Bible Study Podcast"
              verse={{ text: "To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God", ref: "Acts 26:18" }}
            />
            <Footer />
          </>
        } />
        <Route path="/school-of-prayer" element={
          <>
            <PodcastPage
              player={player}
              title="School of Prayer"
              subtitle="A weekly programme where we learn about prayer and we pray."
              rssUrl={PRAYER_RSS}
              icon="🙏"
              podcastName="School of Prayer — RCM"
              verse={{ text: "Pray without ceasing", ref: "1 Thessalonians 5:17" }}
            />
            <Footer />
          </>
        } />
        <Route path="/blog" element={<><BlogList /><Footer /></>} />
        <Route path="/blog/:slug" element={<><BlogPost /><Footer /></>} />
        <Route path="/admin/blog" element={<CMS />} />
        <Route path="/admin" element={<CMS />} />
        <Route path="*" element={<><PageTitle title="Not Found — RCM" /><NotFound /><Footer /></>} />
      </Routes>
      {/* Mini player spacer — prevents content from being hidden behind fixed player */}
      {player.current && <div className="h-24" />}
      {/* Global player — persists across all pages */}
      <Player player={player} podcastName={podcastName} />
    </BrowserRouter>
  )
}
