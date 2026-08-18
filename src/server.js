import express from 'express';

import { addSuggestion } from './suggestions.js';
import { listPending, decide } from './moderation.js';
import { curatedList } from './curated.js';
import { indexPage, suggestForm, suggestResult, queuePage, decisionResult } from './pages.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

app.get('/', (req, res) => {
  res.send(indexPage());
});

app.get('/suggest', (req, res) => {
  const { text } = req.query;

  if (text === undefined) {
    return res.send(suggestForm());
  }
  res.send(suggestResult(text, addSuggestion(text)));
});

// The same thing by hand, for typing straight into the address bar.
app.get('/suggest/:word', (req, res) => {
  const { word } = req.params;
  res.send(suggestResult(word, addSuggestion(word)));
});

app.get('/approve', (req, res) => {
  res.send(queuePage(listPending()));
});

app.get('/approve/:id', (req, res) => {
  res.send(decisionResult(decide(Number(req.params.id), true, req.query.by)));
});

app.get('/decline/:id', (req, res) => {
  res.send(decisionResult(decide(Number(req.params.id), false, req.query.by)));
});

// The partner's feed. The only route that is not a page.
app.get('/curated', (req, res) => {
  res.json({ words: curatedList() });
});

app.use((req, res) => {
  res.status(404).json({ ok: false, error: `no route for ${req.path}, see /` });
});

app.listen(PORT, () => {
  console.log(`lexicon listening on http://localhost:${PORT}`);
});
