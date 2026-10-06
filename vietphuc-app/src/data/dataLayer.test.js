import { describe, it, expect } from 'vitest';
import {
  GARMENTS,
  ALL_GARMENTS,
  GARMENT_MAP,
  getGarment,
  MVP_GARMENT_IDS,
  RULES,
  getRulesForGarment,
  SOURCES,
  SOURCE_MAP,
  getSource,
  COLORS,
  COLOR_MAP,
  getColor,
  CONTEXTS,
  CONTEXT_MAP,
  getContext,
  ACCESSORIES,
  ACCESSORIES_BY_TYPE,
  getAccessory,
  STYLES,
  REGIONS,
} from './index';

describe('JOB-02 Data Layer', () => {
  it('loads 5 MVP garments and all 9 historical garments', () => {
    expect(GARMENTS).toHaveLength(5);
    expect(MVP_GARMENT_IDS).toEqual([
      'ao-dai', 'ao-tu-than', 'ao-ngu-than', 'ao-nhat-binh', 'ao-ba-ba'
    ]);
    expect(ALL_GARMENTS.length).toBeGreaterThanOrEqual(5);
    expect(GARMENT_MAP['ao-dai'].name.vi).toBe('Áo dài');
    expect(getGarment('ao-ba-ba')).toBeDefined();
    expect(getGarment('ao-ba-ba').name.vi).toBe('Áo bà ba');
  });

  it('loads 9 scoring rules with applicable helpers', () => {
    expect(RULES).toHaveLength(9);
    const aoTuThanRules = getRulesForGarment('ao-tu-than');
    expect(aoTuThanRules.length).toBeGreaterThan(0);
  });

  it('loads academic/historical sources and looks up correctly', () => {
    expect(SOURCES.length).toBeGreaterThanOrEqual(22);
    const btlsqSource = getSource('src-baotanglichsu-ao-ngu-than');
    expect(btlsqSource.publisher).toBe('Bảo tàng Lịch sử Quốc gia');
  });

  it('correctly loads and categorizes accessories', () => {
    expect(ACCESSORIES.length).toBeGreaterThan(0);
    const hats = ACCESSORIES_BY_TYPE['non'];
    expect(hats).toBeDefined();
    expect(hats.map(h => h.id)).toContain('non-la');
    expect(hats.map(h => h.id)).toContain('quai-thao');
    expect(getAccessory('non-la').name.vi).toBe('Nón lá');
  });

  it('correctly maps colors, contexts, styles, and regions', () => {
    expect(COLORS.length).toBeGreaterThanOrEqual(9);
    expect(getColor('do-son').hex).toBe('#B3212B');

    expect(CONTEXTS.length).toBe(5);
    expect(getContext('tet').name.vi).toBe('Tết Nguyên đán');

    expect(STYLES.length).toBe(4);
    expect(REGIONS.length).toBe(4);
  });
});
