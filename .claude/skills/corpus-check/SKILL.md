---
name: corpus-check
description: Check whether the code still does what corpus/ says the business rules are, and report every mismatch classified as a bug, corpus drift, or an undecided change. Use when reviewing a pull request, before merging a change that alters behaviour, when someone asks "is the corpus still true?", or on a schedule. Reports only — it never edits code or corpus. To act on what it finds, use corpus-fix.
user-invocable: true
allowed-tools:
  - Read
  - Glob
  - Grep
  - Bash
---

# corpus-check

Compare what `corpus/` claims about the business against what the code actually does, and
report the mismatches.

**This skill does not fix anything.** Not the code, not the corpus. The finding is cheap;
the decision about which side is wrong is the expensive part, and it belongs to a human who
knows the business. Never edit a file while running this skill, and never end the report
with "shall I fix these?" as though the fix were obvious.

**This file holds the method, not the repository's facts.** Nothing here should name a rule,
a limit, a route or a domain term belonging to any one project — those live in the corpus,
which is responsible for keeping them true, and duplicating them here would create a second
copy that silently goes stale. If following this skill ever seems to require knowing
something specific about the repository, that is a gap in the corpus, and reporting it as
one is more useful than patching it into these instructions.

`corpus/` is the conventional name for the directory this skill reads. If a repository keeps
its business context somewhere else, `AGENTS.md` or the equivalent will say where; look
there rather than assuming.

## Scope

- No argument → every checkable claim in `corpus/`.
- `diff` → only the claims that touch files changed against the base branch. This is the
  pull-request check; use `git diff --name-only $(git merge-base HEAD main)...HEAD`.
- A path → only the claims that concern that file or directory.

## The check

1. **Read all of `corpus/`.** Every file, including `decisions/`. You cannot classify a
   finding without knowing which rules are backed by a dated decision.

2. **Extract checkable claims.** A claim is checkable if code could contradict it: a
   number, a limit, an ordering, a required field, a route's behaviour, a thing that must
   never happen, a promise about what a person sees. Extract those.

   Ignore what cannot drift: history, rationale, who wants what, what was rejected and why.
   That prose is the reason a rule exists, not an assertion about today's code. A finding
   that quotes rationale rather than a rule is a false positive.

3. **Find the implementing code for each claim.** Grep for the constant, the value, the
   route, the field name. If a claim has no implementing code at all, that is itself a
   finding — either the feature was removed or it was never built.

   **Rules that forbid something have nothing to grep for.** A rule saying some outcome must
   never happen is satisfied by an *absence*, and searching for the rule's own words finds
   nothing whether it holds or not — so a failed grep looks identical to a passing check.
   Invert the search: work out what the forbidden thing would have to look like if somebody
   had built it — a scheduled job, a call to a third-party service, a default that applies
   when nobody supplied a value, a branch that reaches the outcome by another path — and
   search for *those*. Only then does finding nothing mean anything.

   These are the rules most worth checking. They are the ones a well-meaning change breaks
   by *adding* something helpful, which is exactly the change nobody thinks to question.

4. **Read the code path end to end before judging.** A rule is often enforced somewhere
   other than where you would expect. Two functions away is still enforced.

5. **Look the other way too.** Business-visible behaviour in the code that no claim covers
   is a finding: an undocumented rule that a reviewer has no way to check.

6. **Verify, then classify.** For each surviving mismatch, state the divergence concretely:
   what the corpus says, what the code does, and the input that shows the difference. If
   you cannot write that sentence, drop the finding.

## Classifying a mismatch

|  | Corpus is right | Corpus is wrong |
|---|---|---|
| **Code is right** | no finding | **C — corpus drift** |
| **Code is wrong** | **B — a bug** | **A — an undecided change** |

**B, a bug.** The corpus is right and the code quietly stopped honouring it. A business rule
somebody committed to is not being enforced. This is a defect with a user or a partner on
the other end of it, and it is the most valuable thing this check finds.

**C, corpus drift.** The code is right and the corpus is stale. Behaviour changed
deliberately and nobody updated the description. Cheap to fix, and it must be fixed, because
every later answer drawn from the corpus inherits the error.

**A, an undecided change.** Neither side matches any stated intent, or two corpus files
contradict each other. This is a change that shipped without anyone agreeing what it meant.
It needs a business decision, not a commit — say so and stop there.

### Evidence for deciding which side is wrong

You will often be unable to tell. That is an acceptable answer; a guessed classification is
not.

Points toward **B, the code being wrong**:
- The claim is backed by a dated file in `decisions/`, or cites an external commitment — a
  contract, a partner, a legal clause, a regulator. Decisions are deliberate; code drifts
  silently, so a conflict with a decision is usually the code's fault.
- The corpus marks the rule as needing someone's sign-off, or as visible outside the team.
  A rule carrying that marker was not changed casually, so a code path that ignores it was
  almost certainly changed without anyone realising what it touched. Search the corpus for
  those markers before classifying anything.
- The corpus is internally consistent about the rule across several files.
- The code's behaviour looks incidental: an off-by-one, a condition that no longer fires, a
  branch nobody reaches.

Points toward **C, the corpus being wrong**:
- `git log` shows the source changed after the corpus file did.
- The code's behaviour looks intentional and coherent — named constants, consistent
  neighbours, a commit message describing the change.
- The corpus states the rule loosely and the code is a reasonable sharpening of it.

Points toward **A**:
- Two corpus files disagree, so no reading of the corpus is currently true.
- The code matches neither the old rule nor any rule anybody wrote down.

When the evidence is thin, report the mismatch, give both readings in one sentence each, and
say which you would check first. Do not manufacture confidence.

## False positives are the whole ballgame

A drift report people trust gets read. A noisy one gets ignored, and then the corpus rots —
which is the exact failure this is meant to prevent. **Prefer two findings you are sure of
to ten you are not.**

- Finding nothing is a good outcome. Say so plainly and stop; do not pad the report.
- Never report code style, naming, dead code, missing tests, performance, or anything else
  that is not a divergence in business meaning. Those are a different job.
- A claim you did not manage to check is not a finding. If you could not locate the
  implementing code, say that in one line under "not checked".
- When a mismatch turns out to be your own misreading, drop it silently. There is no credit
  for volume.

One thing worth knowing: a finding that turns out to be invalid still tends to be pointing
somewhere real — usually at a rule that is written ambiguously or a code path that is harder
to follow than it should be. If you are unsure about a finding but the confusion itself
seems informative, report it as a question rather than a defect, and label it that way.

## What each case looks like

Shapes, not instances — the corpus you are reading supplies the instances.

**A bug (B).** A rule requires that something always be recorded, or always be true, of
every item the system produces. A dated decision file explains that the requirement comes
from outside the team. The code has a path that produces the item without it — often one
added later, for a case nobody connected to the rule. A requirement backed by a decision and
an outside commitment does not get relaxed silently, so the code is what is wrong.

**Corpus drift (C).** A rule states a limit and gives a reason grounded in something outside
the code: another system's constraint, a downstream consumer, an agreement. The code now
enforces a different value. `git log` shows the source changed and no corpus file changed
with it. Deliberate, undocumented — but if the corpus marked that rule as visible outside the
team, say so in the finding, because "update the corpus" may not be the whole answer.

**An undecided change (A).** A rule states one behaviour, another corpus file implies a
second, and the code does a third. No two agree. Nobody settled what this should do, and
picking one now would be inventing the answer rather than recording it. Report the three
readings and stop.

**Not a finding.** A decision file describes a mechanism that was tried and withdrawn, and
that mechanism is absent from the code. That is the record doing its job. Rationale, history
and rejected options describe the past; only rules assert something about the present.

## The report

Plain markdown. No preamble.

Open with one line: how many findings, over what scope. Then the findings, **bugs first,
then undecided changes, then drift** — that is the order in which they cost somebody
something.

Each finding gets:

> ### Short title
> **Case B — a bug** · confidence: high / medium / low
> **Corpus says:** the claim, with the file and rule reference.
> **Code does:** the behaviour, with `file:line`.
> **Shows up as:** a concrete input and what happens to it.
> **Whose call:** what a human has to decide, and what to check first if it is unclear.

Close with a "not checked" list if any claim could not be verified, and nothing else. No
summary of your process.

You may end by mentioning that `/corpus-fix` can act on these findings. Do not offer to fix
anything yourself, and do not recommend which findings to fix — that ordering is the
reader's call, made with knowledge of the business you do not have.
