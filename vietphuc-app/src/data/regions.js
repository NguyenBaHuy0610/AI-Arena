import regionsData from '../../../data/regions.json';

export const REGIONS = regionsData.regions;

export const REGION_MAP = Object.fromEntries(
  REGIONS.map(r => [r.id, r])
);

export function getRegion(id) {
  return REGION_MAP[id] || null;
}
