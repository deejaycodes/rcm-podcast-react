import { Link } from 'react-router-dom'

const programs = [
  {
    icon: '📖',
    title: 'Bible Study',
    subtitle: 'Christ Revealed Bible Study Podcast',
    desc: 'Your personal understanding of God\'s Word is pivotal to your relationship with Him. Learn God\'s Word and grow in your walk with Christ.',
    link: '/bible-study',
    color: 'from-accent to-purple-700',
  },
  {
    icon: '🙏',
    title: 'School of Prayer',
    subtitle: 'Learning to Pray Effectively',
    desc: 'A weekly programme where we learn about prayer and we pray. Grow your prayer life through teaching and practice.',
    link: '/school-of-prayer',
    color: 'from-amber-500 to-orange-600',
  },
]

export function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero */}
      <section className="relative pt-36 pb-20 text-center overflow-hidden">
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-5">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-medium mb-8">
            ✝ Revelation of Christ Ministries
          </div>
          <h1 className="text-5xl sm:text-6xl font-black leading-[1.05] tracking-tight mb-5">
            Grow in the<br />
            <span className="bg-gradient-to-r from-accent via-purple-400 to-amber-500 bg-clip-text text-transparent">Knowledge of Christ</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
            Bible study teachings and prayer sessions to help you deepen your relationship with God through His Word and prayer.
          </p>
        </div>
      </section>

      {/* Programs */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Our Programmes</span>
          <h2 className="text-3xl font-extrabold mb-8">Listen & Learn</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {programs.map(p => (
              <Link key={p.link} to={p.link} className="group block p-6 rounded-2xl border border-purple-100/50 bg-accent-light hover:bg-accent-mid hover:border-accent/15 transition no-underline text-gray-900">
                <div className={`w-16 h-16 bg-gradient-to-br ${p.color} rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-105 transition`}>
                  {p.icon}
                </div>
                <h3 className="text-xl font-extrabold mb-1">{p.title}</h3>
                <p className="text-sm text-accent font-medium mb-2">{p.subtitle}</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{p.desc}</p>
                <span className="text-sm font-semibold text-accent group-hover:underline">Listen now →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Blog</span>
          <h2 className="text-3xl font-extrabold mb-3">Articles & Reflections</h2>
          <p className="text-gray-500 mb-6">Written teachings, devotionals, and reflections on the Word of God.</p>
          <Link to="/blog" className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold shadow-lg shadow-accent/20 hover:-translate-y-0.5 transition no-underline">
            Read the Blog →
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="py-16 bg-gradient-to-b from-accent-light to-accent-mid">
        <div className="max-w-3xl mx-auto px-5 text-center">
          <h2 className="text-3xl font-extrabold mb-4">About RCM</h2>
          <p className="text-gray-500 leading-relaxed max-w-xl mx-auto mb-6">
            Revelation of Christ Ministries exists to open blind eyes and turn people from darkness to light, and from the power of Satan unto God, through the teaching of God's Word and prayer.
          </p>
          <div className="bg-white/80 border-l-[3px] border-accent rounded-r-xl p-4 max-w-md mx-auto text-left">
            <p className="italic text-gray-700 text-[15px] leading-relaxed mb-1">"To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God"</p>
            <span className="text-accent text-sm font-semibold">— Acts 26:18</span>
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-20 text-center">
        <div className="max-w-3xl mx-auto px-5">
          <span className="text-xs font-semibold uppercase tracking-[2.5px] text-accent block mb-1">Stay Connected</span>
          <h2 className="text-3xl font-extrabold mb-2">Never Miss a Teaching</h2>
          <p className="text-gray-500 mb-8 text-lg">Available on all major podcast platforms.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            {['🎵 Spotify', '🍎 Apple Podcasts', '📺 YouTube', '🎧 Google Podcasts'].map(p => (
              <a key={p} href="#" className="flex items-center gap-2 px-5 py-3.5 bg-accent-light border border-purple-100/50 rounded-2xl no-underline text-gray-900 font-semibold hover:border-accent/25 hover:-translate-y-0.5 transition shadow-sm">{p}</a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
