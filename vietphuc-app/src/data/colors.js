import colorsData from '../../../data/colors.json';

export const COLORS = colorsData.colors;

export const COLOR_MAP = Object.fromEntries(
  COLORS.map(c => [c.id, c])
);

export function getColor(id) {
  return COLOR_MAP[id] || null;
}
