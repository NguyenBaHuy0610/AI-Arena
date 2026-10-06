import { useState, useMemo } from 'react';
import OutfitBuilder from '../components/OutfitBuilder';
import ScorePanel from '../components/ScorePanel';
import { RULES } from '../data';
import { evaluateOutfit } from '../engine/scoreEngine';
import { useSaveOutfit } from '../hooks/useSupabase';
import { isSupabaseConfigured } from '../lib/supabase';

const INITIAL_OUTFIT = {
  garmentId: 'ao-dai',
  accessories: [],
  shoes: null,
  color: null,
  context: null,
  style: null,
  region: null,
};

const PRESETS = [
  {
    name: 'Áo dài Tết truyền thống',
    outfit: {
      garmentId: 'ao-dai',
      accessories: ['non-la'],
      shoes: 'guoc-moc',
      color: 'do-son',
      context: 'tet',
      style: 'truyen-thong',
      region: 'viet-phuc',
    },
  },
  {
    name: 'Áo bà ba Nam Bộ chuẩn xác',
    outfit: {
      garmentId: 'ao-ba-ba',
      accessories: ['khan-ran', 'non-la'],
      shoes: 'guoc-moc',
      color: 'den',
      context: 'pho-co',
      style: 'truyen-thong',
      region: 'nam-bo',
    },
  },
  {
    name: 'Cảnh báo: Áo bà ba + Quai thao Nam Bộ',
    outfit: {
      garmentId: 'ao-ba-ba',
      accessories: ['quai-thao'],
      shoes: null,
      color: null,
      context: null,
      style: null,
      region: 'nam-bo',
    },
  },
  {
    name: 'Áo nhật bình phục dựng',
    outfit: {
      garmentId: 'ao-nhat-binh',
      accessories: ['khan-van'],
      shoes: 'guoc-moc',
      color: 'vang-nghe',
      context: 'ky-yeu',
      style: 'truyen-thong',
      region: 'hue-trung-bo',
    },
  },
];

export default function BuilderPage() {
  const [outfit, setOutfit] = useState(INITIAL_OUTFIT);
  const [saveStatus, setSaveStatus] = useState(null);
  const { saveOutfit, saving } = useSaveOutfit();

  const evaluation = useMemo(
    () => evaluateOutfit(outfit, RULES),
    [outfit]
  );

  const handleSaveToCloud = async () => {
    const result = await saveOutfit(outfit, evaluation);
    if (result) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3500);
    } else {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 4000);
    }
  };

  return (
    <div className="space-y-8 py-4">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#333333]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B0000]/20 border border-[#8B0000]/40 text-[#D99A16] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>⚖️</span> Trắc Nghiệm Văn Hóa
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#F5F0E6] tracking-tight">
            Xưởng Phối Đồ & Chấm Điểm
          </h1>
          <p className="mt-1 text-sm text-[#F5F0E6]/70 max-w-xl">
            Tự do thử nghiệm các bộ phối trang phục, phụ kiện và bối cảnh để kiểm tra mức độ chuẩn mực dựa trên 9 quy tắc văn hóa khảo chứng.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            disabled={saving}
            onClick={handleSaveToCloud}
            className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-xs font-semibold text-emerald-300 border border-emerald-600/60 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            {saving ? (
              <span>⏳ Đang lưu...</span>
            ) : (
              <>
                <span>☁️</span>
                <span>Lưu lên Supabase</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setOutfit(INITIAL_OUTFIT)}
            className="px-4 py-2 rounded-xl bg-[#2A2A2A] hover:bg-[#333333] text-xs text-[#F5F0E6]/80 hover:text-[#F5F0E6] border border-[#444444] transition-all cursor-pointer"
          >
            ↺ Đặt lại
          </button>
        </div>
      </div>

      {saveStatus === 'success' && (
        <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
          <span>✅</span> Đã lưu bộ phối trang phục và điểm số thành công lên cơ sở dữ liệu Supabase!
        </div>
      )}
      {saveStatus === 'error' && (
        <div className="p-3 bg-amber-950/80 border border-amber-600 text-amber-300 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
          <span>⚠️</span> Chưa lưu được vào Supabase (bạn cần chạy đoạn SQL tạo bảng `outfit_scores` trên Supabase SQL Editor).
        </div>
      )}

      {/* Preset Suggestions */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[#D99A16] font-semibold">Gợi ý phối mẫu:</span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setOutfit(preset.outfit)}
            className="px-3 py-1.5 rounded-lg bg-[#222222] hover:bg-[#2F2F2F] text-[#F5F0E6]/80 hover:text-[#D99A16] border border-[#3A3A3A] transition-all cursor-pointer text-xs"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-8">
          <OutfitBuilder outfit={outfit} onChange={setOutfit} />
        </div>

        {/* Right: Score Evaluation Panel */}
        <div className="lg:col-span-4">
          <ScorePanel {...evaluation} />
        </div>
      </div>
    </div>
  );
}
