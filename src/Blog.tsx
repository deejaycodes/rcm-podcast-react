import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase, type BlogPost as BlogPostType } from './supabase'

export function BlogList() {
  const [posts, setPosts] = useState<BlogPostType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('published', true).order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPosts(data); setLoading(false) })
  }, [])

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <section className="pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Blog</span>
          <h1 className="text-4xl font-black mb-2">Articles & Reflections</h1>
          <p className="text-gray-500 mb-10">Written teachings, devotionals, and reflections on the Word of God.</p>

          {loading && <p className="text-gray-400 text-sm">Loading posts...</p>}

          <div className="flex flex-col gap-4">
            {posts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="block p-5 rounded-2xl border border-purple-100/50 bg-accent-light hover:bg-accent-mid hover:border-accent/15 transition no-underline text-gray-900">
                {post.cover_image && <img src={post.cover_image} alt="" className="w-full h-48 object-cover rounded-xl mb-4" />}
                <h2 className="text-xl font-extrabold mb-1">{post.title}</h2>
                <p className="text-sm text-gray-400 mb-2">{new Date(post.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{post.excerpt}</p>
              </Link>
            ))}
          </div>

          {!posts.length && !loading && (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">No posts yet.</p>
              <p className="text-sm text-gray-300">Articles coming soon!</p>
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
    supabase.from('blog_posts').select('*').eq('slug', slug).eq('published', true).single()
      .then(({ data }) => { if (data) setPost(data); setLoading(false) })
  }, [slug])

  if (loading) return <div className="min-h-screen bg-white pt-32 text-center text-gray-400">Loading...</div>
  if (!post) return <div className="min-h-screen bg-white pt-32 text-center"><p className="text-gray-400">Post not found.</p><Link to="/blog" className="text-accent text-sm">← Back to blog</Link></div>

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <article className="pt-32 pb-16">
        <div className="max-w-2xl mx-auto px-5">
          <Link to="/blog" className="text-accent text-sm font-medium no-underline hover:underline mb-6 block">← Back to blog</Link>
          {post.cover_image && <img src={post.cover_image} alt="" className="w-full h-64 object-cover rounded-2xl mb-6" />}
          <h1 className="text-3xl sm:text-4xl font-black mb-2 leading-tight">{post.title}</h1>
          <p className="text-sm text-gray-400 mb-8">{new Date(post.created_at).toLocaleDateString('en-NG', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <div className="prose prose-gray max-w-none [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-accent [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500"
            dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  )
}
