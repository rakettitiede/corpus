import { readItems, writeItems } from './store.js';

// As many suggestions as an admin will work through in one sitting.
export const QUEUE_PAGE_SIZE = 20;

export function listPending() {
  return readItems()
    .filter((item) => item.decidedAt === null)
    .slice(0, QUEUE_PAGE_SIZE)
    .map(({ id, text, suggestedAt }) => ({ id, text, suggestedAt }));
}

export function decide(id, approved, by, now = new Date()) {
  const decidedBy = String(by ?? '').trim();

  if (decidedBy.length === 0) {
    return { ok: false, error: 'by is required, for example /approve/7?by=priya' };
  }

  const items = readItems();
  const item = items.find((candidate) => candidate.id === id);

  if (!item) {
    return { ok: false, error: `no suggestion with id ${id}` };
  }
  if (item.decidedAt !== null) {
    const outcome = item.approved ? 'approved' : 'declined';
    return { ok: false, error: `suggestion ${id} was already ${outcome} by ${item.decidedBy}` };
  }

  item.approved = approved;
  item.decidedAt = now.toISOString();
  item.decidedBy = decidedBy;
  writeItems(items);

  return { ok: true, id: item.id, text: item.text, approved: item.approved };
}
