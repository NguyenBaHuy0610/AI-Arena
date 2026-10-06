-- ============================================
-- Việt Phục AI Arena — Initial Schema
-- ============================================

-- 1. Garments table
CREATE TABLE IF NOT EXISTS garments (
  id TEXT PRIMARY KEY,
  name_vi TEXT NOT NULL,
  name_aliases TEXT[] DEFAULT '{}',
  category TEXT,
  regions TEXT[] DEFAULT '{}',
  period_label TEXT,
  period_from INT,
  period_to INT,
  wearer TEXT DEFAULT 'chung',
  summary TEXT,
  claims JSONB DEFAULT '[]',
  context_fit JSONB DEFAULT '{}',
  parts TEXT[] DEFAULT '{}',
  affinities JSONB DEFAULT '{}',
  color_notes JSONB DEFAULT '[]',
  avatar_spec_id TEXT,
  status TEXT DEFAULT 'draft',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Outfit scores table
CREATE TABLE IF NOT EXISTS outfit_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  garment_id TEXT REFERENCES garments(id),
  accessories TEXT[] DEFAULT '{}',
  shoes TEXT,
  color_id TEXT,
  context_id TEXT,
  style_id TEXT,
  region_id TEXT,
  cultural_score INT NOT NULL,
  grade TEXT NOT NULL,
  alerts JSONB DEFAULT '[]',
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Sources table (for reference)
CREATE TABLE IF NOT EXISTS sources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  publisher TEXT,
  url TEXT,
  accessed DATE,
  type TEXT,
  reliability TEXT DEFAULT 'B',
  license TEXT DEFAULT 'chi-trich-dan'
);

-- 4. Enable Row Level Security (public read, authenticated write)
ALTER TABLE garments ENABLE ROW LEVEL SECURITY;
ALTER TABLE outfit_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Public read access for garments and sources
CREATE POLICY "Public read garments"
  ON garments FOR SELECT
  USING (true);

CREATE POLICY "Public read sources"
  ON sources FOR SELECT
  USING (true);

-- Anyone can insert outfit scores (no auth required for MVP)
CREATE POLICY "Public insert outfit_scores"
  ON outfit_scores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public read outfit_scores"
  ON outfit_scores FOR SELECT
  USING (true);

-- 5. Create Storage bucket for garment images
-- Run in Supabase Dashboard → Storage → Create Bucket:
--   Name: garment-images
--   Public: true
--   File size limit: 5MB
--   Allowed MIME types: image/webp, image/png, image/jpeg
