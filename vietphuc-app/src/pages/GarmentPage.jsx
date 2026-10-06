import { useParams, useNavigate } from 'react-router-dom';
import { getGarment } from '../data';
import GarmentDetail from '../components/GarmentDetail';

export default function GarmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const garment = getGarment(id);

  if (!garment) {
    return (
      <div className="py-20 text-center space-y-4">
        <div className="text-5xl">👘</div>
        <h2 className="text-2xl font-bold font-display text-[#F5F0E6]">Không tìm thấy trang phục</h2>
        <p className="text-sm text-[#F5F0E6]/60 max-w-md mx-auto">
          Mã trang phục &quot;{id}&quot; không có trong cơ sở dữ liệu hoặc đang được cập nhật.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-6 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] text-[#D99A16] border border-[#333333] text-sm font-medium transition-all"
        >
          ← Quay lại Trang chủ
        </button>
      </div>
    );
  }

  return (
    <GarmentDetail
      garment={garment}
      onBack={() => navigate('/')}
    />
  );
}
