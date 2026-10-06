import contextsData from '../../../data/contexts.json';

export const CONTEXTS = contextsData.contexts;

export const CONTEXT_MAP = Object.fromEntries(
  CONTEXTS.map(c => [c.id, c])
);

export function getContext(id) {
  return CONTEXT_MAP[id] || null;
}
