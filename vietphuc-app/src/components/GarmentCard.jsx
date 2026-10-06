import { useState } from 'react';
import { motion } from 'framer-motion';
import { REGION_MAP } from '../data';

const placeholderGradients = {
  'ao-dai': 'linear-gradient(135deg, #274B6D 0%, #1E3A5F 100%)',
  'ao-tu-than': 'linear-gradient(135deg, #6F4528 0%, #5B3924 100%)',
  'ao-ngu-than': 'linear-gradient(135deg, #B3212B 0%, #8B0000 100%)',
  'ao-nhat-binh': 'linear-gradient(135deg, #D99A16 0%, #B87E0A 100%)',
  'ao-ba-ba': 'linear-gradient(135deg, #242424 0%, #141414 100%)',
};

import { getGarmentImageUrl } from '../hooks/useSupabase';

export default function GarmentCard({ garment, onClick }) {
  const [imgError, setImgError] = useState(false);

  if (!garment) return null;

  const primaryRegion = garment.regions?.[0];
  const regionName = REGION_MAP[primaryRegion]?.name?.vi || primaryRegion || 'Toàn quốc';
  const gradient = placeholderGradients[garment.id] || 'linear-gradient(135deg, #333333 0%, #1E1E1E 100%)';
  const imageUrl = garment.image_url || getGarmentImageUrl(garment.id);

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className="group relative flex flex-col rounded-2xl bg-[#222222] border border-[#333333] hover:border-[#D99A16] overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-[#D99A16]/10"
      style={{ minHeight: '380px' }}
    >
      {/* Visual illustration / placeholder area */}
      <div className="relative w-full h-64 overflow-hidden flex items-center justify-center bg-[#171717]">
        {!imgError ? (
          <img
            src={imageUrl}
            alt={garment.name?.vi || 'Trang phục Việt'}
            className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-500 ease-out p-1"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center p-6 text-center"
            style={{ background: gradient }}
          >
            <div className="w-16 h-16 rounded-full bg-black/20 flex items-center justify-center text-3xl mb-2 backdrop-blur-xs border border-white/10">
              👘
            </div>
            <span className="text-xs uppercase tracking-widest text-[#F5F0E6]/80 font-semibold">
              {garment.name?.vi}
            </span>
            <span className="text-[10px] text-[#F5F0E6]/50 mt-1">Minh họa phẳng 2D</span>
          </div>
        )}

        {/* Gradient overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#222222] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-[#D99A16] backdrop-blur-md border border-[#D99A16]/30">
            {regionName}
          </span>
          {garment.status === 'checked' ? (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/50 backdrop-blur-md">
              ✓ Đã thẩm định
            </span>
          ) : (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/50 backdrop-blur-md">
              Bản thảo
            </span>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="text-xl font-bold font-display text-[#F5F0E6] group-hover:text-[#D99A16] transition-colors leading-tight">
              {garment.name?.vi}
            </h3>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-[#D99A16]/90 font-medium">
              📅 {garment.period?.label || 'Truyền thống'}
            </span>
            <span className="text-xs text-[#F5F0E6]/40">•</span>
            <span className="text-xs text-[#F5F0E6]/60">
              {garment.wearer === 'nu' ? 'Dành cho nữ' : garment.wearer === 'nam' ? 'Dành cho nam' : 'Nam & Nữ'}
            </span>
          </div>

          <p className="mt-3 text-xs text-[#F5F0E6]/75 line-clamp-2 leading-relaxed">
            {garment.summary}
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#333333]/80 flex items-center justify-between text-xs">
          <span className="text-[#D99A16] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1 font-medium">
            Xem chi tiết <span>→</span>
          </span>
          {garment.claims && (
            <span className="text-[11px] text-[#F5F0E6]/40">
              {garment.claims.length} nhận định
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
