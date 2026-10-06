import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';

const HomePage = lazy(() => import('./pages/HomePage'));
const GarmentPage = lazy(() => import('./pages/GarmentPage'));
const BuilderPage = lazy(() => import('./pages/BuilderPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#1B1B1B] flex items-center justify-center text-[#D99A16]">
            <div className="flex flex-col items-center gap-3">
              <span className="text-4xl animate-pulse">🇻🇳</span>
              <span className="text-sm font-semibold tracking-wider uppercase text-[#F5F0E6]/70 font-mono">
                Đang tải Việt Phục AI Arena...
              </span>
            </div>
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="garment/:id" element={<GarmentPage />} />
            <Route path="builder" element={<BuilderPage />} />
            <Route path="index.html" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
