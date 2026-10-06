import { motion, AnimatePresence } from 'framer-motion';
import SourceCitation from './SourceCitation';

export default function ScorePanel({
  culturalScore = 100,
  grade = 'A',
  alerts = [],
  positives = [],
  warnings = [],
}) {
  const getGradeColor = (g) => {
    switch (g) {
      case 'A':
        return 'text-emerald-400 bg-emerald-950/80 border-emerald-600/60 shadow-emerald-900/30';
      case 'B':
        return 'text-sky-400 bg-sky-950/80 border-sky-600/60 shadow-sky-900/30';
      case 'C':
        return 'text-amber-400 bg-amber-950/80 border-amber-600/60 shadow-amber-900/30';
      default:
        return 'text-rose-400 bg-rose-950/80 border-rose-600/60 shadow-rose-900/30';
    }
  };

  const getScoreBarColor = (score) => {
    if (score >= 90) return 'from-emerald-500 to-teal-400';
    if (score >= 70) return 'from-sky-500 to-indigo-400';
    if (score >= 50) return 'from-amber-500 to-orange-400';
    return 'from-rose-600 to-red-500';
  };

  const getLevelBadge = (level) => {
    switch (level) {
      case 2:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700/60 flex items-center gap-1">
            <span>🚨</span> Cảnh báo lệch chuẩn (Cấp 2)
          </span>
        );
      case 1:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-700/60 flex items-center gap-1">
            <span>⚠️</span> Chú giải phục dựng (Cấp 1)
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-600 flex items-center gap-1">
            <span>💡</span> Gợi ý thẩm mỹ
          </span>
        );
    }
  };

  return (
    <div className="sticky top-24 rounded-3xl bg-[#222222] border border-[#333333] p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#333333]">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <h3 className="text-lg font-bold font-display text-[#F5F0E6]">
            Đánh Giá Văn Hóa
          </h3>
        </div>
        <span className="text-xs text-[#F5F0E6]/50">Bộ máy chấm điểm AI</span>
      </div>

      {/* Main Score Showcase */}
      <div className="flex flex-col items-center justify-center py-4 bg-[#1B1B1B] rounded-2xl border border-[#333333]/80 p-5 space-y-3">
        <div className="flex items-baseline gap-3">
          <motion.span
            key={culturalScore}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="text-5xl sm:text-6xl font-black font-display tracking-tight text-[#F5F0E6]"
          >
            {culturalScore}
          </motion.span>
          <span className="text-lg text-[#F5F0E6]/40 font-medium">/ 100</span>
          <motion.span
            key={grade}
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className={`ml-2 px-3 py-1 rounded-xl text-lg font-extrabold border shadow-lg ${getGradeColor(
              grade
            )}`}
          >
            Hạng {grade}
          </motion.span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#2A2A2A] rounded-full h-3 overflow-hidden p-0.5 border border-white/5">
          <motion.div
            className={`h-full rounded-full bg-gradient-to-r ${getScoreBarColor(
              culturalScore
            )}`}
            initial={{ width: 0 }}
            animate={{ width: `${culturalScore}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>

        <p className="text-xs text-[#F5F0E6]/60 text-center">
          {culturalScore >= 90
            ? 'Bộ trang phục kết hợp hài hòa, tôn trọng đặc trưng văn hóa lịch sử.'
            : culturalScore >= 70
            ? 'Kết hợp cơ bản phù hợp, có thể tinh chỉnh phụ kiện để chuẩn xác hơn.'
            : culturalScore >= 50
            ? 'Có yếu tố lai tạp hoặc lệch bối cảnh/vùng miền truyền thống.'
            : 'Phối đồ xung đột nghiêm trọng với các quy tắc nhận diện văn hóa.'}
        </p>
      </div>

      {/* Breakdown: Positives */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-400">
          <span className="flex items-center gap-1.5">
            <span>✅</span> Điểm cộng văn hóa ({positives.length})
          </span>
        </div>

        <AnimatePresence>
          {positives.length > 0 ? (
            <div className="space-y-2.5">
              {positives.map((p, idx) => (
                <motion.div
                  key={p.id || idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-700/40 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-sm">
                      +{p.delta} điểm
                    </span>
                    {p.sourceIds && p.sourceIds.length > 0 && (
                      <SourceCitation sourceIds={p.sourceIds} />
                    )}
                  </div>
                  <p className="text-[#F5F0E6]/90 leading-relaxed">{p.message}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[#F5F0E6]/40 italic pl-1">
              Chưa kích hoạt quy tắc cộng điểm đặc biệt nào.
            </p>
          )}
        </AnimatePresence>
      </div>

      {/* Breakdown: Warnings & Cautions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-400">
          <span className="flex items-center gap-1.5">
            <span>⚠️</span> Lưu ý & Cảnh báo ({warnings.length})
          </span>
        </div>

        <AnimatePresence>
          {warnings.length > 0 ? (
            <div className="space-y-2.5">
              {warnings.map((w, idx) => (
                <motion.div
                  key={w.id || idx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`p-3.5 rounded-xl text-xs space-y-2 border ${
                    w.level === 2
                      ? 'bg-rose-950/20 border-rose-700/50 text-rose-200'
                      : 'bg-amber-950/20 border-amber-700/50 text-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      {getLevelBadge(w.level)}
                      {w.delta < 0 && (
                        <span className="font-bold text-rose-400 text-xs">
                          {w.delta} điểm
                        </span>
                      )}
                    </div>
                    {w.sourceIds && w.sourceIds.length > 0 && (
                      <SourceCitation sourceIds={w.sourceIds} />
                    )}
                  </div>
                  <p className="text-[#F5F0E6]/90 leading-relaxed">{w.message}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-3 bg-[#1B1B1B] rounded-xl border border-emerald-800/40 text-xs text-emerald-400/90 flex items-center gap-2">
              <span>✨</span>
              <span>Không có cảnh báo lệch chuẩn nào cho lựa chọn hiện tại.</span>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
