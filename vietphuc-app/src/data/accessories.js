import accessoriesData from '../../../data/accessories.json';

export const ACCESSORIES = accessoriesData.accessories;

export const ACCESSORY_MAP = Object.fromEntries(
  ACCESSORIES.map(a => [a.id, a])
);

// Group accessories by type
export const ACCESSORIES_BY_TYPE = ACCESSORIES.reduce((acc, a) => {
  if (!acc[a.type]) acc[a.type] = [];
  acc[a.type].push(a);
  return acc;
}, {});

export function getAccessory(id) {
  return ACCESSORY_MAP[id] || null;
}
