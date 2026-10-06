import { useState } from 'react';
import { getSource } from '../data';

export default function SourceCitation({ sourceIds = [], inline = false }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!sourceIds || sourceIds.length === 0) {
    return null;
  }

  const sources = sourceIds.map(id => getSource(id));

  const getReliabilityBadge = (rel) => {
    switch (rel) {
      case 'A':
        return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-700/50">🟢 Cấp A (Học thuật)</span>;
      case 'B':
        return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-400 border border-amber-700/50">🟡 Cấp B (Báo chí)</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-rose-950/80 text-rose-400 border border-rose-700/50">🔴 Cấp C (Đang duyệt)</span>;
    }
  };

  return (
    <div className={`relative ${inline ? 'inline-block' : 'block'}`}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#242424] hover:bg-[#333333] border border-[#D99A16]/30 text-xs text-[#D99A16] font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
        title="Bấm để xem danh sách tài liệu tham chiếu"
      >
        <span>📚</span>
        <span>{sourceIds.length} nguồn</span>
        <svg
          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
          />
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 mt-2 w-80 sm:w-96 max-h-80 overflow-y-auto z-50 p-4 bg-[#222222] border border-[#444444] rounded-xl shadow-2xl space-y-3 text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#333333]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F5F0E6]/70 flex items-center gap-1.5">
                <span>📖</span> Danh mục nguồn tham chiếu
              </h4>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-[#F5F0E6]/50 hover:text-[#F5F0E6] text-xs px-1.5 py-0.5 rounded hover:bg-[#333333]"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              {sources.map((src, idx) => (
                <div key={src.id || idx} className="p-2.5 bg-[#1B1B1B] rounded-lg border border-[#333333] space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    {src.url ? (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[#F5F0E6] hover:text-[#D99A16] hover:underline leading-snug"
                      >
                        {src.title} ↗
                      </a>
                    ) : (
                      <span className="font-medium text-[#F5F0E6] leading-snug">{src.title}</span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#F5F0E6]/60">
                    <span className="text-[#D99A16]/90 font-medium">{src.publisher || 'Nguồn khảo cứu'}</span>
                    {src.accessed && <span>• Truy cập: {src.accessed}</span>}
                  </div>

                  <div className="pt-1 flex items-center justify-between">
                    {getReliabilityBadge(src.reliability)}
                    {src.license && (
                      <span className="text-[10px] text-[#F5F0E6]/40 uppercase tracking-wider font-mono">
                        {src.license}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
