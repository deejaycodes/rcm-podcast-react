import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || ''
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(url, key)

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  cover_image?: string
  published: boolean
  created_at: string
  updated_at: string
}

export interface Programme {
  id: string
  title: string
  subtitle: string
  description: string
  icon: string
  rss_url: string
  color: string
  verse_text: string
  verse_ref: string
  sort_order: number
  active: boolean
}

export interface SiteContent {
  key: string
  value: string
  label: string
  field_type: string
  field_group: string
}

export interface Announcement {
  id: string
  text: string
  link?: string
  active: boolean
  created_at: string
}
