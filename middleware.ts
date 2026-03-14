import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SITE = 'https://rcm-podcast-react.vercel.app'
const DEFAULT_IMG = 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80'
const CRAWLERS = /facebookexternalhit|WhatsApp|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest/i

const PAGES: Record<string, { title: string; desc: string; img?: string }> = {
  '/': { title: 'Revelation of Christ Ministries', desc: 'Podcast teachings, Bible study, prayer, and articles from RCM.' },
  '/bible-study': { title: 'Christ Revealed Bible Study — RCM', desc: 'Your personal understanding of God\'s Word is pivotal to your relationship with Him.' },
  '/school-of-prayer': { title: 'School of Prayer — RCM', desc: 'A weekly programme where we learn about prayer and we pray.' },
  '/blog': { title: 'Blog — RCM', desc: 'Written teachings, devotionals, and reflections on the Word of God.' },
}

function html(title: string, desc: string, img: string, url: string) {
  return `<!DOCTYPE html><html><head>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="Revelation of Christ Ministries"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(desc)}"/>
<meta property="og:image" content="${esc(img)}"/>
<meta property="og:url" content="${esc(url)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(desc)}"/>
<meta name="twitter:image" content="${esc(img)}"/>
<title>${esc(title)}</title>
</head><body></body></html>`
}

function esc(s: string) { return s.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;') }

export default async function middleware(req: Request) {
  const ua = req.headers.get('user-agent') || ''
  if (!CRAWLERS.test(ua)) return

  const url = new URL(req.url)
  const path = url.pathname

  // Static pages
  const page = PAGES[path]
  if (page) return new Response(html(page.title, page.desc, page.img || DEFAULT_IMG, `${SITE}${path}`), { headers: { 'content-type': 'text/html' } })

  // Blog post: /blog/:slug
  const blogMatch = path.match(/^\/blog\/(.+)$/)
  if (blogMatch) {
    try {
      const supabase = createClient(
        process.env.VITE_SUPABASE_URL || '',
        process.env.VITE_SUPABASE_ANON_KEY || ''
      )
      const { data } = await supabase.from('rcm_blog_posts').select('title,excerpt,cover_image').eq('slug', blogMatch[1]).eq('published', true).single()
      if (data) {
        return new Response(
          html(
            `${data.title} — RCM Blog`,
            data.excerpt || 'Read this article from Revelation of Christ Ministries.',
            data.cover_image || DEFAULT_IMG,
            `${SITE}${path}`
          ),
          { headers: { 'content-type': 'text/html' } }
        )
      }
    } catch {}
    // Fallback for sample posts
    const SAMPLES: Record<string, { title: string; desc: string; img: string }> = {
      'personal-bible-study-habit': { title: 'Why Every Believer Needs a Personal Bible Study Habit', desc: 'Many Christians rely solely on Sunday sermons for spiritual nourishment. But God designed His Word to be a daily bread.', img: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&q=80' },
      'praying-with-understanding': { title: 'The Power of Praying with Understanding', desc: 'Prayer is not a ritual — it is a conversation with the Creator of the universe.', img: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=1200&q=80' },
      'understanding-new-testament': { title: 'Understanding the New Testament: Where to Begin', desc: 'The New Testament can feel overwhelming with its 27 books. But understanding its structure makes navigation simple.', img: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=1200&q=80' },
    }
    const sample = SAMPLES[blogMatch[1]]
    if (sample) return new Response(html(`${sample.title} — RCM Blog`, sample.desc, sample.img, `${SITE}${path}`), { headers: { 'content-type': 'text/html' } })
  }
}

export const config = { matcher: ['/((?!_next|api|static|favicon.ico|assets).*)'] }
