# Corpus

The business context of Lexicon, in plain language, versioned next to the code it explains.

The code says *how* the service works. This directory says *why* it works that way, what it
promises to whom, and what we deliberately decided not to do. That information has nowhere
else to live: it is not in the code, and a wiki page drifts out of date the moment someone
merges a pull request.

## Who this is for

Anyone. Domain knowledge is the only requirement — no code is quoted here on purpose, so a
product owner, a support person or a new developer can all read and correct it. AI agents
working in this repository are told to read it first (see `../AGENTS.md`).

## How to use it

Do not read it front to back. Either ask an AI a question and let it answer from these
files, or read the corpus diff in a pull request to check that a change means what someone
intended.

## How to keep it true

- A pull request that changes behaviour updates the corpus in the same pull request.
- A new rule, or a reversal of an old one, gets a file in `decisions/` — including what was
  rejected and why. The rejected options are the part people forget and the part that
  saves the most time later.
- If something here turns out to be wrong, fix it. Being wrong is worse than being thin.

## Map

| File | What it holds |
|---|---|
| `01-what-this-is.md` | What Lexicon is, who pays for it, what we promised the partner |
| `02-actors.md` | The three actors, what each wants, and where they conflict |
| `03-glossary.md` | Words we use precisely, and words we misuse |
| `04-flow.md` | The life of a suggestion, as a diagram |
| `05-rules.md` | Every rule the service enforces, with its reason |
| `06-definition-of-done.md` | What "done" means here, in business terms |
| `decisions/` | Decisions taken, and what was rejected |
