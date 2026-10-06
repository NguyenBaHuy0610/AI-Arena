import sourcesData from '../../../data/sources.json';

export const SOURCES = sourcesData.sources;

// Lookup by source ID → source object
export const SOURCE_MAP = Object.fromEntries(
  SOURCES.map(s => [s.id, s])
);

// Helper: get source details for citation
export function getSource(id) {
  return SOURCE_MAP[id] || { id, title: 'Nguồn chưa xác định', publisher: 'Nguồn chưa xác định', url: '' };
}

// Helper: get multiple sources for a list of IDs
export function getSources(ids = []) {
  return ids.map(getSource);
}
