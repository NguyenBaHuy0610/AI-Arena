# JOB-01: Project Scaffold & Component Structure

## Goal
Restructure `vietphuc-app/src/` from a monolithic single-file (`App.jsx` — 386 lines) into a clean, modular component architecture. Remove the 3D rendering pipeline and set up routing for a 2D gallery-based experience.

## Dependencies
- **None** — this is the first job

## Input (Read These Files First)
- `vietphuc-app/package.json` — current dependencies
- `vietphuc-app/src/App.jsx` — current monolithic component (understand the existing data structures and UI patterns)
- `vietphuc-app/src/main.jsx` — entry point
- `vietphuc-app/src/index.css` — current TailwindCSS import
- `vietphuc-app/vite.config.js` — current Vite config with @tailwindcss/vite plugin

## Tasks

### Task 1: Install New Dependencies
```bash
cd vietphuc-app
npm install react-router-dom
```

### Task 2: Create Directory Structure
Create these directories inside `vietphuc-app/src/`:
```
src/
├── components/       # Reusable UI components
├── data/             # Data imports & normalization
├── engine/           # Score calculation logic
├── hooks/            # Custom React hooks
├── lib/              # Third-party client initialization
├── pages/            # Route-level page components
└── assets/           # Static assets (temporary image placeholders)
```

### Task 3: Create Layout Components

#### `src/components/Layout.jsx`
- Full-screen wrapper with dark theme background
- Vietnamese-inspired color scheme: deep reds (#8B0000), golds (#D99A16), cream (#F5F0E6)
- Include a `<Header />` and `<main>` content area
- Use `<Outlet />` from react-router-dom for nested routing

#### `src/components/Header.jsx`
- App title: "Việt Phục AI Arena"
- Navigation links: "Giới thiệu" (→ `/`), "Phối đồ" (→ `/builder`)
- Responsive: hamburger menu on mobile
- Vietnamese flag emoji or custom logo
- Sticky top position

### Task 4: Create Stub Components
Create the following files with minimal placeholder implementations (a div with the component name):

- `src/components/GarmentCard.jsx` — Props: `{ garment, onClick }`
- `src/components/GarmentGallery.jsx` — Props: `{ garments }`
- `src/components/GarmentDetail.jsx` — Props: `{ garment, sources }`
- `src/components/OutfitBuilder.jsx` — Props: `{ garments, accessories, rules }`
- `src/components/ScorePanel.jsx` — Props: `{ score, alerts, grade }`
- `src/components/SourceCitation.jsx` — Props: `{ sourceIds, sources }`
- `src/pages/HomePage.jsx` — Renders `<GarmentGallery />`
- `src/pages/GarmentPage.jsx` — Renders `<GarmentDetail />` based on route param `:id`
- `src/pages/BuilderPage.jsx` — Renders `<OutfitBuilder />` + `<ScorePanel />`

### Task 5: Set Up Routing in App.jsx
Replace the entire content of `App.jsx` with a React Router setup:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import GarmentPage from './pages/GarmentPage';
import BuilderPage from './pages/BuilderPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="garment/:id" element={<GarmentPage />} />
          <Route path="builder" element={<BuilderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### Task 6: Update index.css
Keep the existing `@import "tailwindcss";` and add custom design tokens:

```css
@import "tailwindcss";

/* Vietnamese-inspired design tokens */
:root {
  --color-primary: #8B0000;        /* Đỏ son */
  --color-primary-light: #B3212B;
  --color-gold: #D99A16;           /* Vàng nghệ */
  --color-cream: #F5F0E6;          /* Trắng ngà */
  --color-indigo: #274B6D;         /* Xanh chàm */
  --color-brown: #6F4528;          /* Nâu gụ */
  --color-dark: #1B1B1B;
  --color-dark-surface: #2A2A2A;
  --color-dark-card: #333333;

  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}
```

### Task 7: Clean Up
- Do NOT delete `App.css` yet (may have useful styles)
- Do NOT remove Three.js packages from `package.json` yet (JOB-07 will clean up)
- Preserve all files in `data/` directory (they are used by JOB-02)

## Output (Files Created/Modified)
- `src/components/Layout.jsx` [NEW]
- `src/components/Header.jsx` [NEW]
- `src/components/GarmentCard.jsx` [NEW]
- `src/components/GarmentGallery.jsx` [NEW]
- `src/components/GarmentDetail.jsx` [NEW]
- `src/components/OutfitBuilder.jsx` [NEW]
- `src/components/ScorePanel.jsx` [NEW]
- `src/components/SourceCitation.jsx` [NEW]
- `src/pages/HomePage.jsx` [NEW]
- `src/pages/GarmentPage.jsx` [NEW]
- `src/pages/BuilderPage.jsx` [NEW]
- `src/App.jsx` [MODIFIED — replaced with router]
- `src/index.css` [MODIFIED — added design tokens]
- `package.json` [MODIFIED — added react-router-dom]

## Acceptance Criteria
1. `npm run build` completes without errors
2. `npm run dev` starts the dev server
3. Navigating to `/` shows the HomePage stub
4. Navigating to `/garment/ao-dai` shows the GarmentPage stub
5. Navigating to `/builder` shows the BuilderPage stub
6. Header navigation links work correctly
7. No Three.js rendering code runs (the 3D canvas is gone from App.jsx)
