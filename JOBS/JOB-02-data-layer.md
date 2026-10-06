# JOB-02: Data Layer & Type Definitions

## Goal
Import, normalize, and export all JSON data from `AI-Arena/data/` into clean JavaScript modules that React components can consume directly. Create a single source of truth for all garment data, rules, sources, colors, contexts, and accessories.

## Dependencies
- **JOB-01** must be completed (directory structure exists)

## Input (Read These Files First)
- `data/garments/ao-dai.json` — example garment schema (91 lines, richest data)
- `data/garments/ao-tu-than.json`
- `data/garments/ao-ngu-than.json`
- `data/garments/ao-nhat-binh.json`
- `data/garments/ao-ba-ba.json`
- `data/rules.json` — 9 scoring rules with condition format
- `data/sources.json` — 22 academic/museum sources
- `data/colors.json` — 9 traditional colors with claims
- `data/contexts.json` — 5 usage contexts (Tết, Tốt nghiệp, Kỷ yếu, Phố cổ, Hội làng)
- `data/accessories.json` — 9 accessories with claims
- `data/avatar-specs.json` — avatar rendering specs (for reference, not directly used in 2D)
- `data/styles.json` — 4 style categories
- `data/regions.json` — 4 geographic regions

## Tasks

### Task 1: Create `src/data/garments.js`
Import the 5 MVP garment JSON files and export them as an array and a lookup map:

```javascript
// Import raw JSON
import aoDai from '../../../data/garments/ao-dai.json';
import aoTuThan from '../../../data/garments/ao-tu-than.json';
import aoNguThan from '../../../data/garments/ao-ngu-than.json';
import aoNhatBinh from '../../../data/garments/ao-nhat-binh.json';
import aoBaBa from '../../../data/garments/ao-ba-ba.json';

export const GARMENTS = [aoDai, aoTuThan, aoNguThan, aoNhatBinh, aoBaBa];

// Lookup by ID
export const GARMENT_MAP = Object.fromEntries(
  GARMENTS.map(g => [g.id, g])
);

// Helper: get garment by ID
export function getGarment(id) {
  return GARMENT_MAP[id] || null;
}

// MVP garment IDs for validation
export const MVP_GARMENT_IDS = [
  'ao-dai', 'ao-tu-than', 'ao-ngu-than', 'ao-nhat-binh', 'ao-ba-ba'
];
```

**Note**: Use relative imports since the JSON files are outside `src/`. Vite supports JSON imports natively.

### Task 2: Create `src/data/rules.js`
Import rules and export with helper functions:

```javascript
import rulesData from '../../../data/rules.json';

export const RULES = rulesData.rules;

// Get rules applicable to a specific garment
export function getRulesForGarment(garmentId) {
  return RULES.filter(rule =>
    rule.when.all.some(cond =>
      cond.garment?.in?.includes(garmentId) ||
      cond.garment?.notIn !== undefined
    )
  );
}
```

### Task 3: Create `src/data/sources.js`
Import sources and create a lookup map for efficient citation rendering:

```javascript
import sourcesData from '../../../data/sources.json';

export const SOURCES = sourcesData.sources;

// Lookup by source ID → source object
export const SOURCE_MAP = Object.fromEntries(
  SOURCES.map(s => [s.id, s])
);

// Helper: get source details for citation
export function getSource(id) {
  return SOURCE_MAP[id] || { id, title: 'Nguồn chưa xác định', url: '' };
}

// Helper: get multiple sources for a list of IDs
export function getSources(ids = []) {
  return ids.map(getSource);
}
```

### Task 4: Create `src/data/colors.js`
```javascript
import colorsData from '../../../data/colors.json';

export const COLORS = colorsData.colors;

export const COLOR_MAP = Object.fromEntries(
  COLORS.map(c => [c.id, c])
);

export function getColor(id) {
  return COLOR_MAP[id] || null;
}
```

### Task 5: Create `src/data/contexts.js`
```javascript
import contextsData from '../../../data/contexts.json';

export const CONTEXTS = contextsData.contexts;

export const CONTEXT_MAP = Object.fromEntries(
  CONTEXTS.map(c => [c.id, c])
);
```

### Task 6: Create `src/data/accessories.js`
```javascript
import accessoriesData from '../../../data/accessories.json';

export const ACCESSORIES = accessoriesData.accessories;

export const ACCESSORY_MAP = Object.fromEntries(
  ACCESSORIES.map(a => [a.id, a])
);

// Group accessories by type
export const ACCESSORIES_BY_TYPE = ACCESSORIES.reduce((acc, a) => {
  if (!acc[a.type]) acc[a.type] = [];
  acc[a.type].push(a);
  return acc;
}, {});
```

### Task 7: Create `src/data/styles.js`
```javascript
import stylesData from '../../../data/styles.json';

export const STYLES = stylesData.styles;

export const STYLE_MAP = Object.fromEntries(
  STYLES.map(s => [s.id, s])
);
```

### Task 8: Create `src/data/regions.js`
```javascript
import regionsData from '../../../data/regions.json';

export const REGIONS = regionsData.regions;

export const REGION_MAP = Object.fromEntries(
  REGIONS.map(r => [r.id, r])
);
```

### Task 9: Create `src/data/index.js` (barrel export)
```javascript
export { GARMENTS, GARMENT_MAP, getGarment, MVP_GARMENT_IDS } from './garments';
export { RULES, getRulesForGarment } from './rules';
export { SOURCES, SOURCE_MAP, getSource, getSources } from './sources';
export { COLORS, COLOR_MAP, getColor } from './colors';
export { CONTEXTS, CONTEXT_MAP } from './contexts';
export { ACCESSORIES, ACCESSORY_MAP, ACCESSORIES_BY_TYPE } from './accessories';
export { STYLES, STYLE_MAP } from './styles';
export { REGIONS, REGION_MAP } from './regions';
```

### Task 10: Verify Data Loading
Temporarily add to `HomePage.jsx`:
```javascript
import { GARMENTS, RULES, SOURCES } from '../data';
console.log('Garments loaded:', GARMENTS.length); // Should be 5
console.log('Rules loaded:', RULES.length);         // Should be 9
console.log('Sources loaded:', SOURCES.length);     // Should be 22
```

## Output (Files Created)
- `src/data/garments.js` [NEW]
- `src/data/rules.js` [NEW]
- `src/data/sources.js` [NEW]
- `src/data/colors.js` [NEW]
- `src/data/contexts.js` [NEW]
- `src/data/accessories.js` [NEW]
- `src/data/styles.js` [NEW]
- `src/data/regions.js` [NEW]
- `src/data/index.js` [NEW — barrel export]

## Acceptance Criteria
1. `npm run build` completes without errors
2. Console logs confirm: 5 garments, 9 rules, 22 sources loaded
3. `GARMENT_MAP['ao-dai'].name.vi` returns `"Áo dài"`
4. `getSource('src-btlsq-ao-dai-va-hoa').publisher` returns `"Bảo tàng Lịch sử Quốc gia"`
5. `ACCESSORIES_BY_TYPE['non']` returns array of 2 items (nón lá, quai thao)
6. No TypeScript errors (if TS is enabled) or runtime import errors
