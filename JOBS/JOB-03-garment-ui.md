# JOB-03: Garment Gallery & Detail UI

## Goal
Build the core 2D garment introduction experience: a gallery page showing all 5 MVP garments as visually stunning watercolor-style cards, and a detail page for each garment displaying cultural information, structural details, and cited sources.

## Dependencies
- **JOB-01** (component stubs and routing exist)
- **JOB-02** (data layer is available via `src/data/`)

## Input (Read These Files First)
- `src/data/index.js` — barrel exports for all data
- `src/data/garments.js` — the 5 MVP garments
- `src/data/sources.js` — source citation lookup
- `src/components/GarmentCard.jsx` — stub to replace
- `src/components/GarmentGallery.jsx` — stub to replace
- `src/components/GarmentDetail.jsx` — stub to replace
- `src/components/SourceCitation.jsx` — stub to replace
- `src/pages/HomePage.jsx` — stub to replace
- `src/pages/GarmentPage.jsx` — stub to replace
- `data/garments/ao-dai.json` — reference for data shape (claims, contextFit, parts, affinities)

## Tasks

### Task 1: Implement `GarmentCard.jsx`
A visually rich card component for the gallery grid:

**Props**: `{ garment, onClick }`

**Design Requirements**:
- Aspect ratio ~2:3 card with rounded corners (border-radius: 16px)
- Top: garment image (watercolor illustration) — use placeholder gradient if image not yet generated
- Bottom: overlay with garment info
  - Name (Vietnamese): e.g. "Áo dài" — use display font
  - Period badge: e.g. "TK XVIII–nay" — small pill badge
  - Region tag: e.g. "Liên vùng" — subtle tag
  - One-line summary (truncated to 2 lines)
- **Hover effects**: 
  - Card lifts with subtle shadow (`transform: translateY(-8px)`)
  - Image scales slightly (`transform: scale(1.05)`)
  - Gradient overlay becomes more transparent to reveal image
- **Transition**: smooth 300ms ease-out on all hover effects
- Dark card background: `var(--color-dark-card)` or `#2A2A2A`
- Gold accent on hover border: `var(--color-gold)`

**Placeholder image strategy**: Until AI images are generated (JOB-06), use a gradient placeholder that matches the garment's primary color from the data:
```javascript
const placeholderGradient = {
  'ao-dai': 'linear-gradient(135deg, #274B6D 0%, #1E3A5F 100%)',      // xanh chàm
  'ao-tu-than': 'linear-gradient(135deg, #6F4528 0%, #5B3924 100%)',   // nâu gụ
  'ao-ngu-than': 'linear-gradient(135deg, #B3212B 0%, #8B0000 100%)',  // đỏ son
  'ao-nhat-binh': 'linear-gradient(135deg, #D99A16 0%, #D99000 100%)',// vàng nghệ
  'ao-ba-ba': 'linear-gradient(135deg, #1B1B1B 0%, #333333 100%)',    // đen
};
```

### Task 2: Implement `GarmentGallery.jsx`
A responsive grid of `GarmentCard` components:

**Props**: `{ garments }`

**Layout**:
- Desktop (≥1024px): 5 columns in a single row
- Tablet (768–1023px): 3 columns, 2 rows
- Mobile (<768px): 1 column, scrollable
- Gap: 24px between cards
- Center-aligned with max-width container
- Section title: "Trang phục Việt Nam" with subtitle "Khám phá 5 bộ trang phục tiêu biểu ba miền"
- Use `useNavigate` from react-router-dom — clicking a card navigates to `/garment/{id}`

### Task 3: Implement `SourceCitation.jsx`
Reusable component for displaying source references:

**Props**: `{ sourceIds, sources }` (or `{ sourceIds }` and import sources internally)

**Design**:
- Compact by default: show source count badge (e.g. "📚 3 nguồn")
- Expandable on click: show list of sources with:
  - Source title (linked to URL)
  - Publisher name
  - Reliability badge: A = 🟢, B = 🟡, C = 🔴
  - Access date
- Subtle border, small font (text-xs/text-sm)

### Task 4: Implement `GarmentDetail.jsx`
Full-page garment detail view:

**Props**: `{ garment, sources }` (or fetch via route params)

**Layout (two-column on desktop)**:
```
┌─────────────────────────────────────────────────────┐
│ ← Quay lại                                          │
├───────────────────────┬─────────────────────────────┤
│                       │ Áo dài                       │
│                       │ ─────────                    │
│   [Watercolor Image]  │ 📅 Thế kỷ XVIII – nay       │
│   (large, ~50% width) │ 📍 Liên vùng                │
│                       │ 👤 Chung (nam & nữ)          │
│                       │                              │
│                       │ Áo dài là trang phục biểu    │
│                       │ tượng của Việt Nam...         │
│                       │                              │
│                       │ ━━ Cấu trúc ━━               │
│                       │ • Thân dài, cổ đứng          │
│                       │ • 2 tà xẻ từ eo              │
│                       │ • Form ôm, vải lụa           │
│                       │                              │
│                       │ ━━ Mặc cùng ━━               │
│                       │ áo, quần                     │
│                       │                              │
│                       │ ━━ Phù hợp bối cảnh ━━       │
│                       │ Tết ●●  Kỷ yếu ●●           │
│                       │ Tốt nghiệp ●●  Hội làng ●   │
│                       │                              │
│                       │ ━━ Nhận định học thuật ━━     │
│                       │ [claim cards with status]     │
│                       │                              │
│                       │ 📚 Nguồn tham chiếu:         │
│                       │ <SourceCitation />            │
├───────────────────────┴─────────────────────────────┤
│ ⚠️ Lưu ý: [contested claims shown here if any]      │
└─────────────────────────────────────────────────────┘
```

**Sections to render from garment data**:

1. **Header**: `garment.name.vi`, `garment.period.label`, region names (lookup from REGION_MAP)
2. **Summary**: `garment.summary`
3. **Claims**: Loop through `garment.claims[]`:
   - Show `claim.text`
   - Status badge: `checked` = ✅, `draft` = 📝
   - If `claim.contested === true`, show ⚠️ warning with `claim.attribution`
   - Cite sources inline via `<SourceCitation sourceIds={claim.sourceIds} />`
4. **Context Fit**: Visual indicator (dots or stars) for each context in `garment.contextFit`
   - 0 = ○ (not recommended), 1 = ● (okay), 2 = ●● (great fit)
5. **Parts**: List `garment.parts` with Vietnamese labels
6. **Color Notes**: If `garment.colorNotes` exists, show them
7. **Status Badge**: Show `garment.status` — "checked" = green, "draft" = yellow

**Mobile**: Single column, image on top, info below

### Task 5: Implement `HomePage.jsx`
```javascript
import { GARMENTS } from '../data';
import GarmentGallery from '../components/GarmentGallery';

export default function HomePage() {
  return (
    <div>
      {/* Hero section */}
      <section className="text-center py-16">
        <h1>Việt Phục AI Arena</h1>
        <p>Khám phá trang phục truyền thống Việt Nam qua góc nhìn AI</p>
      </section>

      {/* Gallery */}
      <GarmentGallery garments={GARMENTS} />
    </div>
  );
}
```

Add a hero section with:
- Large title in display font
- Subtitle explaining the app's purpose
- Subtle animated gradient background or decorative Vietnamese pattern

### Task 6: Implement `GarmentPage.jsx`
```javascript
import { useParams, useNavigate } from 'react-router-dom';
import { getGarment } from '../data';
import GarmentDetail from '../components/GarmentDetail';

export default function GarmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const garment = getGarment(id);

  if (!garment) {
    return <div>Không tìm thấy trang phục</div>;
  }

  return <GarmentDetail garment={garment} onBack={() => navigate('/')} />;
}
```

### Task 7: Styling Requirements
Use TailwindCSS v4 utility classes plus custom CSS where needed:

- **Typography**: Import Google Fonts (Playfair Display for titles, Inter for body) via `<link>` in `index.html`
- **Dark theme**: Background `#1B1B1B`, cards `#2A2A2A`, text `#F5F0E6`
- **Accent colors**: Gold borders, red badges, cream text
- **Smooth transitions**: All interactive elements have 200-300ms transitions
- **No generic blue/gray**: Use the Vietnamese color palette from `data/colors.json`

## Output (Files Modified)
- `src/components/GarmentCard.jsx` [MODIFIED — full implementation]
- `src/components/GarmentGallery.jsx` [MODIFIED — full implementation]
- `src/components/GarmentDetail.jsx` [MODIFIED — full implementation]
- `src/components/SourceCitation.jsx` [MODIFIED — full implementation]
- `src/pages/HomePage.jsx` [MODIFIED — with hero + gallery]
- `src/pages/GarmentPage.jsx` [MODIFIED — with detail view]
- `vietphuc-app/index.html` [MODIFIED — add Google Fonts link]

## Acceptance Criteria
1. `npm run build` succeeds
2. Gallery page (`/`) shows 5 cards in responsive grid
3. Clicking "Áo dài" card navigates to `/garment/ao-dai`
4. Detail page shows ALL fields: name, period, region, summary, claims, contextFit, parts, sources
5. Each claim shows its status (checked/draft) and source citations
6. Contested claims display warning with attribution text
7. "Quay lại" button returns to gallery
8. Hover effects work on all cards
9. Page is responsive at 375px, 768px, 1440px viewports
10. No hardcoded Vietnamese text — all data comes from JSON
