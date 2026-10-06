# JOB-05: Supabase Integration

## Goal
Connect the app to Supabase for persistent data storage (garments, outfit scores) and image hosting (garment illustrations). The app must work offline with local JSON fallback and online with Supabase.

## Dependencies
- **JOB-01** (project structure exists)
- **User must provide**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Input (Read These Files First)
- `src/data/garments.js` — current local data
- `src/engine/scoreEngine.js` — outfit evaluation output shape
- `src/components/GarmentCard.jsx` — needs image URL
- `src/components/GarmentDetail.jsx` — needs image URL
- `data/garments/ao-dai.json` — reference schema for DB table

## Tasks

### Task 1: Install Supabase Client
```bash
cd vietphuc-app
npm install @supabase/supabase-js
```

### Task 2: Create Environment Config

#### `vietphuc-app/.env.local.example`
```env
# Supabase Project Configuration
# Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Add `.env.local` to `.gitignore` if not already present.

### Task 3: Create `src/lib/supabase.js`
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create client if credentials are available
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = () => supabase !== null;
```

### Task 4: Create SQL Migration Script

Create `JOBS/migrations/001_initial_schema.sql`:

```sql
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
```

### Task 5: Create Seed Script

Create `JOBS/migrations/002_seed_garments.sql`:

```sql
-- Seed the 5 MVP garments
INSERT INTO garments (id, name_vi, category, regions, period_label, wearer, summary, claims, context_fit, parts, affinities, status)
VALUES
  ('ao-dai', 'Áo dài', 'cach-tan', ARRAY['viet-phuc','hue-trung-bo','nam-bo'],
   'Quá trình định hình từ thế kỷ XVIII; biến đổi mạnh trong thế kỷ XX đến nay',
   'chung',
   'Áo dài là trang phục biểu tượng của Việt Nam, thường có thân dài, cổ áo và tà xẻ hai bên.',
   '[{"key":"origin","text":"Nguồn gốc chính xác của áo dài chưa được xác định hoàn toàn.","sourceIds":["src-hcmussh-ao-dai"],"status":"checked","contested":true}]'::jsonb,
   '{"tet":2,"tot-nghiep":2,"ky-yeu":2,"pho-co":1,"hoi-lang":1}'::jsonb,
   ARRAY['ao','quan'],
   '{"accessories":{"non-la":1,"quai-thao":0},"shoes":{"guoc-moc":1,"sneaker":1}}'::jsonb,
   'checked'),

  ('ao-tu-than', 'Áo tứ thân', 'viet-phuc-phuc-dung', ARRAY['bac-bo'],
   'Thế kỷ XVII–XX', 'nu',
   'Áo tứ thân là hình ảnh gắn với trang phục phụ nữ Bắc Bộ.',
   '[]'::jsonb, '{"tet":2,"ky-yeu":2,"hoi-lang":2}'::jsonb,
   ARRAY['ao','yem','vay','that-lung'], '{}'::jsonb, 'draft'),

  ('ao-ngu-than', 'Áo ngũ thân', 'truyen-thong', ARRAY['viet-phuc'],
   'Thế kỷ XVIII–XX', 'chung',
   'Áo ngũ thân là dạng áo dài truyền thống có cấu trúc năm thân.',
   '[]'::jsonb, '{"tet":2,"ky-yeu":2,"hoi-lang":2}'::jsonb,
   ARRAY['ao','quan'], '{}'::jsonb, 'draft'),

  ('ao-nhat-binh', 'Áo Nhật Bình', 'viet-phuc-phuc-dung', ARRAY['hue-trung-bo','viet-phuc'],
   'Triều Nguyễn', 'nu',
   'Áo Nhật Bình là trang phục cung đình triều Nguyễn.',
   '[]'::jsonb, '{"tet":2,"ky-yeu":2}'::jsonb,
   ARRAY['ao','quan'], '{}'::jsonb, 'draft'),

  ('ao-ba-ba', 'Áo bà ba', 'truyen-thong', ARRAY['nam-bo'],
   'Thế kỷ XX đến nay', 'chung',
   'Áo bà ba là trang phục gắn với đời sống Nam Bộ.',
   '[]'::jsonb, '{"tet":1,"ky-yeu":1,"hoi-lang":1}'::jsonb,
   ARRAY['ao','quan'], '{}'::jsonb, 'draft')

ON CONFLICT (id) DO NOTHING;
```

### Task 6: Create `src/hooks/useSupabase.js`
Custom hooks with offline fallback:

```javascript
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GARMENTS } from '../data';

/**
 * Fetch garments — from Supabase if configured, otherwise local JSON.
 */
export function useGarments() {
  const [garments, setGarments] = useState(GARMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) return; // Use local fallback

    setLoading(true);
    supabase
      .from('garments')
      .select('*')
      .in('id', ['ao-dai', 'ao-tu-than', 'ao-ngu-than', 'ao-nhat-binh', 'ao-ba-ba'])
      .then(({ data, error }) => {
        if (error) {
          console.warn('Supabase fetch failed, using local data:', error);
          setError(error);
        } else if (data?.length > 0) {
          setGarments(data);
        }
        setLoading(false);
      });
  }, []);

  return { garments, loading, error };
}

/**
 * Save an outfit score to Supabase.
 */
export function useSaveOutfit() {
  const [saving, setSaving] = useState(false);

  const saveOutfit = async (outfit, result) => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured — score not saved:', result);
      return null;
    }

    setSaving(true);
    const { data, error } = await supabase
      .from('outfit_scores')
      .insert({
        garment_id: outfit.garmentId,
        accessories: outfit.accessories,
        shoes: outfit.shoes,
        color_id: outfit.color,
        context_id: outfit.context,
        style_id: outfit.style,
        region_id: outfit.region,
        cultural_score: result.culturalScore,
        grade: result.grade,
        alerts: result.alerts,
      })
      .select()
      .single();

    setSaving(false);

    if (error) {
      console.error('Failed to save outfit:', error);
      return null;
    }
    return data;
  };

  return { saveOutfit, saving };
}

/**
 * Get garment image URL from Supabase Storage.
 * Falls back to local /garments/{id}.webp if not configured.
 */
export function getGarmentImageUrl(garmentId) {
  if (isSupabaseConfigured()) {
    const { data } = supabase.storage
      .from('garment-images')
      .getPublicUrl(`${garmentId}.webp`);
    return data?.publicUrl;
  }
  // Local fallback
  return `/garments/${garmentId}.webp`;
}
```

### Task 7: Create Public Garments Directory
```bash
mkdir -p vietphuc-app/public/garments
```

Create a placeholder `vietphuc-app/public/garments/.gitkeep` file so the directory is tracked.

### Task 8: Update `.gitignore`
Add to `vietphuc-app/.gitignore`:
```
.env.local
.env.*.local
```

## Output (Files Created/Modified)
- `src/lib/supabase.js` [NEW]
- `src/hooks/useSupabase.js` [NEW]
- `.env.local.example` [NEW]
- `JOBS/migrations/001_initial_schema.sql` [NEW]
- `JOBS/migrations/002_seed_garments.sql` [NEW]
- `public/garments/.gitkeep` [NEW]
- `.gitignore` [MODIFIED]
- `package.json` [MODIFIED — add @supabase/supabase-js]

## Acceptance Criteria
1. `npm run build` succeeds (no import errors)
2. App runs without Supabase credentials (falls back to local JSON seamlessly)
3. When `.env.local` has valid credentials:
   - `useGarments()` fetches from Supabase
   - `useSaveOutfit()` saves outfit scores
   - `getGarmentImageUrl()` returns Supabase Storage URL
4. SQL migration scripts are valid and can be run in Supabase SQL Editor
5. No credentials are hardcoded or committed to git
