# AGENTS.md

Technical instructions for working in this repository.

## Run it

```
npm install
npm start          # http://localhost:3000, override with PORT
npm run dev        # same, but restarts when a file under src/ changes
```

Node 20 or newer. ESM only (`"type": "module"`). `npm run dev` is `node --watch`, which is
built in — do not add nodemon or any other watcher.

`--watch` follows imports, and `data/items.json` is read with `readFileSync` rather than
imported, so writing a suggestion does not restart the server. That is what you want; if
you ever change the store to `import` the JSON, dev mode will start restarting on every
request that writes.

## Layout

- `src/server.js` — Express routes, one per use case
- `src/suggestions.js` — accepting suggestions: validation, normalisation, duplicates
- `src/moderation.js` — the admin's approve/decline
- `src/curated.js` — the published list
- `src/store.js` — reads and writes `data/items.json`
- `src/pages.js` — the HTML. Template literals and one `<style>` block; there is no
  template engine and no client-side JavaScript. Anything interpolated into a page goes
  through `escapeHtml` first, including any text a suggester typed.

## House conventions

- No database. `data/items.json` is the whole store, rewritten on every change. Fine at
  this size; it is checked in on purpose so a fresh clone has data to look at.
- No build step, no transpiler, no test framework. Express is the only dependency.
- Every route is a `GET`, including the ones that change state, so the whole service can be
  driven from a browser address bar and every form can be a `GET` form. **This is a
  deliberate simplification, not a pattern to copy or to fix.** Leave it alone — that
  includes the approve and decline buttons, which are submit buttons with `formaction`
  rather than anything cleverer.
- The human-facing routes return HTML; `/curated` returns JSON because it is a feed for the
  partner rather than a page for a person. That split is intentional.
- There is no authentication. `by` is an unverified free-text name.

## Business context lives in `corpus/`

**Everything below this heading is deleted by `prepare.sh without`, which cuts the file from
this line to the end. Every mention of `corpus/` in this file belongs under this heading —
one added above it is one the Act 2 copy will still be carrying.**

Read `corpus/` before planning any change. It explains what this service is for, who uses
it and why the rules are what they are — none of which is derivable from the code.

When a change alters behaviour, update `corpus/` in the same pull request. The corpus diff
is what reviewers read.

Before opening a pull request that changes behaviour, run `/corpus-check diff` to check that
the code and the corpus still say the same thing. It reports; it does not fix. `/corpus-fix`
acts on what it finds, asking which side is wrong wherever the evidence does not settle it,
and edits `corpus/` only — deciding that the code is at fault is a person's call, and fixing
the code is ordinary development work.

Two things exist for that and nothing else:

- `.claude/skills/` — the `/corpus-check` and `/corpus-fix` skills, and `.claude/README.md`
  explaining how they are put together. They are written to be repo-agnostic: anything
  specific to this service belongs in `corpus/` or in this file, never inside a skill.
- `prepare.sh` — scaffolding for showing this repository to people, not part of the service.
  It copies the repository in two modes: `without` strips the corpus out of the copy, `with`
  keeps it. See `README.md`.

Before changing anything about the `by` parameter, read
`corpus/decisions/0003-named-approver-instead-of-auth.md`. There is no authentication, and
that was decided rather than skipped.
