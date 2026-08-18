# 0001 — Nothing is published without a named human approving it

**Date:** 2025-10-01 · **Status:** accepted, and not open for revisiting

## Context

The queue grew faster than two part-time admins could clear it. Most of what arrives is
obviously fine or obviously junk, and asking a person to look at *petrichor* felt like waste.
So in September 2025 we automated the obvious cases.

The rule was conservative: approve automatically if the word appeared in a mainstream
dictionary API, was a single word, and was under fifteen characters. Everything else went to
the queue as before. It worked exactly as designed for eighteen days and cut the queue by
about two thirds.

On 26 September it published a slur. It is a valid dictionary entry, one word, eight
characters. It sat in the widget on the partner's lesson pages for most of a working day
before a teacher mailed them and they mailed us. We removed it in minutes; that was not the
point. The point was the reply from their side, which was that the agreement says a person
approves each word, and that a dictionary is not a person.

## Decision

Every published entry is approved by a named human being. No automatic approval, of any
kind, under any threshold.

## What was rejected, and why

- **A better safelist or a stricter dictionary rule.** This is what already failed. The
  failure was not that the list was too permissive, it was that no list encodes "unsuitable
  next to a lesson for eleven-year-olds". Tightening it changes the odds, not the clause.
- **An LLM moderation call instead of the dictionary.** Better judgement, same problem: the
  contract wants a person who is answerable, and a model is not one. Worth revisiting only
  if the *contract* changes, and then it is a commercial conversation, not a technical one.
- **Auto-approve, then have an admin review what was published.** Publish-then-remove is the
  precise thing the clause exists to prevent, and it is what actually happened in September.
  Reviewing afterwards is reviewing after the teacher has already seen it.
- **Auto-*decline* the obvious junk, human-approve the rest.** Tempting, and much safer —
  the clause only constrains publishing. We rejected it anyway, for a smaller reason: the
  junk is the easy half of the queue to clear, so it saves the admins little, and a
  false auto-decline is invisible to everyone including us. Reconsider this one if the
  volume ever justifies it; it is the only door here that is not locked.

## Consequences we accepted

The queue is a human bottleneck permanently, and the answer to "approving is too slow" is
always to make reviewing faster — fewer clicks, better ordering, batching, a phone-friendly
queue — never to remove the human from the decision.

If someone proposes automating approval, they are proposing the thing that cost us the
partner's trust in September 2025. Point them here.
