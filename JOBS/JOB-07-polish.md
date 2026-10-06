# JOB-07: Polish, Animations & Final QA

## Goal
Final polish pass: add animations, ensure responsiveness, optimize performance, add SEO meta tags, and perform comprehensive QA on all features.

## Dependencies
- **ALL previous jobs** (JOB-01 through JOB-06)

## Input (Read These Files First)
- All component files in `src/components/`
- All page files in `src/pages/`
- `src/App.jsx` — router setup
- `vietphuc-app/index.html` — meta tags
- `package.json` — dependencies to clean up

## Tasks

### Task 1: Page Transition Animations
Add smooth transitions between routes:

```bash
npm install framer-motion
```

Wrap route content in `<AnimatePresence>` with fade/slide transitions:
```jsx
import { motion, AnimatePresence } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// In Layout.jsx, wrap <Outlet /> with:
<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.3 }}
  >
    <Outlet />
  </motion.div>
</AnimatePresence>
```

### Task 2: Micro-Interactions
Add to existing components:

**GarmentCard**:
- Card entrance: stagger animation (each card fades in 100ms after the previous)
- Hover: shadow deepens, border glows gold, image scales 1.05
- Click: subtle scale down (0.98) then navigate

**ScorePanel**:
- Score counter animates from 0 to final score (count-up effect)
- Grade badge pops in with spring animation
- Alert cards slide in from right with stagger

**OutfitBuilder**:
- Selection buttons have press feedback (scale 0.95)
- Color swatches have ring animation on select

### Task 3: Responsive Design Audit
Verify all pages at these breakpoints:

| Breakpoint | Target |
|-----------|--------|
| 375px | iPhone SE/Mini |
| 414px | iPhone 14 |
| 768px | iPad Portrait |
| 1024px | iPad Landscape |
| 1440px | Desktop |
| 1920px | Large Desktop |

**Specific checks**:
- Gallery: single column on mobile, 2–3 on tablet, 5 on desktop
- Detail: stacked layout on mobile, side-by-side on desktop
- Builder: full-width controls on mobile, two-column on desktop
- Header: hamburger menu on mobile, full nav on desktop
- Images: responsive sizing with `object-fit: cover`

### Task 4: SEO & Meta Tags
Update `vietphuc-app/index.html`:

```html
<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- SEO -->
    <title>Việt Phục AI Arena — Khám phá trang phục truyền thống Việt Nam</title>
    <meta name="description" content="Giới thiệu 5 bộ trang phục truyền thống Việt Nam: Áo dài, Áo tứ thân, Áo ngũ thân, Áo nhật bình, Áo bà ba. Phối đồ và chấm điểm văn hóa với AI." />
    <meta name="keywords" content="Việt phục, áo dài, trang phục truyền thống, Vietnamese traditional clothing, AI, cổ phục" />
    <meta name="author" content="Việt Phục AI Arena" />

    <!-- Open Graph -->
    <meta property="og:title" content="Việt Phục AI Arena" />
    <meta property="og:description" content="Khám phá trang phục truyền thống Việt Nam qua góc nhìn AI" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/garments/ao-dai.webp" />
    <meta property="og:locale" content="vi_VN" />

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Task 5: Performance Optimization
1. **Lazy load routes**:
```jsx
const HomePage = lazy(() => import('./pages/HomePage'));
const GarmentPage = lazy(() => import('./pages/GarmentPage'));
const BuilderPage = lazy(() => import('./pages/BuilderPage'));
```

2. **Image optimization**: Ensure all garment images are < 200KB each
3. **Code splitting**: Verify Vite chunks are reasonable (< 500KB)

### Task 6: Clean Up Dependencies
Remove unused Three.js packages:
```bash
npm uninstall @react-three/fiber @react-three/drei three
```

Remove unused `App.css` if no styles are referenced.

### Task 7: Create Project README
Replace `vietphuc-app/README.md` with:

```markdown
# Việt Phục AI Arena 🇻🇳

Khám phá trang phục truyền thống Việt Nam qua góc nhìn AI.

## Tính năng
- 🎨 Bộ sưu tập 5 trang phục tiêu biểu ba miền với tranh minh họa AI
- 📊 Hệ thống chấm điểm văn hóa cho bộ phối trang phục
- 📚 Nguồn tham chiếu học thuật cho mọi nhận định
- 💾 Lưu trữ dữ liệu qua Supabase

## Trang phục MVP
| Tên | Vùng | Thời kỳ |
|-----|------|---------|
| Áo dài | Liên vùng | TK XVIII–nay |
| Áo tứ thân | Bắc Bộ | TK XVII–XX |
| Áo ngũ thân | Liên vùng | TK XVIII–XX |
| Áo nhật bình | Huế | Triều Nguyễn |
| Áo bà ba | Nam Bộ | TK XX–nay |

## Cài đặt
\`\`\`bash
cd vietphuc-app
npm install
npm run dev
\`\`\`

## Supabase (tùy chọn)
\`\`\`bash
cp .env.local.example .env.local
# Điền VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY
\`\`\`

## Công nghệ
- React 19 + Vite 8
- TailwindCSS v4
- Framer Motion
- Supabase (Database + Storage)

## Nguồn dữ liệu
Tất cả nhận định văn hóa đều có trích dẫn từ:
- Bảo tàng Lịch sử Quốc gia
- Tạp chí Văn hóa Nghệ thuật
- ĐH KHXH&NV TP.HCM
- VietnamPlus, TTXVN
- Và các nguồn học thuật khác
```

### Task 8: Final QA Checklist
Run through this checklist and fix any issues:

- [ ] `npm run build` succeeds with 0 errors
- [ ] `npm run dev` starts without warnings
- [ ] Gallery: 5 cards visible with watercolor images
- [ ] Gallery: hover effects work on all cards
- [ ] Detail: all 5 garment pages load correctly
- [ ] Detail: claims show status badges (checked/draft)
- [ ] Detail: contested claims show warning
- [ ] Detail: source citations expand and link to real URLs
- [ ] Detail: context fit visualization displays correctly
- [ ] Builder: all selector controls render
- [ ] Builder: score updates reactively on selection change
- [ ] Builder: correct rules fire for test combinations:
  - Áo tứ thân + Quai thao + Bắc Bộ → positive rule
  - Áo bà ba + Quai thao + Nam Bộ → warning rule
  - Áo nhật bình + Truyền thống → phục dựng note
  - Áo tấc + Sneaker + Kỷ yếu → Gen Z note
  - Áo dài + Tốt nghiệp + Guốc mộc → positive rule
- [ ] Responsive: mobile (375px) layout correct
- [ ] Responsive: tablet (768px) layout correct
- [ ] Responsive: desktop (1440px) layout correct
- [ ] No console errors
- [ ] All images load (no broken images)
- [ ] Dark theme consistent across all pages
- [ ] Fonts loaded (Playfair Display, Inter)
- [ ] Page transitions animate smoothly
- [ ] `npm test` passes all score engine tests

## Output (Files Modified)
- `src/components/Layout.jsx` [MODIFIED — add AnimatePresence]
- `src/components/GarmentCard.jsx` [MODIFIED — add animations]
- `src/components/ScorePanel.jsx` [MODIFIED — add animations]
- `src/components/Header.jsx` [MODIFIED — responsive hamburger]
- `vietphuc-app/index.html` [MODIFIED — SEO meta tags, fonts]
- `src/App.jsx` [MODIFIED — lazy loading]
- `vietphuc-app/README.md` [MODIFIED — project docs]
- `package.json` [MODIFIED — remove Three.js, add framer-motion]

## Acceptance Criteria
1. All items in Task 8 QA Checklist pass
2. `npm run build` produces < 500KB JS bundle (after Three.js removal)
3. No console errors or warnings in production build
4. App is fully functional offline (without Supabase credentials)
5. README is comprehensive and accurate
