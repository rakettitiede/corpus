# The rules, and why they exist

Every rule the service enforces. None of these numbers is arbitrary; if one looks arbitrary
in the code, this is where the reason lives.

## R1 — A suggestion may be at most 40 characters

The widget is a narrow sidebar column. The partner's own CSS truncates at 42 characters and
appends an ellipsis, so anything longer than 40 plus their two characters of ellipsis is
cut off mid-word on their site, not ours.

40 is therefore *their* number, not a guess about how long English words get. Raising it
does not break anything we can see from here — it breaks their layout, quietly, on a page we
never look at. **This is a partner-visible change: it needs their sign-off before merge.**
(Yes, the longest words in our list are nowhere near 40. The limit exists for the
suggestions we reject, not the ones we publish.)

## R2 — Two suggestions are the same word if they match once lower-cased and whitespace-collapsed

In April 2025 a single word arrived thirty-odd times in an evening in every combination of
capitals. Comparing the flattened form ended it.

The flattening is only for comparison, and it is never stored. We keep and publish the
letters the suggester actually typed: *Byzantine* keeps its capital because it is a place
before it is an adjective, and *petrichor* is not *PETRICHOR*. Both halves of this rule are
deliberate. Flattening the stored word instead would make the comparison marginally cheaper
and quietly destroy the thing we publish.

## R3 — A word we already know is accepted and then dropped, silently

Whether we already know it because it is queued, published, or was declined last year, the
suggester gets the same acceptance as everyone else and nothing is stored.

Declined words are kept forever precisely so they can keep doing this. Deleting them to tidy
up the data file would let every declined word be resuggested the next morning. See
`decisions/0002-silent-drop-for-declined-text.md`; returning an error instead was considered
and rejected there.

## R4 — Every decision records the name of the person who made it

Approving or declining without naming yourself is refused. The name is not checked against
anything, because there is nothing to check it against.

This is the brand-safety clause in `01-what-this-is.md`, implemented at the only point where
it can be: the moment a human takes responsibility for a word. It is an audit trail, not a
security control, and it was never meant to be one — see
`decisions/0003-named-approver-instead-of-auth.md` before touching it.

## R5 — The list is the first ten entries by approval time, oldest first

Ten because the widget has ten slots. Oldest first because the partner asked for a list
that does not reshuffle: their front end caches it, and a list that reorders reads as
flicker to a class of nine-year-olds.

The consequence is real and we accepted it: once ten words are approved, an eleventh waits
indefinitely, and the only way to publish it is for someone to remove a published word by
editing the data file. Approving a word therefore does not mean publishing it, and an admin
who approves something and cannot find it on the list has not hit a bug.

Sorting newest first would make the service feel alive and would break the promise. **Both
the length and the order are partner-visible: neither changes without their sign-off.**

## R6 — Nothing is published that a named human did not approve

No automatic approval, of any kind, by any mechanism. This is the one rule with no
exception and no threshold to tune, and it is the subject of
`decisions/0001-no-auto-approval.md`.
