import {
  GARMENTS,
  ACCESSORIES_BY_TYPE,
  COLORS,
  CONTEXTS,
  REGIONS,
  STYLES,
} from '../data';

const SHOES_LIST = [
  { id: 'guoc-moc', name: 'Guốc mộc truyền thống', icon: '🪵' },
  { id: 'sneaker', name: 'Giày sneaker hiện đại', icon: '👟' },
  { id: 'giay-da', name: 'Giày da cổ điển', icon: '👞' },
];

export default function OutfitBuilder({ outfit, onChange }) {
  const handleGarmentChange = (garmentId) => {
    onChange({ ...outfit, garmentId });
  };

  const handleAccessoryToggle = (accId) => {
    const current = outfit.accessories || [];
    const updated = current.includes(accId)
      ? current.filter((id) => id !== accId)
      : [...current, accId];
    onChange({ ...outfit, accessories: updated });
  };

  const handleShoesChange = (shoeId) => {
    onChange({ ...outfit, shoes: outfit.shoes === shoeId ? null : shoeId });
  };

  const handleColorChange = (colorId) => {
    onChange({ ...outfit, color: outfit.color === colorId ? null : colorId });
  };

  const handleContextChange = (contextId) => {
    onChange({ ...outfit, context: outfit.context === contextId ? null : contextId });
  };

  const handleRegionChange = (regionId) => {
    onChange({ ...outfit, region: outfit.region === regionId ? null : regionId });
  };

  const handleStyleChange = (styleId) => {
    onChange({ ...outfit, style: outfit.style === styleId ? null : styleId });
  };

  return (
    <div className="space-y-8 bg-[#222222] border border-[#333333] rounded-3xl p-6 sm:p-8 shadow-xl">
      {/* Section 1: Garment Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-bold font-display text-[#F5F0E6] flex items-center gap-2">
            <span>👘</span> 1. Chọn Trang Phục Chính
          </label>
          <span className="text-xs text-[#D99A16] font-medium">Bắt buộc</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {GARMENTS.map((g) => {
            const isSelected = outfit.garmentId === g.id;
            return (
              <button
                key={g.id}
                type="button"
                onClick={() => handleGarmentChange(g.id)}
                className={`flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B0000]/30 border-[#D99A16] shadow-md shadow-[#D99A16]/20 ring-1 ring-[#D99A16]'
                    : 'bg-[#1B1B1B] border-[#333333] hover:border-[#555555] hover:bg-[#262626]'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center text-xl mb-2">
                  👘
                </div>
                <span className="font-bold text-xs text-[#F5F0E6] leading-tight">
                  {g.name?.vi}
                </span>
                <span className="text-[10px] text-[#F5F0E6]/50 mt-1 line-clamp-1">
                  {g.period?.label || 'Truyền thống'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Accessories Selection */}
      <div className="space-y-4 pt-6 border-t border-[#333333]">
        <label className="text-base font-bold font-display text-[#F5F0E6] flex items-center gap-2">
          <span>🎩</span> 2. Phụ Kiện Kèm Theo (Chọn nhiều)
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(ACCESSORIES_BY_TYPE).map(([typeKey, list]) => {
            const typeLabel =
              typeKey === 'non'
                ? 'Nón đội đầu'
                : typeKey === 'khan'
                ? 'Khăn quàng & Vấn'
                : 'Phụ kiện bổ trợ';
            return (
              <div key={typeKey} className="p-4 rounded-2xl bg-[#1B1B1B] border border-[#333333] space-y-2.5">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#D99A16] block">
                  {typeLabel}
                </span>
                <div className="space-y-2">
                  {list.map((acc) => {
                    const isChecked = outfit.accessories?.includes(acc.id);
                    return (
                      <label
                        key={acc.id}
                        className={`flex items-center gap-2.5 p-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-[#2A2A2A] text-[#F5F0E6] font-medium'
                            : 'text-[#F5F0E6]/70 hover:bg-[#252525]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleAccessoryToggle(acc.id)}
                          className="w-4 h-4 rounded accent-[#D99A16] cursor-pointer"
                        />
                        <span>{acc.name?.vi}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Shoes Selection */}
      <div className="space-y-4 pt-6 border-t border-[#333333]">
        <label className="text-base font-bold font-display text-[#F5F0E6] flex items-center gap-2">
          <span>👟</span> 3. Giày Dép
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {SHOES_LIST.map((shoe) => {
            const isSelected = outfit.shoes === shoe.id;
            return (
              <button
                key={shoe.id}
                type="button"
                onClick={() => handleShoesChange(shoe.id)}
                className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B0000]/25 border-[#D99A16] text-[#F5F0E6] font-medium ring-1 ring-[#D99A16]'
                    : 'bg-[#1B1B1B] border-[#333333] text-[#F5F0E6]/80 hover:bg-[#262626]'
                }`}
              >
                <span className="text-xl">{shoe.icon}</span>
                <span>{shoe.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 4: Color Swatches */}
      <div className="space-y-4 pt-6 border-t border-[#333333]">
        <label className="text-base font-bold font-display text-[#F5F0E6] flex items-center gap-2">
          <span>🎨</span> 4. Màu Sắc Chủ Đạo Trang Phục
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {COLORS.map((c) => {
            const isSelected = outfit.color === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleColorChange(c.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#D99A16] bg-[#2A2A2A] ring-1 ring-[#D99A16]'
                    : 'border-[#333333] bg-[#1B1B1B] hover:bg-[#252525]'
                }`}
              >
                <span
                  className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="truncate text-[#F5F0E6]">{c.name?.vi}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 5: Context, Region, Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-[#333333]">
        {/* Context */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-[#F5F0E6] flex items-center gap-1.5">
            <span>🏛️</span> Bối Cảnh
          </label>
          <div className="flex flex-wrap gap-2">
            {CONTEXTS.map((ctx) => {
              const isSelected = outfit.context === ctx.id;
              return (
                <button
                  key={ctx.id}
                  type="button"
                  onClick={() => handleContextChange(ctx.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D99A16] text-[#1B1B1B] border-[#D99A16] font-bold'
                      : 'bg-[#1B1B1B] text-[#F5F0E6]/80 border-[#333333] hover:bg-[#262626]'
                  }`}
                >
                  {ctx.name?.vi}
                </button>
              );
            })}
          </div>
        </div>

        {/* Region */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-[#F5F0E6] flex items-center gap-1.5">
            <span>📍</span> Không Gian / Vùng
          </label>
          <div className="flex flex-wrap gap-2">
            {REGIONS.map((reg) => {
              const isSelected = outfit.region === reg.id;
              return (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => handleRegionChange(reg.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D99A16] text-[#1B1B1B] border-[#D99A16] font-bold'
                      : 'bg-[#1B1B1B] text-[#F5F0E6]/80 border-[#333333] hover:bg-[#262626]'
                  }`}
                >
                  {reg.name?.vi}
                </button>
              );
            })}
          </div>
        </div>

        {/* Style */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-[#F5F0E6] flex items-center gap-1.5">
            <span>🎭</span> Định Hướng Phong Cách
          </label>
          <div className="flex flex-wrap gap-2">
            {STYLES.map((st) => {
              const isSelected = outfit.style === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleStyleChange(st.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#D99A16] text-[#1B1B1B] border-[#D99A16] font-bold'
                      : 'bg-[#1B1B1B] text-[#F5F0E6]/80 border-[#333333] hover:bg-[#262626]'
                  }`}
                >
                  {st.name?.vi}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
