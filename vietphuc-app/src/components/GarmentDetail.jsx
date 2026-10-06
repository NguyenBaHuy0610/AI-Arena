import { useState } from 'react';
import { Link } from 'react-router-dom';
import SourceCitation from './SourceCitation';
import { REGION_MAP, CONTEXT_MAP } from '../data';

const placeholderGradients = {
  'ao-dai': 'linear-gradient(135deg, #274B6D 0%, #1E3A5F 100%)',
  'ao-tu-than': 'linear-gradient(135deg, #6F4528 0%, #5B3924 100%)',
  'ao-ngu-than': 'linear-gradient(135deg, #B3212B 0%, #8B0000 100%)',
  'ao-nhat-binh': 'linear-gradient(135deg, #D99A16 0%, #B87E0A 100%)',
  'ao-ba-ba': 'linear-gradient(135deg, #242424 0%, #141414 100%)',
};

const partLabels = {
  'ao': 'Áo chính / Áo ngoài',
  'quan': 'Quần lụa',
  'yem': 'Yếm đào (nội y truyền thống)',
  'vay': 'Váy đụp',
  'that-lung': 'Thắt lưng vải / dải lụa',
  'khan-van': 'Khăn vấn đầu',
  'khan-ran': 'Khăn rằn Nam Bộ',
  'non-la': 'Nón lá truyền thống',
  'quai-thao': 'Nón quai thao (ba tầm)',
};

import { getGarmentImageUrl } from '../hooks/useSupabase';

export default function GarmentDetail({ garment, onBack }) {
  const [imgError, setImgError] = useState(false);

  if (!garment) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-[#F5F0E6]">Không tìm thấy thông tin trang phục</h2>
        <Link
          to="/"
          className="mt-4 inline-block px-6 py-2 rounded-lg bg-[#2A2A2A] hover:bg-[#333333] text-[#D99A16] border border-[#333333]"
        >
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  const regionNames = garment.regions
    ?.map(r => REGION_MAP[r]?.name?.vi || r)
    .join(', ') || 'Toàn quốc';

  const gradient = placeholderGradients[garment.id] || 'linear-gradient(135deg, #333333 0%, #1E1E1E 100%)';
  const imageUrl = garment.image_url || getGarmentImageUrl(garment.id);

  // Collect all unique source IDs mentioned in garment and claims
  const allSourceIds = Array.from(
    new Set([
      ...(garment.sourceIds || []),
      ...(garment.claims?.flatMap(c => c.sourceIds || []) || []),
    ])
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#222222] hover:bg-[#2A2A2A] border border-[#333333] text-sm text-[#F5F0E6] hover:text-[#D99A16] transition-all cursor-pointer shadow-sm active:scale-95"
        >
          <span>←</span>
          <span>Quay lại Bộ sưu tập</span>
        </Link>

        <div className="flex items-center gap-2">
          {garment.status === 'checked' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">
              <span>✓</span> Đã thẩm định học thuật
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-700/50">
              <span>📝</span> Bản thảo đang hoàn thiện
            </span>
          )}
        </div>
      </div>

      {/* Main Two-Column Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Garment Visual Artwork */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="relative rounded-3xl bg-[#222222] border border-[#333333] overflow-hidden shadow-2xl flex items-center justify-center p-3 aspect-[3/4]">
            {!imgError ? (
              <img
                src={imageUrl}
                alt={garment.name?.vi}
                className="w-full h-full object-cover object-center rounded-2xl"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-8 text-center"
                style={{ background: gradient }}
              >
                <div className="w-24 h-24 rounded-full bg-black/30 flex items-center justify-center text-5xl mb-4 border border-white/10 backdrop-blur-sm">
                  👘
                </div>
                <h3 className="text-2xl font-bold font-display text-[#F5F0E6]">
                  {garment.name?.vi}
                </h3>
                <p className="text-xs text-[#F5F0E6]/60 mt-2 max-w-xs">
                  Minh họa màu nước nghệ thuật 2D theo nghiên cứu phục dựng lịch sử
                </p>
              </div>
            )}

            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-[#F5F0E6]/80 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#D99A16] uppercase font-bold tracking-widest block">
                  Phong cách
                </span>
                <span className="font-medium">Minh họa phẳng 2D chính diện</span>
              </div>
              <span className="text-xl">🇻🇳</span>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="p-4 rounded-2xl bg-[#222222] border border-[#333333] grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <span className="text-[#F5F0E6]/50 block text-[11px]">Niên đại</span>
              <span className="font-semibold text-[#D99A16] mt-0.5 block">{garment.period?.from ? `Thế kỷ ${garment.period.from}` : 'Truyền thống'}</span>
            </div>
            <div className="border-x border-[#333333]">
              <span className="text-[#F5F0E6]/50 block text-[11px]">Đối tượng</span>
              <span className="font-semibold text-[#F5F0E6] mt-0.5 block">
                {garment.wearer === 'nu' ? 'Phụ nữ' : garment.wearer === 'nam' ? 'Nam giới' : 'Cả nam & nữ'}
              </span>
            </div>
            <div>
              <span className="text-[#F5F0E6]/50 block text-[11px]">Phân loại</span>
              <span className="font-semibold text-[#F5F0E6] mt-0.5 block capitalize">
                {garment.category?.replace(/-/g, ' ') || 'Cổ phục'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Cultural & Structural Specs */}
        <div className="lg:col-span-7 space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#8B0000]/30 text-[#D99A16] border border-[#8B0000]/50">
                📍 {regionNames}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#2A2A2A] text-[#F5F0E6]/80 border border-[#333333]">
                📅 {garment.period?.label}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-[#F5F0E6] tracking-tight">
              {garment.name?.vi}
            </h1>

            {garment.name?.aliases && garment.name.aliases.length > 0 && (
              <p className="text-sm text-[#F5F0E6]/50 mt-1 italic">
                Tên gọi khác: {garment.name.aliases.join(', ')}
              </p>
            )}
          </div>

          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-[#222222] border-l-4 border-l-[#D99A16] border border-[#333333]">
            <h3 className="text-xs uppercase tracking-wider font-bold text-[#D99A16] mb-2 flex items-center gap-1.5">
              <span>📜</span> Tổng quan di sản
            </h3>
            <p className="text-sm sm:text-base text-[#F5F0E6]/90 leading-relaxed">
              {garment.summary}
            </p>
          </div>

          {/* Cấu trúc & Bộ phận (Structural Components) */}
          {garment.parts && garment.parts.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#222222] border border-[#333333] space-y-3">
              <h3 className="text-sm uppercase tracking-wider font-bold text-[#F5F0E6] flex items-center gap-2">
                <span>✂️</span> Cấu trúc & Thành phần trang phục
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {garment.parts.map((part) => (
                  <div
                    key={part}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1B1B1B] border border-[#333333] text-xs"
                  >
                    <span className="text-[#D99A16] font-bold">▪</span>
                    <span className="text-[#F5F0E6] font-medium">{partLabels[part] || part}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phù hợp bối cảnh (Context Fit Rating) */}
          {garment.contextFit && Object.keys(garment.contextFit).length > 0 && (
            <div className="p-5 rounded-2xl bg-[#222222] border border-[#333333] space-y-4">
              <h3 className="text-sm uppercase tracking-wider font-bold text-[#F5F0E6] flex items-center gap-2">
                <span>🏛️</span> Độ phù hợp theo bối cảnh
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(garment.contextFit).map(([ctxKey, level]) => {
                  const ctxInfo = CONTEXT_MAP[ctxKey];
                  const label = ctxInfo?.name?.vi || ctxKey;
                  return (
                    <div
                      key={ctxKey}
                      className="p-3 rounded-xl bg-[#1B1B1B] border border-[#333333] flex items-center justify-between"
                    >
                      <span className="text-xs font-medium text-[#F5F0E6]">{label}</span>
                      <div className="flex items-center gap-1.5">
                        {level === 2 ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-700/50">
                            ●● Rất phù hợp
                          </span>
                        ) : level === 1 ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-950 text-amber-400 border border-amber-700/50">
                            ● Phù hợp
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] text-[#F5F0E6]/40 border border-[#333333]">
                            ○ Ít phù hợp
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Nhận định học thuật & Khảo chứng (Academic Claims) */}
          {garment.claims && garment.claims.length > 0 && (
            <div className="p-5 rounded-2xl bg-[#222222] border border-[#333333] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-sm uppercase tracking-wider font-bold text-[#F5F0E6] flex items-center gap-2">
                  <span>🔬</span> Nhận định học thuật & Khảo chứng
                </h3>
                <span className="text-xs text-[#D99A16] font-medium">
                  {garment.claims.length} nhận định đã tra cứu
                </span>
              </div>

              <div className="space-y-3">
                {garment.claims.map((claim, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      claim.contested
                        ? 'bg-amber-950/20 border-amber-600/40 text-amber-200/90'
                        : 'bg-[#1B1B1B] border-[#333333] text-[#F5F0E6]/90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {claim.status === 'checked' ? (
                          <span className="text-emerald-400 font-bold text-sm">✓</span>
                        ) : (
                          <span className="text-amber-400 font-bold text-sm">📝</span>
                        )}
                        <span className="font-semibold uppercase tracking-wider text-[10px] text-[#D99A16]">
                          {claim.key || 'Khảo chứng'}
                        </span>
                      </div>

                      {claim.sourceIds && claim.sourceIds.length > 0 && (
                        <SourceCitation sourceIds={claim.sourceIds} />
                      )}
                    </div>

                    <p className="leading-relaxed pl-5">{claim.text}</p>

                    {claim.contested && (
                      <div className="mt-2 pl-5 pt-2 border-t border-amber-600/30 text-[11px] text-amber-300/80 flex items-center gap-1.5">
                        <span>⚠️</span>
                        <span>
                          <strong>Lưu ý học thuật:</strong> Vấn đề này có nhiều luồng nhận định khác nhau trong giới nghiên cứu phục dựng.
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ghi chú màu sắc (Color Notes) */}
          {garment.colorNotes && garment.colorNotes.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#222222] border border-[#333333] text-xs space-y-2">
              <h4 className="font-bold text-[#D99A16] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <span>🎨</span> Ghi chú về sắc diện và màu sắc truyền thống:
              </h4>
              <ul className="space-y-2 text-[#F5F0E6]/80">
                {garment.colorNotes.map((note, idx) => (
                  <li key={idx} className="flex items-start justify-between gap-2 p-2 bg-[#1B1B1B] rounded-lg border border-[#333333]/60">
                    <span className="leading-relaxed">
                      ▪ {typeof note === 'object' ? note.text : note}
                    </span>
                    {typeof note === 'object' && note.sourceIds && note.sourceIds.length > 0 && (
                      <SourceCitation sourceIds={note.sourceIds} />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tất cả nguồn tham chiếu tổng thể */}
          {allSourceIds.length > 0 && (
            <div className="pt-2 flex items-center justify-between border-t border-[#333333] text-xs">
              <span className="text-[#F5F0E6]/60">Nguồn trích dẫn học thuật cho trang phục này:</span>
              <SourceCitation sourceIds={allSourceIds} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
