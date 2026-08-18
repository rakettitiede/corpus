import { readItems } from './store.js';

export const CURATED_SIZE = 10;

export function curatedList() {
  return readItems()
    .filter((item) => item.approved)
    .sort((a, b) => a.suggestedAt.localeCompare(b.suggestedAt))
    .slice(0, CURATED_SIZE)
    .map(({ text, decidedAt, decidedBy }) => ({
      word: text,
      approvedAt: decidedAt,
      approvedBy: decidedBy,
    }));
}
