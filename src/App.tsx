import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Nav, Footer } from './Layout'
import { Landing } from './Landing'
import { PodcastPage } from './PodcastPage'
import { BlogList, BlogPost } from './Blog'
import { BlogAdmin } from './BlogAdmin'

const BIBLE_STUDY_RSS = 'https://anchor.fm/s/7431d14c/podcast/rss'
// 🔧 Replace with your School of Prayer RSS feed URL once created
const PRAYER_RSS = ''

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<><Landing /><Footer /></>} />
        <Route path="/bible-study" element={
          <>
            <PodcastPage
              title="Christ Revealed Bible Study"
              subtitle="Your personal understanding of God's Word is pivotal to your relationship with Him."
              description="Learn God's Word and grow in your walk with Christ."
              rssUrl={BIBLE_STUDY_RSS}
              accent="purple"
              icon="📖"
              verse={{ text: "To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God", ref: "Acts 26:18" }}
            />
            <Footer />
          </>
        } />
        <Route path="/school-of-prayer" element={
          <>
            <PodcastPage
              title="School of Prayer"
              subtitle="A weekly programme where we learn about prayer and we pray."
              description="Grow your prayer life through teaching and practice."
              rssUrl={PRAYER_RSS}
              accent="amber"
              icon="🙏"
              verse={{ text: "Pray without ceasing", ref: "1 Thessalonians 5:17" }}
            />
            <Footer />
          </>
        } />
        <Route path="/blog" element={<><BlogList /><Footer /></>} />
        <Route path="/blog/:slug" element={<><BlogPost /><Footer /></>} />
        <Route path="/admin/blog" element={<BlogAdmin />} />
      </Routes>
    </BrowserRouter>
  )
}
