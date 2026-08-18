# 0002 — A word we already know is accepted and silently dropped

**Date:** 2025-05-20 · **Status:** accepted

## Context

Until May 2025 the suggestion endpoint was honest. Send a word we had already declined and
it told you so, with a clear error.

On 14 May somebody had a word declined, got the error, and worked out in about four minutes
that the error told them exactly when they had hit something. They spent the evening
sending variants — spaced out, hyphenated, with a trailing dot, with a capital in the middle
— using our own error messages as a hit detector to find one that got through. Forty-one
attempts. Two of them got through.

The general shape of the problem: any response that distinguishes "we have never seen this"
from "we have seen this and said no" is a free oracle for whoever wants to get around the
decision, and the only people who probe it are the people we least want to help.

## Decision

Suggesting gives the same thank-you for every well-formed word, whether it is new, queued,
published or declined last year. Only malformed input — empty, or over the length limit —
is refused, and only because the suggester can see that for themselves.

The wording of the thank-you is therefore load-bearing. It must not promise review, imply a
queue, or say anything a suggester could compare against a second attempt.

Declined words stay in the data file permanently. They are the memory that makes this work.

## What was rejected, and why

- **Returning a 409 or a 403 for a known word.** This is what we had. It is the oracle.
- **A generic error — "could not accept this suggestion" — for known words.** Still an
  oracle. The information leaked is the *difference* between responses, not the wording of
  them.
- **Deleting declined words to keep the data file tidy.** This was proposed in the same
  week and would have quietly undone the whole decision: a deleted word is a new word again
  the next morning. The declined list is not clutter, it is the mechanism.
- **Telling honest suggesters what happened while staying silent to the rest.** We cannot
  tell them apart. There are no accounts, and we deliberately do not log who suggests
  anything.
- **Rate limiting instead.** Would have slowed that particular evening down and does nothing
  about someone patient. It is not mutually exclusive with this decision; we simply never
  needed it.

## Consequences we accepted

A suggester acting in good faith, whose word was declined for a reason they would have
understood and accepted, is told nothing and will never find out. We know. We chose it, and
the cost falls on the actor we already serve worst — see `../02-actors.md`.

Two things follow that catch people out later:

- We cannot add "your word is in the queue", a confirmation mail, or any way to look up your
  own suggestion, without reopening this. Each of those is the same oracle wearing a
  friendlier hat.
- Code that accepts a suggestion and stores nothing is doing its job. It looks like a
  dropped write, and it is the point of this file.
