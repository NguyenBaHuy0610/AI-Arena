import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { GARMENTS } from '../data';

export { isSupabaseConfigured };

/**
 * Fetch garments — from Supabase if configured, otherwise local JSON.
 */
export function useGarments() {
  const [garments, setGarments] = useState(GARMENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      return; // Use local fallback
    }

    setLoading(true);
    supabase
      .from('garments')
      .select('*')
      .in('id', ['ao-dai', 'ao-tu-than', 'ao-ngu-than', 'ao-nhat-binh', 'ao-ba-ba'])
      .then(({ data, error }) => {
        if (error) {
          console.warn('Supabase fetch failed, using local data:', error);
          setError(error);
        } else if (data && data.length > 0) {
          setGarments(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Supabase fetch exception, using local data:', err);
        setError(err);
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
      console.log('Supabase not configured — score not saved remotely:', result);
      return null;
    }

    setSaving(true);
    try {
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
    } catch (err) {
      console.error('Error saving outfit to Supabase:', err);
      setSaving(false);
      return null;
    }
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
      .from('clothes-image')
      .getPublicUrl(`${garmentId}.webp`);
    if (data?.publicUrl) return data.publicUrl;
  }
  // Local fallback
  return `/garments/${garmentId}.webp`;
}
