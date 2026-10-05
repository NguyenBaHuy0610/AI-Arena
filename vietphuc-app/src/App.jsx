import React, { useState, useMemo, Suspense, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';

// ==========================================
// DATA & SCHEMA
// ==========================================
const COLORS = {
  'do-son': '#8b0000', 'xanh-cham': '#1d3b55', 'nau-gu': '#5c4033',
  'vang-nghe': '#ffc000', 'trang-nga': '#f8f8ff', 'den': '#1a1a1a', 'hong-dao': '#fdbcb4'
};

const GARMENTS = {
  'ao-dai': { id: 'ao-dai', name: 'Áo dài', type: 'outer', fit: 'om', color: COLORS['xanh-cham'] },
  'ao-tu-than': { id: 'ao-tu-than', name: 'Áo tứ thân', type: 'outer', fit: 'suong', color: COLORS['nau-gu'] },
  'ao-ngu-than': { id: 'ao-ngu-than', name: 'Áo ngũ thân', type: 'outer', fit: 'suong', color: COLORS['do-son'] },
  'ao-nhat-binh': { id: 'ao-nhat-binh', name: 'Áo nhật bình', type: 'outer', fit: 'rong', color: COLORS['vang-nghe'] },
  'quan-lua': { id: 'quan-lua', name: 'Quần lụa', type: 'bottom', color: COLORS['den'] },
  'vay-dup': { id: 'vay-dup', name: 'Váy đụp', type: 'bottom', color: COLORS['den'] },
  'khan-van': { id: 'khan-van', name: 'Khăn vấn', type: 'accessory' },
  'quai-thao': { id: 'quai-thao', name: 'Nón quai thao', type: 'accessory' }
};

// Nhãn tiếng Việt cho từng lớp trang phục
const LAYERS = [
  { key: 'outer', label: 'Áo' },
  { key: 'bottom', label: 'Quần / Váy' },
  { key: 'accessory', label: 'Phụ kiện' }
];

const EVAL_RULES = [
  { id: 'r1', type: 'cultural', level: 2, condition: (o) => o.outer === 'ao-tu-than' && o.bottom === 'quan-lua', delta: -18, msg: 'Áo tứ thân buông tà nên mặc cùng váy đụp.', suggestion: { layer: 'bottom', id: 'vay-dup' }, sourceIds: ['src-nghien-cuu-bac-bo'] },
  { id: 'r2', type: 'cultural', level: 2, condition: (o) => o.accessory === 'quai-thao' && !['ao-tu-than'].includes(o.outer), delta: -18, msg: 'Nón quai thao gắn với văn hóa Bắc Bộ, ghép sai bối cảnh.', suggestion: { layer: 'accessory', id: null }, sourceIds: ['src-tu-dien'] },
  { id: 'r3', type: 'aesthetic', level: 0, condition: (o, b) => b.shoulderWidth > 1.2 && GARMENTS[o.outer]?.fit === 'om', delta: -5, msg: 'Form áo ôm có thể làm lộ khuyết điểm vai rộng. Hãy thử form suông như Áo ngũ thân để vai thanh thoát hơn.', suggestion: { layer: 'outer', id: 'ao-ngu-than' } }
];

// Kiểu hiển thị theo mức độ: level 0 là gợi ý thẩm mỹ (vàng), level >= 1 là cảnh báo văn hóa (đỏ)
const alertStyle = (level) =>
  level === 0
    ? { box: 'bg-amber-50 border-amber-200', badge: 'bg-amber-600', label: 'Gợi ý thẩm mỹ' }
    : { box: 'bg-red-50 border-red-200', badge: 'bg-red-800', label: `Cảnh báo Level ${level}` };

// ==========================================
// Bắt lỗi khi Environment không tải được HDR (mất mạng)
// ==========================================
class SafeBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// ==========================================
// 3D AVATAR
// ==========================================
function Avatar3D({ body, outfit }) {
  const baseScale = body.height / 165;
  const hipScale = 1 + ((body.weight - 55) * 0.01);
  const shoulderScale = body.shoulderWidth;

  const garmentColor = GARMENTS[outfit.outer]?.color || '#ffffff';
  const bottomColor = GARMENTS[outfit.bottom]?.color || '#1a1a1a';

  return (
    <group scale={[baseScale, baseScale, baseScale]} position={[0, -2, 0]}>
      {/* Khung chậu & chân */}
      <group scale={[hipScale, 1, hipScale]}>
        <mesh position={[-0.4, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 3, 32]} />
          <meshStandardMaterial color={outfit.bottom === 'vay-dup' ? bottomColor : body.skinTone} />
        </mesh>
        <mesh position={[0.4, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 3, 32]} />
          <meshStandardMaterial color={outfit.bottom === 'quan-lua' ? bottomColor : body.skinTone} />
        </mesh>
        {outfit.bottom === 'vay-dup' && (
          <mesh position={[0, 1.5, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.9, 3, 32]} />
            <meshStandardMaterial color={bottomColor} transparent opacity={0.9} />
          </mesh>
        )}
      </group>

      {/* Thân trên */}
      <group position={[0, 3, 0]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[shoulderScale * 0.7, hipScale * 0.7, 1.6, 32]} />
          <meshStandardMaterial color={outfit.outer ? garmentColor : body.skinTone} />
        </mesh>

        {/* Cổ & đầu */}
        <group position={[0, 1.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.15, 0.2, 0.4]} />
            <meshStandardMaterial color={body.skinTone} />
          </mesh>
          <mesh position={[0, 0.7, 0]} castShadow>
            <sphereGeometry args={[0.5, 32, 32]} />
            <meshStandardMaterial color={body.skinTone} />
          </mesh>
          {outfit.accessory === 'quai-thao' && (
            <mesh position={[0, 1.2, 0]}>
              <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
              <meshStandardMaterial color="#eedd82" />
            </mesh>
          )}
        </group>

        {/* Tay */}
        <mesh position={[-shoulderScale * 0.8, 0.4, 0]} rotation={[0, 0, 0.2]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 1.5]} />
          <meshStandardMaterial color={outfit.outer ? garmentColor : body.skinTone} />
        </mesh>
        <mesh position={[shoulderScale * 0.8, 0.4, 0]} rotation={[0, 0, -0.2]} castShadow>
          <cylinderGeometry args={[0.2, 0.15, 1.5]} />
          <meshStandardMaterial color={outfit.outer ? garmentColor : body.skinTone} />
        </mesh>
      </group>

      {/* Tà áo giả lập (Áo dài, Áo ngũ thân, Áo tứ thân) */}
      {outfit.outer && GARMENTS[outfit.outer].fit !== 'rong' && (
        <mesh position={[0, 2.5, 0.35]} rotation={[0.1, 0, 0]}>
          <planeGeometry args={[shoulderScale * 1.4, 2.5]} />
          <meshStandardMaterial color={garmentColor} side={2} />
        </mesh>
      )}
    </group>
  );
}

// ==========================================
// UI CHÍNH
// ==========================================
export default function VietPhucRemixPro() {
  const [activeTab, setActiveTab] = useState('ai');
  const [body, setBody] = useState({ height: 165, weight: 55, skinTone: '#d4aa78', shoulderWidth: 1.0 });
  const [outfit, setOutfit] = useState({ outer: 'ao-ngu-than', bottom: 'quan-lua', accessory: null });
  const [aiPrompt, setAiPrompt] = useState('');
  const [skinMsg, setSkinMsg] = useState('');

  // --- Gợi ý trang phục theo bối cảnh (mô phỏng NLP phía client) ---
  const handleAIPrompt = () => {
    const text = aiPrompt.toLowerCase();
    if (text.includes('kỷ yếu') || text.includes('hiện đại') || text.includes('dáng ôm')) {
      setOutfit({ outer: 'ao-dai', bottom: 'quan-lua', accessory: null });
    } else if (text.includes('hoài cổ') || text.includes('đình làng') || text.includes('bắc bộ')) {
      setOutfit({ outer: 'ao-tu-than', bottom: 'vay-dup', accessory: 'quai-thao' });
    } else if (text.includes('cung đình') || text.includes('huế') || text.includes('quý tộc')) {
      setOutfit({ outer: 'ao-nhat-binh', bottom: 'quan-lua', accessory: 'khan-van' });
    } else {
      setOutfit({ outer: 'ao-ngu-than', bottom: 'quan-lua', accessory: 'khan-van' });
    }
  };

  // --- Phân tích tone da (xử lý trên trình duyệt, không gửi lên server) ---
  const handleImageUpload = (e) => {
    const input = e.target;
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0);

        // Lấy trung bình vùng 20x20 pixel ở trung tâm ảnh
        const size = Math.max(1, Math.min(20, img.width, img.height));
        const cx = Math.floor(img.width / 2 - size / 2);
        const cy = Math.floor(img.height / 2 - size / 2);
        const d = ctx.getImageData(cx, cy, size, size).data;
        let r = 0, g = 0, b = 0;
        const n = d.length / 4;
        for (let i = 0; i < d.length; i += 4) {
          r += d[i]; g += d[i + 1]; b += d[i + 2];
        }
        r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
        const hex = '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);

        setBody((prev) => ({ ...prev, skinTone: hex }));
        setSkinMsg(`Đã lấy màu da ${hex} từ vùng giữa ảnh. Ảnh chỉ được xử lý trên trình duyệt, không lưu server.`);
        input.value = ''; // cho phép chọn lại cùng một file
      };
      img.onerror = () => setSkinMsg('Không đọc được ảnh này. Hãy thử file JPG hoặc PNG khác.');
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // --- Đánh giá ---
  const evaluation = useMemo(() => {
    let culturalScore = 100;
    const alerts = [];
    EVAL_RULES.forEach((rule) => {
      if (rule.condition(outfit, body)) {
        if (rule.type === 'cultural') culturalScore += rule.delta;
        alerts.push(rule);
      }
    });
    return { culturalScore: Math.max(0, culturalScore), alerts };
  }, [body, outfit]);

  const tabs = [
    { id: 'ai', label: 'Trợ lý AI' },
    { id: 'character', label: 'Nhân vật' },
    { id: 'outfit', label: 'Phối đồ' }
  ];

  const sliders = [
    { label: 'Chiều cao (cm)', min: 140, max: 195, key: 'height' },
    { label: 'Cân nặng (kg)', min: 40, max: 110, key: 'weight' },
    { label: 'Độ rộng vai (tỉ lệ)', min: 0.8, max: 1.5, step: 0.1, key: 'shoulderWidth' }
  ];

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 text-slate-800 font-sans">

      {/* BẢNG ĐIỀU KHIỂN (Trái) */}
      <div className="w-full md:w-1/3 bg-white shadow-xl flex flex-col h-full z-10 border-r border-slate-200">
        <div className="p-6 pb-0">
          <h1 className="text-2xl font-serif font-bold text-blue-900 tracking-wide mb-4">Việt phục Remix Pro</h1>
          <div className="flex gap-2 bg-slate-100 p-1 rounded-lg mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${activeTab === tab.id ? 'bg-white shadow text-blue-900' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <label className="text-sm font-bold text-blue-900 mb-2 block">Nhập bối cảnh mong muốn</label>
                <textarea
                  rows="3"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ví dụ: Mình muốn chụp kỷ yếu mang phong cách hoài cổ..."
                  className="w-full p-3 border border-slate-300 rounded-lg mb-3 text-sm focus:ring-2 focus:ring-blue-900 outline-none"
                />
                <button onClick={handleAIPrompt} className="w-full bg-blue-900 text-white py-2 rounded-lg font-semibold hover:bg-blue-800 transition">
                  ✨ Gợi ý trang phục
                </button>
              </div>
              <div className="p-4 border border-slate-200 rounded-xl">
                <label className="text-sm font-bold text-slate-800 mb-2 block">Phân tích tone da tự động</label>
                <p className="text-xs text-slate-500 mb-3">Ảnh được xử lý trực tiếp trên trình duyệt của bạn, không gửi lên máy chủ. Hãy dùng ảnh chân dung có khuôn mặt ở giữa khung hình.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                />
                {skinMsg && (
                  <div className="flex items-start gap-2 mt-3 text-xs text-slate-600">
                    <span className="inline-block w-4 h-4 rounded-full border border-slate-300 shrink-0" style={{ backgroundColor: body.skinTone }} />
                    <p>{skinMsg}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'character' && (
            <div className="space-y-6">
              {sliders.map((slider) => (
                <div key={slider.key}>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-semibold">{slider.label}</label>
                    <span className="text-sm">{slider.key === 'shoulderWidth' ? body[slider.key].toFixed(1) : body[slider.key]}</span>
                  </div>
                  <input
                    type="range"
                    min={slider.min}
                    max={slider.max}
                    step={slider.step || 1}
                    value={body[slider.key]}
                    onChange={(e) => setBody({ ...body, [slider.key]: parseFloat(e.target.value) })}
                    className="w-full accent-red-800"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'outfit' && (
            <div className="space-y-4">
              {LAYERS.map((layer) => (
                <div key={layer.key}>
                  <label className="text-xs font-bold text-slate-500 mb-2 block">{layer.label}</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(GARMENTS)
                      .filter((g) => g.type === layer.key)
                      .map((g) => (
                        <button
                          key={g.id}
                          onClick={() => setOutfit((p) => ({ ...p, [layer.key]: p[layer.key] === g.id ? null : g.id }))}
                          className={`px-3 py-1.5 text-sm rounded-full border ${outfit[layer.key] === g.id ? 'bg-blue-900 text-white border-blue-900' : 'bg-white hover:border-blue-900'}`}
                        >
                          {g.name}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* SÂN KHẤU 3D (Giữa) */}
      <div className="flex-1 relative bg-gradient-to-b from-slate-200 to-slate-400">
        <Canvas shadows camera={{ position: [0, 1, 13], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <hemisphereLight args={['#ffffff', '#8899aa', 0.6]} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          {/* Environment tải HDR từ CDN: nếu lỗi mạng thì bỏ qua, vẫn còn hemisphereLight */}
          <SafeBoundary>
            <Suspense fallback={null}>
              <Environment preset="city" />
            </Suspense>
          </SafeBoundary>
          <Avatar3D body={body} outfit={outfit} />
          <ContactShadows position={[0, -2.1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
          <OrbitControls
            enablePan={false}
            target={[0, 1.2, 0]}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
            minDistance={5}
            maxDistance={18}
          />
        </Canvas>
      </div>

      {/* ĐÁNH GIÁ (Phải) */}
      <div className="w-full md:w-1/4 bg-white shadow-xl p-6 overflow-y-auto border-l border-slate-200 z-10">
        <h2 className="text-lg font-serif font-bold text-blue-900 mb-4">Phân tích hệ thống</h2>
        <div className="bg-slate-50 p-4 rounded-xl border mb-6 text-center">
          <div className="text-4xl font-bold text-red-800">{evaluation.culturalScore}</div>
          <div className="text-xs font-semibold text-slate-500 mt-1">Độ chuẩn văn hóa</div>
        </div>
        <div className="space-y-3">
          {evaluation.alerts.length === 0 ? (
            <p className="text-sm p-3 bg-green-50 text-green-800 rounded border border-green-200">Hoàn hảo! Bộ trang phục này khớp với dữ liệu đối chiếu.</p>
          ) : (
            evaluation.alerts.map((alert) => {
              const s = alertStyle(alert.level);
              return (
                <div key={alert.id} className={`p-3 border rounded text-sm ${s.box}`}>
                  <span className={`inline-block px-1.5 py-0.5 text-white text-[10px] font-bold rounded mb-2 ${s.badge}`}>{s.label}</span>
                  <p className="text-slate-800 mb-2">{alert.msg}</p>
                  {alert.sourceIds && <p className="text-[10px] text-slate-500 italic mb-2">Tham chiếu: {alert.sourceIds.join(', ')}</p>}
                  {alert.suggestion && (
                    <button
                      onClick={() => setOutfit((p) => ({ ...p, [alert.suggestion.layer]: alert.suggestion.id }))}
                      className="text-xs font-semibold text-blue-800 underline"
                    >
                      Áp dụng gợi ý
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
