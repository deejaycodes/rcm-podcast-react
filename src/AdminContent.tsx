import { useState, useEffect } from 'react'
import { supabase } from './supabase'

interface ContentField {
  key: string
  value: string
  label: string
  field_type: string
  field_group: string
  sort_order: number
}

export function AdminContent() {
  const [fields, setFields] = useState<ContentField[]>([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('rcm_site_content').select('*').order('sort_order').then(({ data }) => {
      if (data) setFields(data)
      setLoading(false)
    })
  }, [])

  const update = (key: string, value: string) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, value } : f))
    setSaved(false)
  }

  const save = async () => {
    for (const f of fields) {
      await supabase.from('rcm_site_content').update({ value: f.value }).eq('key', f.key)
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const groups = [...new Set(fields.map(f => f.field_group))]

  if (loading) return <p className="text-gray-500 text-sm">Loading...</p>

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
            {fields.filter(f => f.field_group === group).map(f => (
              <div key={f.key}>
                <label className="text-xs font-semibold text-gray-500 block mb-1.5">{f.label}</label>
                {f.field_type === 'textarea' ? (
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
