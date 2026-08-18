---
name: corpus-fix
description: Act on corpus/code mismatches by updating the corpus — asking the user which side is wrong whenever that is not certain from the evidence, then writing the corpus edits for review as a diff. Use after corpus-check, or when someone says the corpus is out of date, stale, or wrong. Edits corpus/ only; it never changes code, and it never invents a business reason.
user-invocable: true
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
  - Edit
  - Write
  - AskUserQuestion
---

# corpus-fix

Take mismatches between `corpus/` and the code, find out which side is wrong, and fix the
corpus where the corpus is what is wrong.

## What this may and may not touch

- **May edit:** files under `corpus/`.
- **May not edit:** anything else. Not `src/`, not tests, not `AGENTS.md`, not config.

When the answer turns out to be "the code is wrong", the correct corpus change is **no
change**. Report the bug and stop. Fixing it is ordinary development work with tests and
review behind it, and quietly editing the corpus to match broken code would launder a defect
into a documented rule — the worst outcome this skill can produce.

**This file holds the method, not the repository's facts.** Nothing here names a rule, a
value or a domain term belonging to any one project; those live in the corpus, which is
responsible for keeping them true. `corpus/` is the conventional directory name — if a
repository keeps its business context elsewhere, `AGENTS.md` or the equivalent will say
where.

## Where the findings come from

Run `corpus-check` first, or work from a report the user already has. If the user names a
specific rule or file, scope to that and skip the rest.

## Step 1 — decide which side is wrong

For each finding, use the evidence rules in `corpus-check` before asking anybody anything.
Some findings answer themselves: a rule backed by a dated file in `decisions/` and an
external commitment, contradicted by a code path that looks incidental, is a bug and does not
need a question.

**Ask the user whenever the evidence is thin, and always when the rule is marked as needing
sign-off or as visible outside the team.** Use `AskUserQuestion`. Batch up to four findings
per call rather than asking one at a time. For each, state the corpus claim and the code
behaviour in one line each, then offer:

- *The corpus is wrong* — behaviour changed on purpose; update the corpus.
- *The code is wrong* — a rule the code stopped honouring; leave the corpus and report a bug.
- *Both are wrong* — nobody agreed what this should do; needs a business decision.
- *Leave it for now* — skip this one.

Never guess in order to avoid asking. A wrong guess here writes a false rule into the file
everyone else will trust.

## Step 2 — fix the corpus, without destroying it

This is where a careless edit does real damage. The corpus is valuable because it carries
*reasons*, and a mechanical update strips them.

**Never replace a reason with a fact.** When a rule states a value and explains why that
value and no other, and the code now uses a different value, the fix is not to overwrite the
number. The old reason does not explain the new number, so one of these is true and you must
find out which:

- There is a new reason. Write it down, in the same plain language.
- The old reason no longer applies. Say what changed and why the constraint lifted.
- Nobody knows. Then say **that**, explicitly, in the corpus.

**Never invent a business reason.** Not a plausible one, not a likely one, not a hedged one.
An invented reason is worse than an admitted gap, because it reads exactly like a real one
and nobody can tell the difference six months later. If the user cannot supply the reason,
write the rule with the reason marked as unknown and leave it for someone who knows. The
shape to follow — state the new rule, then say plainly what is missing:

> **&lt;the rule, as the code now behaves&gt;**
>
> **Reason not recorded.** This was previously *&lt;old rule&gt;*, because *&lt;old reason,
> preserved verbatim&gt;*. It changed on *&lt;date, from the history&gt;* and nobody wrote down
> why, or whether the original constraint still applies. Someone who knows should replace
> this paragraph.

Keep the old reason in the text rather than deleting it. It is the only surviving trace of
why the rule existed, and whoever fills the gap will need it. A paragraph like that is
genuinely useful; a confident fabrication is not.

Other rules for the edit itself:

- **Keep the register.** Plain language, no code quoted, no field names, no function names.
  Anyone who knows the business must be able to read it, because they are the ones reviewing
  the diff.
- **Change as little as possible.** Edit the sentence that is wrong. Do not rewrite the file,
  reorder it, or improve its prose while you are there — a large diff cannot be reviewed by
  the person whose judgement this needs.
- **Follow the cross-references.** A rule usually appears in more than one place: the rule
  file, the glossary, the flow, an actor's expectations. Grep for the old value and the old
  wording, and fix every occurrence or the corpus contradicts itself, which turns a drift
  finding into an undecided-change finding next time.
- **Never edit a decision to make it agree with the present.** Where a corpus keeps dated
  decision records — often a `decisions/` directory, though a repository may organise them
  differently — those files record what was decided, when, and what was rejected. Rewriting
  one destroys the thing that makes it worth having. If a decision has genuinely been
  reversed, add a new dated record that supersedes it, and add one line to the old one
  marking it superseded and pointing forward. Reversing a decision is a business act — ask
  before doing it, always.

## Step 3 — when the answer was not "the corpus is wrong"

**The code is wrong.** Change nothing. Report it as a bug: the rule, where it is enforced or
should be, and the input that shows the divergence. Say plainly that you have not fixed it
and that the corpus is correct as written.

**Both are wrong.** Change nothing on your own judgement. This needs a decision from someone
who can make it. Offer to record the open question in the corpus — an explicit "this is
currently undecided, here is what the code does and what the corpus says" is much better than
silence — but only write it if the user says yes, and never write a resolution.

## Step 4 — hand over the diff

Finish by showing what changed in `corpus/`: `git diff --stat corpus/` and then the diff
itself. The diff is the review, and the reviewer is whoever knows the business, so keep it
small enough to read.

State clearly, in this order:

1. What you changed, and on whose answer.
2. What you deliberately did not change, and why — the bugs, the undecided ones, the ones
   the user skipped.
3. Anything you wrote down as unknown, so it can be picked up by someone who knows.

Do not claim the corpus is now correct. Claim only that it now matches the code where the
user said the code was right.
