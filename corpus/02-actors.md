# The three actors

Three groups of people touch this service, and they want incompatible things. Nearly every
rule in `05-rules.md` is a conflict between them that somebody already settled. If you are
about to change a rule, find the conflict it settles first.

## The suggester

Anyone on the internet. Suggests a word, usually one, usually once. Wants their word to
appear, and — naturally — wants to know what happened to it.

They get none of that. No confirmation, no rejection, no way to look up their own
suggestion. This is the actor we deliberately serve worst.

## The admin

Two people, Priya and Tom, who do this alongside other work. Between them they spend
around ten minutes a day on it. They want a queue short enough to clear in one sitting, no
correspondence with suggesters, and no chance of being the person who let something
embarrassing onto a school website.

They are not developers. They work from one page that lists what is waiting, with a box for
their name and two buttons per word, and they have never asked for more than that.

## The partner and its readers

The partner, and through them schoolchildren aged about 9–15. They want a short list, safe
for the audience, and stable — the same words in the same order today as yesterday, give or
take.

They are the only actor with a contract, so when the conflict is genuine, they win.

## Where they conflict, and how it was settled

| Conflict | Settled as | Where |
|---|---|---|
| Suggester wants feedback; admin does not want an argument or a resubmission | Suggesters are told nothing at all, ever | `decisions/0002-silent-drop-for-declined-text.md` |
| Suggester wants their word published quickly; partner wants a list that does not churn | Ten words, oldest approval first, new ones wait | `05-rules.md` R5 |
| Admin wants less work; partner requires a named human behind every published word | The decision itself is never automated; we speed up the review instead | `decisions/0001-no-auto-approval.md` |
| Admin wants to decide in two clicks with no login; the contract wants an accountable person | A required, unverified name typed on every decision | `decisions/0003-named-approver-instead-of-auth.md` |

Note the shape of it: every settlement costs the suggester something. That is a deliberate
position, not an accident of implementation. If a change would improve the suggester's
experience, it is probably reopening one of these, and it needs a decision file rather than
a commit.
