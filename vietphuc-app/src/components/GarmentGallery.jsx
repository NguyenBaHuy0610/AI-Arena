import { useNavigate } from 'react-router-dom';
import GarmentCard from './GarmentCard';

export default function GarmentGallery({ garments = [] }) {
  const navigate = useNavigate();

  return (
    <section className="space-y-8 py-6">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B0000]/20 border border-[#8B0000]/40 text-[#D99A16] text-xs font-semibold uppercase tracking-wider">
          <span>✨</span> Di Sản Trang Phục Ba Miền
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F5F0E6] tracking-tight">
          Trang Phục Truyền Thống Việt Nam
        </h2>
        <p className="text-sm sm:text-base text-[#F5F0E6]/70 leading-relaxed">
          Khám phá 5 bộ trang phục tiêu biểu đại diện cho dòng chảy văn hóa ngàn năm, kết hợp giữa khảo cứu lịch sử và nghệ thuật minh họa màu nước 2D.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {garments.map((garment) => (
          <GarmentCard
            key={garment.id}
            garment={garment}
            onClick={() => navigate(`/garment/${garment.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
