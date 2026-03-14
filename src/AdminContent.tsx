import { useState, useEffect } from 'react'
import { getLocal, setLocal } from './supabase'

interface ContentField {
  key: string
  label: string
  value: string
  type: 'text' | 'textarea'
  group: string
}

const DEFAULTS: ContentField[] = [
  { key: 'hero_badge', label: 'Hero Badge Text', value: '✝ Revelation of Christ Ministries', type: 'text', group: 'Hero' },
  { key: 'hero_title_1', label: 'Hero Title Line 1', value: 'Grow in the', type: 'text', group: 'Hero' },
  { key: 'hero_title_2', label: 'Hero Title Line 2 (gradient)', value: 'Knowledge of Christ', type: 'text', group: 'Hero' },
  { key: 'hero_subtitle', label: 'Hero Subtitle', value: 'Bible study teachings and prayer sessions to help you deepen your relationship with God through His Word and prayer.', type: 'textarea', group: 'Hero' },
  { key: 'about_name', label: 'Host Name', value: 'Deji Odetayo', type: 'text', group: 'About the Host' },
  { key: 'about_bio', label: 'Host Bio', value: "Founder of Revelation of Christ Ministries. Passionate about helping believers understand God's Word and grow in their walk with Christ through systematic Bible study and prayer.", type: 'textarea', group: 'About the Host' },
  { key: 'about_verse', label: 'About Scripture', value: 'To open their eyes, and to turn them from darkness to light', type: 'text', group: 'About the Host' },
  { key: 'about_verse_ref', label: 'About Scripture Ref', value: 'Acts 26:18', type: 'text', group: 'About the Host' },
  { key: 'spotify_url', label: 'Spotify URL', value: 'https://open.spotify.com/show/4VnpGdSCkRyJr0tgHELfwP', type: 'text', group: 'Links' },
  { key: 'apple_url', label: 'Apple Podcasts URL', value: 'https://podcasts.apple.com/podcast/id1772578109', type: 'text', group: 'Links' },
  { key: 'stat_1_value', label: 'Stat 1 Value', value: '50+', type: 'text', group: 'Stats' },
  { key: 'stat_1_label', label: 'Stat 1 Label', value: 'Episodes', type: 'text', group: 'Stats' },
  { key: 'stat_2_value', label: 'Stat 2 Value', value: '2', type: 'text', group: 'Stats' },
  { key: 'stat_2_label', label: 'Stat 2 Label', value: 'Programmes', type: 'text', group: 'Stats' },
  { key: 'stat_3_value', label: 'Stat 3 Value', value: 'Weekly', type: 'text', group: 'Stats' },
  { key: 'stat_3_label', label: 'Stat 3 Label', value: 'New Teachings', type: 'text', group: 'Stats' },
]

export function AdminContent() {
  const [fields, setFields] = useState<ContentField[]>(() => getLocal('site_content', DEFAULTS))
  const [saved, setSaved] = useState(false)

  const update = (key: string, value: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value } : f))
    setSaved(false)
  }

  const save = () => {
    setLocal('site_content', fields)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const groups = [...new Set(fields.map(f => f.group))]

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-0.5">Site Content</h1>
          <p className="text-sm text-gray-500">Edit text that appears on the website</p>
        </div>
        <button onClick={save} className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition ${saved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-accent text-white hover:bg-accent/90'}`}>
          {saved ? '✓ Saved' : 'Save Changes'}
        </button>
      </div>
      {groups.map(group => (
        <div key={group} className="mb-8">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[2px] mb-3">{group}</h3>
          <div className="flex flex-col gap-3">
            {fields.filter(f => f.group === group).map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                {f.type === 'textarea' ? (
                  <textarea value={f.value} onChange={e => update(f.key, e.target.value)} rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent resize-none" />
                ) : (
                  <input value={f.value} onChange={e => update(f.key, e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white outline-none focus:border-accent" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
