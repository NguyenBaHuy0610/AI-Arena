# JOB-04: Score Engine & Outfit Builder

## Goal
Build the outfit scoring system and interactive builder UI. Users select a garment, accessories, shoes, color, context, style, and region — the engine evaluates the combination against cultural rules and displays a score with alerts and suggestions.

## Dependencies
- **JOB-02** (data layer must be available)
- **JOB-01** (component stubs exist)

## Input (Read These Files First)
- `data/rules.json` — 9 rules with `when.all` condition format (CRITICAL — understand this schema)
- `src/data/index.js` — all data exports
- `src/data/garments.js` — garment data with `affinities` and `contextFit`
- `src/data/accessories.js` — accessories grouped by type
- `src/data/colors.js` — color palette
- `src/data/contexts.js` — 5 usage contexts
- `src/data/styles.js` — 4 style categories
- `src/data/regions.js` — 4 geographic regions
- `vietphuc-app/src/App.jsx` (original) — reference lines 31–35 for existing EVAL_RULES pattern and lines 199–210 for existing evaluation logic

## Tasks

### Task 1: Create `src/engine/scoreEngine.js`
The core pure-function scoring engine:

```javascript
/**
 * Evaluate an outfit combination against cultural & aesthetic rules.
 *
 * @param {Object} outfit — user's selected combination:
 *   {
 *     garmentId: string,        // e.g. 'ao-dai'
 *     accessories: string[],    // e.g. ['non-la', 'khan-ran']
 *     shoes: string | null,     // e.g. 'guoc-moc'
 *     color: string | null,     // e.g. 'do-son' (top garment color)
 *     context: string | null,   // e.g. 'tet'
 *     style: string | null,     // e.g. 'truyen-thong'
 *     region: string | null,    // e.g. 'bac-bo'
 *   }
 * @param {Array} rules — from rules.json
 * @returns {Object}
 *   {
 *     culturalScore: number (0–100),
 *     grade: 'A' | 'B' | 'C' | 'D',
 *     alerts: Array<{ id, level, message, sourceIds, delta }>,
 *     positives: Array<{ id, message, delta }>,  // rules with delta > 0
 *     warnings: Array<{ id, level, message, sourceIds, delta }>,  // rules with delta < 0 or level > 0
 *   }
 */
export function evaluateOutfit(outfit, rules) {
  let score = 100;
  const alerts = [];

  for (const rule of rules) {
    if (matchesCondition(rule.when, outfit)) {
      score += rule.delta;
      alerts.push({
        id: rule.id,
        level: rule.level,
        message: rule.message,
        sourceIds: rule.sourceIds || [],
        delta: rule.delta,
        status: rule.status,
      });
    }
  }

  const culturalScore = Math.max(0, Math.min(100, score));

  return {
    culturalScore,
    grade: culturalScore >= 90 ? 'A' : culturalScore >= 70 ? 'B' : culturalScore >= 50 ? 'C' : 'D',
    alerts,
    positives: alerts.filter(a => a.delta > 0),
    warnings: alerts.filter(a => a.delta <= 0),
  };
}

/**
 * Check if ALL conditions in `when.all` match the outfit.
 */
function matchesCondition(when, outfit) {
  if (!when?.all || !Array.isArray(when.all)) return false;

  return when.all.every(cond => {
    // Garment conditions
    if (cond.garment?.in) {
      return cond.garment.in.includes(outfit.garmentId);
    }
    if (cond.garment?.notIn) {
      return !cond.garment.notIn.includes(outfit.garmentId);
    }

    // Accessory conditions
    if (cond.accessories?.has) {
      return outfit.accessories?.includes(cond.accessories.has);
    }

    // Shoe conditions
    if (cond.shoes?.has) {
      return outfit.shoes === cond.shoes.has;
    }
    if (cond.shoes?.in) {
      return cond.shoes.in.includes(outfit.shoes);
    }

    // Context conditions
    if (cond.context?.in) {
      return cond.context.in.includes(outfit.context);
    }

    // Style conditions
    if (cond.style?.in) {
      return cond.style.in.includes(outfit.style);
    }

    // Region conditions
    if (cond.region?.in) {
      return cond.region.in.includes(outfit.region);
    }

    // Color conditions
    if (cond.topColor?.in) {
      return cond.topColor.in.includes(outfit.color);
    }

    // Unknown condition — treat as passing (safe default)
    return true;
  });
}
```

### Task 2: Create `src/engine/scoreEngine.test.js`
Unit tests using Vitest:

```javascript
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
    // Create a scenario with many penalties
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
```

Install vitest if not present:
```bash
npm install -D vitest
```

Add to `package.json` scripts:
```json
"test": "vitest run"
```

### Task 3: Implement `OutfitBuilder.jsx`
Interactive outfit composition panel:

**State**: `{ garmentId, accessories: [], shoes, color, context, style, region }`

**Layout**:
```
┌────────────────────────────────────────────────┐
│  Phối đồ Việt phục                              │
├────────────────────────────────────────────────┤
│                                                │
│  🎎 Trang phục chính                           │
│  ┌──────────────────────────────────────────┐  │
│  │ [Áo dài] [Áo tứ thân] [Áo ngũ thân]    │  │
│  │ [Áo nhật bình] [Áo bà ba]               │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  🎩 Phụ kiện (chọn nhiều)                      │
│  ┌──────────────────────────────────────────┐  │
│  │ Nón: ☐ Nón lá  ☐ Quai thao              │  │
│  │ Khăn: ☐ Khăn vấn  ☐ Khăn rằn            │  │
│  │ Khác: ☐ Túi đeo chéo  ☐ Kính mát        │  │
│  └──────────────────────────────────────────┘  │
│                                                │
│  👟 Giày dép                                   │
│  [Guốc mộc ▼] [Sneaker ▼] [Giày da ▼]        │
│                                                │
│  🎨 Màu sắc chính                              │
│  [Color swatches from colors.json]             │
│                                                │
│  📍 Bối cảnh                                    │
│  [Tết] [Tốt nghiệp] [Kỷ yếu] [Phố cổ] ...   │
│                                                │
│  🌍 Vùng miền                                   │
│  [Bắc Bộ] [Huế] [Nam Bộ] [Liên vùng]         │
│                                                │
│  🎭 Phong cách                                  │
│  [Truyền thống] [Retro] [Streetwear] [Thanh lịch]│
│                                                │
└────────────────────────────────────────────────┘
```

**Behavior**:
- Garment selection: radio buttons (one at a time) styled as cards
- Accessories: checkboxes (multiple selection)
- Shoes: radio buttons
- Color: swatch grid with hex preview
- Context/Region/Style: pill buttons (single select)
- Every selection change triggers `evaluateOutfit()` reactively via `useMemo`
- Pass the result to `<ScorePanel />`

### Task 4: Implement `ScorePanel.jsx`
Score display component:

**Props**: `{ score, grade, alerts, positives, warnings }`

**Design**:
```
┌──────────────────────────────────┐
│   Điểm văn hóa                   │
│         ┌───────┐                │
│         │  85   │  ← large number│
│         │  (B)  │  ← grade badge │
│         └───────┘                │
│   ████████████░░░░  85/100       │
│                                  │
│  ✅ Điểm cộng (2)               │
│  ┌────────────────────────────┐  │
│  │ +5 Khăn rằn phù hợp với   │  │
│  │    áo bà ba Nam Bộ         │  │
│  │    📚 2 nguồn              │  │
│  └────────────────────────────┘  │
│                                  │
│  ⚠️ Cảnh báo (1)                │
│  ┌────────────────────────────┐  │
│  │ Level 2                    │  │
│  │ -18 Nón quai thao gắn với │  │
│  │     văn hóa Bắc Bộ...     │  │
│  │     📚 1 nguồn             │  │
│  └────────────────────────────┘  │
│                                  │
│  💡 Không có gợi ý nào          │
└──────────────────────────────────┘
```

**Styling by level**:
- Level 0 (aesthetic suggestion): amber/yellow border, 💡 icon
- Level 1 (cultural note): orange border, ⚠️ icon
- Level 2 (cultural warning): red border, 🚨 icon
- Positive delta: green border, ✅ icon

**Score visualization**:
- Circular progress or horizontal bar
- Color gradient: red (0–49) → orange (50–69) → yellow (70–89) → green (90–100)
- Grade letter: A (green), B (blue), C (orange), D (red)

### Task 5: Implement `BuilderPage.jsx`
Wire everything together:

```jsx
import { useState, useMemo } from 'react';
import OutfitBuilder from '../components/OutfitBuilder';
import ScorePanel from '../components/ScorePanel';
import { RULES } from '../data';
import { evaluateOutfit } from '../engine/scoreEngine';

export default function BuilderPage() {
  const [outfit, setOutfit] = useState({
    garmentId: 'ao-dai',
    accessories: [],
    shoes: null,
    color: null,
    context: null,
    style: null,
    region: null,
  });

  const result = useMemo(
    () => evaluateOutfit(outfit, RULES),
    [outfit]
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6">
      <div className="flex-1">
        <OutfitBuilder outfit={outfit} onChange={setOutfit} />
      </div>
      <div className="w-full lg:w-96">
        <ScorePanel {...result} />
      </div>
    </div>
  );
}
```

### Task 6: Add Vitest Configuration
Create `vietphuc-app/vitest.config.js`:
```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
  },
});
```

## Output (Files Created/Modified)
- `src/engine/scoreEngine.js` [NEW]
- `src/engine/scoreEngine.test.js` [NEW]
- `src/components/OutfitBuilder.jsx` [MODIFIED — full implementation]
- `src/components/ScorePanel.jsx` [MODIFIED — full implementation]
- `src/pages/BuilderPage.jsx` [MODIFIED — full implementation]
- `package.json` [MODIFIED — add vitest, test script]
- `vitest.config.js` [NEW]

## Acceptance Criteria
1. `npm test` runs and all 5 test cases pass
2. `npm run build` succeeds
3. Builder page at `/builder` renders all selection controls
4. Selecting Áo tứ thân + Nón quai thao + Bắc Bộ → Score 100+ (positive rule fires, +5)
5. Selecting Áo bà ba + Nón quai thao + Nam Bộ → Score drops to 82 (quai-thao-sai-vung fires, -18)
6. Selecting Áo nhật bình + Truyền thống → Alert appears about phục dựng
7. Score panel updates reactively on every selection change
8. Alert cards show correct level styling (amber/orange/red)
9. Source citation links work on alert cards
