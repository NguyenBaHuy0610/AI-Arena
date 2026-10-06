import stylesData from '../../../data/styles.json';

export const STYLES = stylesData.styles;

export const STYLE_MAP = Object.fromEntries(
  STYLES.map(s => [s.id, s])
);

export function getStyle(id) {
  return STYLE_MAP[id] || null;
}
