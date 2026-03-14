-- Run this in Supabase SQL Editor (https://supabase.com/dashboard → your project → SQL Editor)

-- 1. Programmes table
CREATE TABLE rcm_programmes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  subtitle text DEFAULT '',
  description text DEFAULT '',
  icon text DEFAULT '🎙',
  rss_url text DEFAULT '',
  color text DEFAULT 'from-accent to-purple-700',
  verse_text text DEFAULT '',
  verse_ref text DEFAULT '',
  sort_order int DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Site content (key-value)
CREATE TABLE rcm_site_content (
  key text PRIMARY KEY,
  value text NOT NULL,
  label text DEFAULT '',
  field_type text DEFAULT 'text',
  field_group text DEFAULT 'General',
  sort_order int DEFAULT 0
);

-- 3. Announcements
CREATE TABLE rcm_announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  text text NOT NULL,
  link text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 4. RLS policies — public read, anon write (same pattern as blog)
ALTER TABLE rcm_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcm_site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE rcm_announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read programmes" ON rcm_programmes FOR SELECT USING (true);
CREATE POLICY "Anon manage programmes" ON rcm_programmes FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read content" ON rcm_site_content FOR SELECT USING (true);
CREATE POLICY "Anon manage content" ON rcm_site_content FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Public read announcements" ON rcm_announcements FOR SELECT USING (true);
CREATE POLICY "Anon manage announcements" ON rcm_announcements FOR ALL USING (true) WITH CHECK (true);

-- 5. Seed default programmes
INSERT INTO rcm_programmes (title, subtitle, description, icon, rss_url, color, verse_text, verse_ref, sort_order, active) VALUES
('Christ Revealed Bible Study', 'Christ Revealed Bible Study Podcast', 'Your personal understanding of God''s Word is pivotal to your relationship with Him.', '📖', 'https://anchor.fm/s/7431d14c/podcast/rss', 'from-accent to-purple-700', 'To open their eyes, and to turn them from darkness to light, and from the power of Satan unto God', 'Acts 26:18', 0, true),
('School of Prayer', 'Learning to Pray Effectively', 'A weekly programme where we learn about prayer and we pray.', '🙏', '', 'from-amber-500 to-orange-600', 'Pray without ceasing', '1 Thessalonians 5:17', 1, true);

-- 6. Seed default site content
INSERT INTO rcm_site_content (key, value, label, field_type, field_group, sort_order) VALUES
('hero_badge', '✝ Revelation of Christ Ministries', 'Hero Badge Text', 'text', 'Hero', 0),
('hero_title_1', 'Grow in the', 'Hero Title Line 1', 'text', 'Hero', 1),
('hero_title_2', 'Knowledge of Christ', 'Hero Title Line 2 (gradient)', 'text', 'Hero', 2),
('hero_subtitle', 'Bible study teachings and prayer sessions to help you deepen your relationship with God through His Word and prayer.', 'Hero Subtitle', 'textarea', 'Hero', 3),
('about_name', 'Deji Odetayo', 'Host Name', 'text', 'About the Host', 10),
('about_bio', 'Founder of Revelation of Christ Ministries. Passionate about helping believers understand God''s Word and grow in their walk with Christ through systematic Bible study and prayer.', 'Host Bio', 'textarea', 'About the Host', 11),
('about_verse', 'To open their eyes, and to turn them from darkness to light', 'About Scripture', 'text', 'About the Host', 12),
('about_verse_ref', 'Acts 26:18', 'About Scripture Ref', 'text', 'About the Host', 13),
('spotify_url', 'https://open.spotify.com/show/4VnpGdSCkRyJr0tgHELfwP', 'Spotify URL', 'text', 'Links', 20),
('apple_url', 'https://podcasts.apple.com/podcast/id1772578109', 'Apple Podcasts URL', 'text', 'Links', 21),
('stat_1_value', '50+', 'Stat 1 Value', 'text', 'Stats', 30),
('stat_1_label', 'Episodes', 'Stat 1 Label', 'text', 'Stats', 31),
('stat_2_value', '2', 'Stat 2 Value', 'text', 'Stats', 32),
('stat_2_label', 'Programmes', 'Stat 2 Label', 'text', 'Stats', 33),
('stat_3_value', 'Weekly', 'Stat 3 Value', 'text', 'Stats', 34),
('stat_3_label', 'New Teachings', 'Stat 3 Label', 'text', 'Stats', 35);
