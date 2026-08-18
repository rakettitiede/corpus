# 0003 — A required, unverified approver name instead of authentication

**Date:** 2025-03-11 · **Status:** accepted, with a condition attached

## Context

The partner agreement requires that every published word was approved by a named person at
Lexicon. We had six weeks to launch, two admins who sit within sight of each other, and no
login system of any kind.

The clause is about accountability, not access control. Their lawyers wanted a person to be
answerable if something unsuitable appeared beside schoolwork. It says nothing about how we
establish that the person is who they claim to be.

## Decision

Every approve or decline requires a name. It is free text, it is not checked against
anything, and it is stored on the decision forever. Without it the request is refused.

There is no authentication. The admin URLs are simply not published anywhere.

## What was rejected, and why

- **Building authentication before launch.** Two trusted admins and an unadvertised URL,
  against a launch date we had already committed to. The audit trail was the part the
  contract needed; the login was the part we wanted. We shipped the contractual half.
- **No name at all.** Fails the clause outright.
- **Recording a constant, like "admin".** Satisfies the letter of the clause and defeats its
  purpose. The whole value is *which* person, on which date.
- **Inferring the name from something — an IP, a browser, a shared secret in the URL.**
  Roughly the same effort as real accounts, with none of the honesty. A weak mechanism that
  looks like authentication is worse than an obvious placeholder, because someone eventually
  believes it.

## Consequences we accepted

The field is an audit trail. It is not security, it never was, and anyone who can reach the
admin URL can approve a word under any name they like — including someone else's. That is a
known, accepted hole with a locked door in front of it.

Two consequences worth stating plainly:

- **Do not remove the requirement on the grounds that it is not real security.** It is not
  meant to be. Removing it breaks the contract, not the threat model. This has been
  suggested twice by people reading the code without this file.
- **The condition:** this holds while there are two admins who trust each other. If the
  admin group grows beyond a handful, or if anyone outside the office needs to approve, this
  decision expires and real accounts have to be built. Nobody is watching for that, so
  whoever notices it first is the one who has to raise it.
