import { readItems, writeItems, nextId } from './store.js';

export const MAX_LENGTH = 40;

// Lower-cased, whitespace-collapsed form used to compare two suggestions. Trailing
// punctuation comes off too — a full stop or a hyphen on the end was getting variants of the
// same word past the duplicate check.
export function normalize(text) {
  return text.trim().toLowerCase().replace(/\s+/g, ' ').replace(/[.\-'’!?]+$/, '');
}

export function addSuggestion(rawText, now = new Date()) {
  const text = String(rawText ?? '').trim();

  if (text.length === 0) {
    return { ok: false, error: 'text is required' };
  }
  if (text.length > MAX_LENGTH) {
    return { ok: false, error: `text must be at most ${MAX_LENGTH} characters` };
  }

  const items = readItems();
  const normalized = normalize(text);

  // Already known: pending, approved or previously declined.
  if (items.some((item) => normalize(item.text) === normalized)) {
    return { ok: true };
  }

  items.push({
    id: nextId(items),
    text,
    approved: false,
    suggestedAt: now.toISOString(),
    decidedAt: null,
    decidedBy: null,
  });
  writeItems(items);

  return { ok: true };
}
