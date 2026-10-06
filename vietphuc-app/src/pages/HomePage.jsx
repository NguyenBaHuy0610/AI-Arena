import { Link } from 'react-router-dom';
import { useGarments } from '../hooks/useSupabase';
import { GARMENTS } from '../data';
import GarmentGallery from '../components/GarmentGallery';

export default function HomePage() {
  const { garments } = useGarments();
  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#251A1A] via-[#1E1B1B] to-[#171717] border border-[#8B0000]/40 p-8 sm:p-12 lg:p-16 text-center shadow-2xl">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#D99A16_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8B0000]/40 border border-[#D99A16]/40 text-[#D99A16] text-xs sm:text-sm font-semibold tracking-wider uppercase">
            <span>🇻🇳</span> Dự án Số hóa & Thẩm định Di sản Trang phục
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-display tracking-tight text-[#F5F0E6] leading-tight">
            Việt Phục <span className="text-[#D99A16]">AI Arena</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-[#F5F0E6]/80 max-w-2xl mx-auto leading-relaxed">
            Hồi sinh và thẩm định cổ phục Việt qua góc nhìn nghệ thuật 2D và trí tuệ nhân tạo. Khám phá kết cấu, bối cảnh và phối đồ chuẩn xác theo nghiên cứu lịch sử.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/builder"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B0000] to-[#B3212B] hover:from-[#A00000] hover:to-[#C42732] text-[#F5F0E6] font-semibold text-sm sm:text-base border border-[#D99A16]/40 shadow-lg shadow-[#8B0000]/30 transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              Phối đồ & Chấm điểm văn hóa ↗
            </Link>
            <a
              href="#gallery"
              className="px-6 py-3 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] text-[#F5F0E6] font-medium text-sm sm:text-base border border-[#444444] transition-all"
            >
              Khám phá 5 bộ trang phục ↓
            </a>
          </div>

          {/* Key Feature Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#333333]/80 text-left">
            <div className="p-3 bg-[#1B1B1B]/70 rounded-xl border border-[#333333]/50">
              <span className="text-2xl font-bold text-[#D99A16] block font-display">5</span>
              <span className="text-xs text-[#F5F0E6]/70">Trang phục tiêu biểu ba miền</span>
            </div>
            <div className="p-3 bg-[#1B1B1B]/70 rounded-xl border border-[#333333]/50">
              <span className="text-2xl font-bold text-[#D99A16] block font-display">2D</span>
              <span className="text-xs text-[#F5F0E6]/70">Minh họa phẳng 2D chính diện</span>
            </div>
            <div className="p-3 bg-[#1B1B1B]/70 rounded-xl border border-[#333333]/50">
              <span className="text-2xl font-bold text-[#D99A16] block font-display">9+</span>
              <span className="text-xs text-[#F5F0E6]/70">Quy tắc chấm điểm văn hóa</span>
            </div>
            <div className="p-3 bg-[#1B1B1B]/70 rounded-xl border border-[#333333]/50">
              <span className="text-2xl font-bold text-[#D99A16] block font-display">20+</span>
              <span className="text-xs text-[#F5F0E6]/70">Nguồn bảo tàng & học thuật</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <div id="gallery">
        <GarmentGallery garments={garments || GARMENTS} />
      </div>
    </div>
  );
}
