import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav, Footer } from './Layout'
import { Landing } from './Landing'
import { PodcastPage } from './PodcastPage'
import { BlogList, BlogPost } from './Blog'
import { BlogAdmin } from './BlogAdmin'
import { ScrollToTop, PageTitle } from './utils'
import { useAudioPlayer } from './useAudioPlayer'
import { Player } from './Player'

const BIBLE_STUDY_RSS = 'https://anchor.fm/s/7431d14c/podcast/rss'
const PRAYER_RSS = ''

export default function App() {
  const player = useAudioPlayer()

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<><PageTitle title="RCM — Revelation of Christ Ministries" /><Landing /><Footer /></>} />
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
        <Route path="/admin/blog" element={<BlogAdmin />} />
      </Routes>
      {/* Global player — persists across all pages */}
      <Player player={player} />
    </BrowserRouter>
  )
}
