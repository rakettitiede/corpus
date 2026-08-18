const STYLE = `
  :root { color-scheme: light dark; }
  body { font: 18px/1.6 system-ui, sans-serif; max-width: 40rem; margin: 3rem auto; padding: 0 1.5rem; }
  h1 { font-size: 1.6rem; margin-bottom: 0.25rem; }
  p.lede { margin-top: 0; opacity: 0.7; }
  ul { list-style: none; padding: 0; }
  li { margin: 1.25rem 0; }
  li a { font-size: 1.1rem; font-weight: 600; }
  li span { display: block; opacity: 0.7; font-size: 0.9rem; }
  form.row { display: flex; gap: 0.5rem; align-items: center; margin: 0.75rem 0; }
  form.row .word { flex: 1; font-weight: 600; }
  input, button { font: inherit; padding: 0.3rem 0.6rem; }
  .empty { opacity: 0.6; font-style: italic; }
  footer { margin-top: 3rem; font-size: 0.85rem; opacity: 0.6; }
`;

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function layout(title, body) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title><style>${STYLE}</style></head>
<body>
${body}
<footer><a href="/">Lexicon</a></footer>
</body>
</html>`;
}

export function indexPage() {
  return layout('Lexicon', `
<h1>Lexicon</h1>
<p class="lede">Anyone suggests a word, an admin curates it, the approved words go to our
partner. Three pages and one JSON feed.</p>
<ul>
  <li>
    <a href="/suggest">Suggest a word</a>
    <span>What the public sees. Type a word, send it, and find out nothing about what
    happened to it — that part is deliberate.</span>
  </li>
  <li>
    <a href="/approve">The queue</a>
    <span>What an admin sees. Every word waiting for a decision, and nothing else. You name
    yourself when you decide.</span>
  </li>
  <li>
    <a href="/curated">The curated list</a>
    <span>JSON, because it is a feed rather than a page: this is what the partner's sidebar
    widget fetches.</span>
  </li>
</ul>`);
}

export function suggestForm() {
  return layout('Suggest a word — Lexicon', `
<h1>Suggest a word</h1>
<p class="lede">One word, up to 40 characters.</p>
<form method="get" action="/suggest">
  <input name="text" placeholder="a word worth knowing" size="30" autofocus>
  <button type="submit">Suggest</button>
</form>`);
}

export function suggestResult(text, result) {
  const outcome = result.ok
    ? `<p>Thank you. <strong>${escapeHtml(text)}</strong> has been received.</p>`
    : `<p><strong>${escapeHtml(result.error)}</strong></p>`;

  return layout('Suggest a word — Lexicon', `
<h1>Suggest a word</h1>
${outcome}
<p><a href="/suggest">Suggest another</a></p>`);
}

export function queuePage(pending) {
  const rows = pending.length === 0
    ? '<p class="empty">Nothing is waiting for a decision.</p>'
    : pending.map((item) => `
<form class="row" method="get">
  <span class="word">${escapeHtml(item.text)}</span>
  <input name="by" placeholder="your name" size="12">
  <button formaction="/approve/${item.id}">approve</button>
  <button formaction="/decline/${item.id}">decline</button>
</form>`).join('');

  return layout('The queue — Lexicon', `
<h1>The queue</h1>
<p class="lede">${pending.length} waiting. Put your name in the box: every decision records
who made it.</p>
${rows}`);
}

export function decisionResult(result) {
  const outcome = result.ok
    ? `<p><strong>${escapeHtml(result.text)}</strong> was
       ${result.approved ? 'approved' : 'declined'}.</p>`
    : `<p><strong>${escapeHtml(result.error)}</strong></p>`;

  return layout('The queue — Lexicon', `
<h1>The queue</h1>
${outcome}
<p><a href="/approve">Back to the queue</a> · <a href="/curated">the curated list</a></p>`);
}
