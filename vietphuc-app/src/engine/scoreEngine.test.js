import { describe, it, expect } from 'vitest';
import { evaluateOutfit } from './scoreEngine';
import { RULES } from '../data/rules';

describe('scoreEngine', () => {
  it('returns perfect score for compatible outfit', () => {
    const outfit = {
      garmentId: 'ao-dai',
      accessories: ['non-la'],
      shoes: 'guoc-moc',
      color: 'do-son',
      context: 'tet',
      style: 'truyen-thong',
      region: 'viet-phuc',
    };
    const result = evaluateOutfit(outfit, RULES);
    expect(result.culturalScore).toBeGreaterThanOrEqual(90);
    expect(result.grade).toBe('A');
    expect(result.warnings).toHaveLength(0);
  });

  it('penalizes quai-thao with non-Bắc-Bộ garment in wrong region', () => {
    const outfit = {
      garmentId: 'ao-ba-ba',
      accessories: ['quai-thao'],
      shoes: null,
      color: null,
      context: null,
      style: null,
      region: 'nam-bo',
    };
    const result = evaluateOutfit(outfit, RULES);
    expect(result.culturalScore).toBeLessThan(100);
    const quaiThaoWarning = result.warnings.find(w => w.id === 'quai-thao-sai-vung');
    expect(quaiThaoWarning).toBeDefined();
    expect(quaiThaoWarning.delta).toBe(-18);
  });

  it('rewards khan-ran with ao-ba-ba in Nam Bộ', () => {
    const outfit = {
      garmentId: 'ao-ba-ba',
      accessories: ['khan-ran'],
      shoes: null,
      color: null,
      context: null,
      style: null,
      region: 'nam-bo',
    };
    const result = evaluateOutfit(outfit, RULES);
    const positive = result.positives.find(p => p.id === 'khan-ran-voi-ao-ba-ba');
    expect(positive).toBeDefined();
    expect(positive.delta).toBe(5);
  });

  it('warns about ao-nhat-binh phục dựng', () => {
    const outfit = {
      garmentId: 'ao-nhat-binh',
      accessories: [],
      shoes: null,
      color: null,
      context: null,
      style: 'truyen-thong',
      region: null,
    };
    const result = evaluateOutfit(outfit, RULES);
    const warning = result.alerts.find(a => a.id === 'ao-nhat-binh-phuc-dung');
    expect(warning).toBeDefined();
  });

  it('clamps score between 0 and 100', () => {
    const outfit = {
      garmentId: 'ao-the',
      accessories: ['quai-thao', 'kinh-mat'],
      shoes: 'sneaker',
      color: 'vang-tuoi',
      context: 'hoi-lang',
      style: 'truyen-thong',
      region: 'nam-bo',
    };
    const result = evaluateOutfit(outfit, RULES);
    expect(result.culturalScore).toBeGreaterThanOrEqual(0);
    expect(result.culturalScore).toBeLessThanOrEqual(100);
  });
});
