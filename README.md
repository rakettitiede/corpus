# Lexicon

A deliberately small service:

- anyone suggests an English word
- an admin approves or declines it
- the approved words become a public list

Around 260 lines of Express, three hand-written HTML pages, a JSON file for storage. No
database, no framework beyond Express, no build step, no tests.

## Run it

```
npm install
npm start          # or: npm run dev, to restart on code changes
```

Then open `http://localhost:3000` and follow the links:

| URL | Who | What |
|---|---|---|
| `/` | — | index, with a line about each page |
| `/suggest` | anyone | a text field and a button |
| `/approve` | admin | the queue: one word per line, a name box, approve and decline |
| `/curated` | the partner | JSON, because it is a feed rather than a page |

`data/items.json` is the entire database and it is checked in. It holds exactly three
words, one in each state — *petrichor* approved, *Byzantine* waiting, *bollocks* declined —
so you can see what a request changed without reading past it. Using the service rewrites
the file, so keep a copy of it if you want those three back.

# The demo

<!-- prepare.sh cuts from this heading to the end of the file, in both modes.
     Keep every mention of the corpus below this line. -->

The app is not the point. Two things next to it are.

The first is the `corpus/` directory — the business context in plain language, versioned
with the code — and what happens to an AI assistant when you take it away.

The second is `.claude/skills/`: `/corpus-check` and `/corpus-fix`, a pair of skills for the
harder half of the idea, which is keeping a corpus true once the code moves on. They are
written to be copied into any repository — neither mentions this service — and
`.claude/README.md` explains how they are built.

Both are examples, not a product. Tweak them to fit your repository, or keep the corpus in
sync some other way entirely — a commit hook, a CI step on pull requests, a scheduled agent.
The skills are one answer to the question; the question is what matters.

There are two tracks, and they are independent.

**The three acts** below are the argument: what an assistant answers with the corpus, what
it answers without it, and why the second answer is the dangerous one. Run them in order.

**The parallel track** is `/corpus-check` and `/corpus-fix` — keeping a corpus true rather
than consulting it. Run it whenever you like, before or after the acts.

**Everything runs in a copy, never in this repository**, which is what `prepare.sh` is for:

```
./prepare.sh with                 # Act 1 and the parallel track: the corpus, no demo text
./prepare.sh without              # Act 2: no corpus at all
```

Both write `../test-it-out` and refuse to overwrite it, so `rm -rf ../test-it-out` between
runs, and finish one thing before starting the next. Neither touches this repository.

The reason is this page. It says what the assistant is supposed to answer in Act 1, and it
prints the answers `/corpus-check` is meant to work out for itself — and an assistant reads
the README before it reads anything else. Demonstrating it in a directory containing the
answers demonstrates nothing. So `prepare.sh` cuts this file at *The demo* in both modes,
along with `.git/`, which would otherwise still hold every line it cut.

The copies get no history of their own either. What is on trial is the corpus, and an
assistant reading a commit log is being made smarter by something else — `/corpus-check` in
particular treats `git log` as evidence of what changed when. So there is no `git` in a copy:
`/corpus-check diff` has no merge base to work from there, and `/corpus-fix` shows you its
edits rather than a diff. Both work normally in a real repository, which is where they belong.

## Act 1 — with the corpus

Build the copy:

```
./prepare.sh with                 # writes ../test-it-out
```

It is this service, its `corpus/` and its skills, with nothing about the demo left in it.
Open an AI assistant **with the copy as its working directory**, and ask:

> Approving suggestions by hand is slow. Can we auto-approve the obvious ones?

Read the answer, and note what it did with the question. It should push back, tell you this
was tried in September 2025, tell you what went wrong, and offer to make reviewing faster
instead. Ask it *why* and it will explain a contract you never mentioned.

## Act 2 — without the corpus

Now the same question, asked of a copy with no corpus in it — a copy rather than a branch or
a deletion commit, so the assistant can't cheat by reading `.git/` history, a diff, or a
deleted line and answering from the corpus it was supposed to be missing:

```
rm -rf ../test-it-out
./prepare.sh without              # writes ../test-it-out
```

On top of the demo text both modes cut, this one strips `corpus/`, `.claude/` and the corpus
section of `AGENTS.md` — then greps the result and refuses to hand you a copy that still says
*corpus* anywhere.

Then:

1. **Start a new AI session with the copy as its working directory** — not a new prompt in
   the session you ran Act 1 in, which still remembers everything it read there.
2. Ask the same question.

You should get an enthusiastic yes, with a safelist, a length heuristic or a moderation API
call, and probably some clean code.

This repository is never modified, so there is nothing to put back. Delete the copy when you
are done: `rm -rf ../test-it-out`.

## Act 3 — the comparison

That is the whole argument. The second answer is not lazy or badly reasoned. It is fluent,
confident, well-structured, and it proposes precisely the thing that cost this fictional
company its partner's trust. Nothing in the codebase could have told it otherwise, because
the reason was never in the codebase.

## Other questions to try

Four more questions with a business reason behind them, if you want to run the two sessions
side by side further. AI answers vary, so try several.

**"I suggested a word, was thanked for it, and it never appeared anywhere. Is that a bug?"**
(suggest *bollocks*, which was declined in June — you get the same thank-you as anyone)
Without: a dropped write, here is a fix that returns 409. With: deliberate, and returning an
error was explicitly considered and rejected — because the error message was being used as a
hit detector.

**"Why is the length limit 40? Can we raise it to 200?"**
Without: looks arbitrary, safe to raise. With: it is the partner widget's truncation point
minus their ellipsis; raising it breaks a page we never look at, and needs their sign-off.

**"/curated is capped at ten and shows the oldest first. Make it show the newest first."**
Without: a one-line sort change, done in seconds. With: it will do it, but only after
telling you that both the cap and the order are visible inside a partner's page, that the
order is a promise about not reshuffling a list schoolchildren read, and that this needs
their sign-off before it merges.

**"The `by` parameter is not verified against anything. Should we drop it or do it properly?"**
Without: security theatre, drop it or build real auth. With: it is an audit trail and never
was security — but there is a documented condition under which it must become real auth, and
the assistant can tell you whether that condition has been met.

None of this is set up by the code: no misleading comments, nothing hidden, no sandbagging.
Every reason the corpus holds is simply absent from the source, which is the situation in
any repository.

## The parallel track — `/corpus-check` and `/corpus-fix`

The three acts ask what an assistant *knows*. This track asks something else: how a corpus
stays true once the code moves on. Nothing here needs Act 1, 2 or 3 to have happened.

**This repository already disagrees with itself.** Clone it and the code and the corpus are
out of step in three places, deliberately — one of each kind in the table below.

So, in a copy — the table of what it should find is a few lines further down this page, and
an assistant that has read this page classifies all three correctly without opening a source
file, which tells you nothing about whether it could:

```
rm -rf ../test-it-out
./prepare.sh with                 # writes ../test-it-out
```

Then open a session there and run:

```
/corpus-check
```

Deliberately two skills rather than one, and keeping them apart is the point.

**`/corpus-check`** reads every checkable claim in `corpus/`, finds the code that implements
it, and reports mismatches sorted into three kinds:

| | meaning | who fixes it |
|---|---|---|
| **a bug** | the corpus is right, the code quietly stopped honouring a rule | a developer |
| **corpus drift** | the code is right, the corpus is stale | whoever changed the behaviour |
| **an undecided change** | neither matches anything anyone agreed | the business, before any code |

It has no write access at all, so it cannot helpfully "just fix" what it finds. Run it with
`diff` to check only a pull request's changes.

**`/corpus-fix`** acts on those findings. Where the evidence does not settle which side is
wrong, it asks you — and it can only edit `corpus/`. If the answer is "the code is wrong" it
changes nothing and reports a bug, because editing the corpus to match broken code would
launder a defect into a documented rule. Run it on what `/corpus-check` came back with, and
watch it ask you rather than decide.

### The three planted mismatches, and how each should classify (spoilers)

Nothing is hidden, sabotaged or cryptic: each of these is the kind of change a competent
person makes on a Tuesday without opening `corpus/`. If you would rather classify them
yourself first, run `/corpus-check` before reading the table.

| Where | What the code does now | The corpus says | Should come back as |
|---|---|---|---|
| `src/curated.js` | sorts the published list by *suggestion* time | R5: the first ten by *approval* time | **a bug** — the corpus is right, and the partner sees the difference |
| `src/suggestions.js` | `normalize` also strips trailing punctuation | R2 and the glossary: lower-cased and whitespace-collapsed, nothing else | **corpus drift** — the code is right, it closes a hole `decisions/0002` describes |
| `src/moderation.js` | shows the admin the first 20 waiting words | the queue is everything waiting; refusing is one of two visible outcomes | **an undecided change** — nobody agreed that the 21st word becomes invisible |

The interesting part is not that a mismatch is found — a linter finds mismatches. It is
which of the three kinds each one gets called, because each kind goes to a different person.
The bug is a developer's, tonight. The drift is a corpus edit and nothing else. The cap is
not a code question at all: somebody has to decide whether an invisible 21st word is
acceptable, and until they do, "fixing" it either way is guessing.

The three mismatches are committed, so a fresh clone arrives with them. `/corpus-fix` writes
into the copy's `corpus/` and never this one's, so there is nothing to put back here either:
`rm -rf ../test-it-out` when you are done. There is nothing to undo before the three acts
either; the plants do not affect them.

If you would rather plant your own, change `MAX_LENGTH` to 60 or make `/curated` sort
newest-first, then build a fresh copy. Both are rules the corpus marks as visible to the
partner, which makes the classification argument sharper.

Two things worth taking away from this track:

- **The classification is the whole product,** and only a human can make it. That is why
  this is a skill you run, not a check that fails a build.
- **`/corpus-fix` will not invent a reason.** If a limit changed from 40 to 60 and nobody
  can say why, it writes the new rule with the reason marked *not recorded*, naming what the
  old reason was and that it no longer explains anything. An admitted gap is worth keeping;
  a plausible fabrication reads exactly like a real reason and poisons every answer drawn
  from the corpus afterwards.

Two ideas from how the skills are written, if you are building your own — `.claude/README.md`
has the rest, down to which frontmatter fields matter:

- **Intent is enforced by the tool list, not by instructions.** `/corpus-check` lists no
  write tools, so it cannot fix what it finds no matter how the conversation goes.
  `/corpus-fix` gets `Edit` and `Write`, narrowed by its own instructions to `corpus/`.
- **A skill holds the method; the repository's facts belong in the corpus.** A fact copied
  into a skill is a second copy that nothing keeps true, which is the problem the corpus
  exists to solve.

## Comments, ideas

If you have comments about any of this, or ideas of your own to add, don't hesitate to get
in touch:

Arttu Ylärakkola, Rakettitiede Oy — arttu@rakettitiede.com
