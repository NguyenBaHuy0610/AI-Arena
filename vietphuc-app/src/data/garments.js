// Import raw JSON
import aoDai from '../../../data/garments/ao-dai.json';
import aoTuThan from '../../../data/garments/ao-tu-than.json';
import aoNguThan from '../../../data/garments/ao-ngu-than.json';
import aoNhatBinh from '../../../data/garments/ao-nhat-binh.json';
import aoBaBa from '../../../data/garments/ao-ba-ba.json';
import aoThe from '../../../data/garments/ao-the.json';
import aoTac from '../../../data/garments/ao-tac.json';
import aoGiaoLinh from '../../../data/garments/ao-giao-linh.json';
import aoMoBaMoBay from '../../../data/garments/ao-mo-ba-mo-bay.json';

// MVP garments (primary focus)
export const GARMENTS = [aoDai, aoTuThan, aoNguThan, aoNhatBinh, aoBaBa];

// All garments for lookup/reference
export const ALL_GARMENTS = [
  aoDai,
  aoTuThan,
  aoNguThan,
  aoNhatBinh,
  aoBaBa,
  aoThe,
  aoTac,
  aoGiaoLinh,
  aoMoBaMoBay,
];

// Lookup by ID
export const GARMENT_MAP = Object.fromEntries(
  ALL_GARMENTS.map(g => [g.id, g])
);

// Helper: get garment by ID
export function getGarment(id) {
  return GARMENT_MAP[id] || null;
}

// MVP garment IDs for validation
export const MVP_GARMENT_IDS = [
  'ao-dai', 'ao-tu-than', 'ao-ngu-than', 'ao-nhat-binh', 'ao-ba-ba'
];
