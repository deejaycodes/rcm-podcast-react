import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type BlogPost as BlogPostType } from './supabase'
import { useMetaTags, ShareButton } from './utils'

export const SAMPLE_POSTS: BlogPostType[] = [
  {
    id: 'sample-1',
    title: 'Why Every Believer Needs a Personal Bible Study Habit',
    slug: 'personal-bible-study-habit',
    excerpt: 'Many Christians rely solely on Sunday sermons for spiritual nourishment. But God designed His Word to be a daily bread — something you engage with personally, consistently, and intentionally.',
    content: `<p>Many Christians rely solely on Sunday sermons for spiritual nourishment. But God designed His Word to be a daily bread — something you engage with personally, consistently, and intentionally.</p>
<h2>The Problem with Secondhand Knowledge</h2>
<p>When we only hear the Word through others, we build our faith on someone else's revelation. While pastors and teachers are gifts to the body of Christ, they were never meant to replace your personal encounter with Scripture.</p>
<p>Paul commended the Bereans because they "searched the scriptures daily" to verify what they were taught (Acts 17:11). They didn't just accept — they investigated.</p>
<h2>How to Start</h2>
<p>You don't need a theology degree. Start with 10 minutes a day. Pick a book — the Gospel of John is a great starting point. Read slowly. Ask questions. Write down what stands out.</p>
<blockquote>Your personal understanding of God's Word is pivotal to your relationship with Him and living the kind of life that He wants you to live.</blockquote>
<p>The goal isn't to finish chapters — it's to let the Word finish its work in you.</p>
<h2>A Practical Framework</h2>
<p>Try the <strong>SOAP method</strong>: Scripture (read it), Observation (what do you notice?), Application (how does this apply to your life?), Prayer (talk to God about it).</p>
<p>This simple framework transforms passive reading into active engagement with the living Word of God.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&q=80',
    published: true,
    created_at: '2026-03-10T08:00:00Z',
    updated_at: '2026-03-10T08:00:00Z',
  },
  {
    id: 'sample-2',
    title: 'The Power of Praying with Understanding',
    slug: 'praying-with-understanding',
    excerpt: 'Prayer is not a ritual — it is a conversation with the Creator of the universe. Yet many believers struggle with prayer because they approach it without understanding what it truly is.',
    content: `<p>Prayer is not a ritual — it is a conversation with the Creator of the universe. Yet many believers struggle with prayer because they approach it without understanding what it truly is.</p>
<h2>What Prayer Is Not</h2>
<p>Prayer is not a performance. It's not about eloquent words or lengthy sessions. Jesus warned against "vain repetitions" (Matthew 6:7). God is not impressed by volume — He responds to faith and sincerity.</p>
<h2>What Prayer Actually Is</h2>
<p>Prayer is communion. It's the place where your spirit connects with God's Spirit. It's where you bring your burdens, your questions, your gratitude, and your worship.</p>
<blockquote>Pray without ceasing. — 1 Thessalonians 5:17</blockquote>
<p>This doesn't mean you walk around with your eyes closed all day. It means maintaining an awareness of God's presence in everything you do.</p>
<h2>Practical Steps</h2>
<p>Start your prayer with thanksgiving. Then bring your requests. Then listen. Yes — prayer is a two-way conversation. Give God room to speak back to you through His Word and His Spirit.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&q=80',
    published: true,
    created_at: '2026-03-05T08:00:00Z',
    updated_at: '2026-03-05T08:00:00Z',
  },
  {
    id: 'sample-3',
    title: 'Understanding the New Testament: Where to Begin',
    slug: 'understanding-new-testament',
    excerpt: 'The New Testament can feel overwhelming with its 27 books. But understanding its structure makes navigation simple and transforms how you read it.',
    content: `<p>The New Testament can feel overwhelming with its 27 books. But understanding its structure makes navigation simple and transforms how you read it.</p>
<h2>The Four Sections</h2>
<p>The New Testament is organized into four clear sections: the <strong>Gospels</strong> (Matthew–John), <strong>History</strong> (Acts), the <strong>Epistles</strong> (Romans–Jude), and <strong>Prophecy</strong> (Revelation).</p>
<p>Each section serves a unique purpose in revealing Christ and building up the believer.</p>
<h2>Start with the Gospels</h2>
<p>The Gospel of John is the best starting point for new believers. It was written specifically "that you may believe that Jesus is the Christ, the Son of God" (John 20:31).</p>
<h2>Then Move to the Epistles</h2>
<p>The epistles are letters written to churches and individuals. They contain the practical theology of the Christian life. Romans, Ephesians, and Philippians are excellent starting points.</p>
<blockquote>To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God. — Acts 26:18</blockquote>
<p>The entire New Testament points to one person: Jesus Christ. When you read with that lens, everything comes alive.</p>`,
    cover_image: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?w=800&q=80',
    published: true,
    created_at: '2026-02-28T08:00:00Z',
    updated_at: '2026-02-28T08:00:00Z',
  },
]

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })
}

function readTime(content: string) {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="rounded-2xl bg-gray-100 h-56 mb-8" />
      <div className="flex flex-col gap-4">
        <div className="flex gap-5 p-5 rounded-2xl bg-gray-50">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl flex-shrink-0" />
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="h-3 bg-gray-100 rounded w-24" />
            <div className="h-5 bg-gray-100 rounded w-3/4" />
            <div className="h-3 bg-gray-100 rounded w-full hidden sm:block" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function BlogList() {
  const [posts, setPosts] = useState<BlogPostType[]>(SAMPLE_POSTS)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('rcm_blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data && data.length) setPosts(data); setLoading(false) })
  }, [])

  const featured = posts[0]
  const rest = posts.slice(1)

  useMetaTags({ title: 'Blog — RCM', description: 'Written teachings, devotionals, and reflections on the Word of God from Revelation of Christ Ministries.' })

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Blog</span>
          <h1 className="text-4xl font-black mb-2">Articles & Reflections</h1>
          <p className="text-gray-600 mb-10">Written teachings, devotionals, and reflections on the Word of God.</p>

          {loading && <Skeleton />}

          {/* Featured post */}
          {!loading && featured && (
            <Link to={`/blog/${featured.slug}`} className="block mb-8 group no-underline text-gray-900">
              <div className="rounded-2xl border border-purple-100/50 overflow-hidden bg-accent-light hover:bg-accent-mid transition">
                {featured.cover_image ? (
                  <img src={featured.cover_image} alt={featured.title} className="w-full h-56 sm:h-64 object-cover" />
                ) : (
                  <div className="w-full h-48 sm:h-56 bg-gradient-to-br from-accent/10 via-purple-100/30 to-accent-mid flex items-center justify-center">
                    <span className="text-6xl opacity-30">✍️</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-accent bg-accent/10 px-2.5 py-1 rounded-full">Featured</span>
                    <span className="text-xs text-gray-500">{formatDate(featured.created_at)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-500">{readTime(featured.content)}</span>
                  </div>
                  <h2 className="text-2xl font-extrabold mb-2 group-hover:text-accent transition">{featured.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{featured.excerpt}</p>
                </div>
              </div>
            </Link>
          )}

          {/* Rest of posts */}
          {!loading && (
            <div className="flex flex-col gap-4">
              {rest.map(post => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex gap-5 p-5 rounded-2xl border border-purple-100/50 bg-accent-light hover:bg-accent-mid hover:border-accent/15 transition no-underline text-gray-900">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl flex-shrink-0" />
                  ) : (
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-accent/10 to-accent-mid rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-3xl opacity-30">✍️</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-500">{readTime(post.content)}</span>
                    </div>
                    <h3 className="text-lg font-extrabold mb-1 group-hover:text-accent transition leading-snug">{post.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 hidden sm:block">{post.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {!posts.length && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No posts yet.</p>
              <p className="text-sm text-gray-400">Articles coming soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export function BlogPost() {
  const slug = window.location.pathname.split('/blog/')[1]
  const [post, setPost] = useState<BlogPostType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const sample = SAMPLE_POSTS.find(p => p.slug === slug)
    if (sample) { setPost(sample); setLoading(false); return }
    supabase.from('rcm_blog_posts').select('*').eq('slug', slug).eq('published', true).single()
      .then(({ data }) => { if (data) setPost(data); setLoading(false) })
  }, [slug])

  useMetaTags({
    title: post ? `${post.title} — RCM Blog` : 'Blog — RCM',
    description: post?.excerpt || 'Read articles from Revelation of Christ Ministries.',
    image: post?.cover_image || undefined,
  })

  if (loading) return (
    <div className="min-h-screen bg-white pt-28">
      <div className="max-w-2xl mx-auto px-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-24 mb-8" />
        <div className="h-64 bg-gray-100 rounded-2xl mb-8" />
        <div className="h-8 bg-gray-100 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-8" />
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded" />
          <div className="h-4 bg-gray-100 rounded w-5/6" />
          <div className="h-4 bg-gray-100 rounded w-4/5" />
        </div>
      </div>
    </div>
  )

  if (!post) return (
    <div className="min-h-screen bg-white pt-32 text-center px-5">
      <span className="text-5xl block mb-4">🔍</span>
      <p className="text-gray-600 font-semibold mb-2">Post not found</p>
      <p className="text-gray-400 text-sm mb-6">This article may have been removed or the link is incorrect.</p>
      <Link to="/blog" className="bg-accent text-white px-5 py-2.5 rounded-full font-semibold text-sm no-underline hover:-translate-y-0.5 transition">← Back to Blog</Link>
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <article className="pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-5">
          {/* Back nav — prominent on mobile */}
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-accent text-sm font-semibold no-underline hover:underline mb-8 py-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
            Back to Blog
          </Link>

          {/* Cover */}
          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8" />
          )}

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-3">{post.title}</h1>
            <div className="flex items-center gap-3 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-xs font-bold">DO</div>
                <span className="font-medium text-gray-700">Deji Odetayo</span>
              </div>
              <span>·</span>
              <span>{formatDate(post.created_at)}</span>
              <span>·</span>
              <span>{readTime(post.content)}</span>
              <span>·</span>
              <ShareButton url={`https://rcm-podcast-react.vercel.app/blog/${post.slug}`} title={post.title} />
            </div>
          </div>

          <div className="h-px bg-gray-100 mb-8" />

          {/* Content */}
          <div className="
            [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-gray-900
            [&_h3]:text-lg [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-2
            [&_p]:text-gray-700 [&_p]:leading-[1.8] [&_p]:mb-5 [&_p]:text-[16px]
            [&_a]:text-accent [&_a]:underline
            [&_strong]:text-gray-900 [&_strong]:font-semibold
            [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:pl-5 [&_blockquote]:py-2 [&_blockquote]:my-8 [&_blockquote]:bg-accent/5 [&_blockquote]:rounded-r-xl [&_blockquote_p]:italic [&_blockquote_p]:text-gray-600 [&_blockquote_p]:mb-0
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul_li]:text-gray-700 [&_ul_li]:mb-2 [&_ul_li]:leading-relaxed
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol_li]:text-gray-700 [&_ol_li]:mb-2 [&_ol_li]:leading-relaxed
          " dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="h-px bg-gray-100 mt-10 mb-8" />

          {/* Author card */}
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-accent-light border border-purple-100/50">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">DO</div>
            <div>
              <p className="font-extrabold mb-0.5">Deji Odetayo</p>
              <p className="text-sm text-gray-600 leading-relaxed">Founder of Revelation of Christ Ministries. Passionate about helping believers understand God's Word and grow in their walk with Christ.</p>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link to="/blog" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition no-underline">
              ← More Articles
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
