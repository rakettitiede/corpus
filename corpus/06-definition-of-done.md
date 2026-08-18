# What "done" means here

The test suite is not the definition — there isn't one. These are.

## Every change

- **The corpus is updated in the same pull request.** If behaviour changed and no file in
  `corpus/` changed, the pull request is not finished. If behaviour changed and the corpus
  genuinely did not need to change, say so in the description; it is usually a sign that
  something was missed.
- **Someone who cannot read code can read the corpus diff and say whether it is right.**
  That is the actual review. The code diff is checked by developers; the corpus diff is
  checked by whoever knows the business, and that person is the one who can catch a change
  that is technically correct and means the wrong thing.

## Changes the partner can see

Anything that alters **what is published, how much of it, in what order, or how long a word
may be** — R1, R5 and R6 in `05-rules.md` — needs the partner's sign-off before merge, not
after. We are inside their page. They find out either way; the only question is whether
they find out from us or from a teacher.

## Changing or reversing a rule

Write a file in `decisions/`, following the shape of the ones already there: the context,
the decision, **what was rejected and on what grounds**, and the consequences we accepted.

The rejected options are the part that matters. Every decision in that directory has been
proposed again at least once by somebody sensible who did not know it had already been
tried, and the file is what ends that conversation in a minute instead of a sprint.

## Not done

- A change that makes the suggester's experience better without saying which settlement in
  `02-actors.md` it reopens.
- A tidy-up that removes something because it looks useless. Everything in this service that
  looks useless has a file about it.
