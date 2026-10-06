import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#1B1B1B] text-[#F5F0E6] flex flex-col font-sans selection:bg-[#8B0000] selection:text-[#F5F0E6]">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="border-t border-[#333333] bg-[#141414] py-8 text-center text-sm text-[#F5F0E6]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span>🇻🇳</span>
            <span className="font-medium text-[#F5F0E6]/80">
              Việt Phục AI Arena — Bảo tồn & Phát huy Di sản Trang phục Dân tộc
            </span>
          </div>
          <div className="text-xs text-[#F5F0E6]/40">
            Dữ liệu tham khảo từ Bảo tàng Lịch sử Quốc gia và các nguồn học thuật
          </div>
        </div>
      </footer>
    </div>
  );
}
