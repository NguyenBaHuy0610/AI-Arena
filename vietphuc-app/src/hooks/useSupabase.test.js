import { describe, it, expect } from 'vitest';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getGarmentImageUrl } from './useSupabase';

describe('JOB-05 Supabase Integration', () => {
  it('correctly detects if Supabase credentials are configured', () => {
    const configured = isSupabaseConfigured();
    expect(typeof configured).toBe('boolean');
    if (configured) {
      expect(supabase).not.toBeNull();
    } else {
      expect(supabase).toBeNull();
    }
  });

  it('generates appropriate garment image url depending on configuration', () => {
    const url = getGarmentImageUrl('ao-dai');
    if (isSupabaseConfigured()) {
      expect(url).toMatch(/clothes-image|garment-images/);
    } else {
      expect(url).toBe('/garments/ao-dai.webp');
    }
  });

  it('generates correct url for all 5 MVP garments', () => {
    const mvpIds = ['ao-dai', 'ao-tu-than', 'ao-ngu-than', 'ao-nhat-binh', 'ao-ba-ba'];
    for (const id of mvpIds) {
      const url = getGarmentImageUrl(id);
      expect(url).toContain(id);
    }
  });
});
