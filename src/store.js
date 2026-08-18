import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const DATA_FILE = fileURLToPath(new URL('../data/items.json', import.meta.url));

export function readItems() {
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
}

export function writeItems(items) {
  writeFileSync(DATA_FILE, `${JSON.stringify(items, null, 2)}\n`);
}

export function nextId(items) {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}
