# `.claude/` — the skills this repository ships

This repository is an example twice over. It demonstrates keeping business context in
`corpus/`, and it demonstrates writing skills, which is what this directory is.

```
.claude/skills/
├── corpus-check/SKILL.md    reports code/corpus mismatches; cannot write
└── corpus-fix/SKILL.md      acts on them; can write to corpus/ only
```

Both are **project skills**: put a `SKILL.md` under `.claude/skills/<name>/` and it is
available whenever this repository is the working directory. Nothing to install, nothing to
configure, and it arrives with a clone — which is the whole reason the directory is checked
in rather than kept in someone's home folder.

## The file

A `SKILL.md` is YAML frontmatter followed by markdown instructions. The fields used here:

| field | what it does |
|---|---|
| `name` | must match the directory name |
| `description` | when to use the skill |
| `user-invocable` | makes it available as `/corpus-check` |
| `allowed-tools` | the only tools the skill may use |

**`description` is the highest-leverage line in the file.** It is what gets matched against
when deciding whether a skill applies, and it is loaded into every session while the body is
not — so it has to say *when to reach for this*, not just what it is. Both descriptions here
name the situations out loud: reviewing a pull request, before merging a behaviour change,
someone asking whether the corpus is still true.

That cuts both ways: because descriptions load into every session, these two skills announce
that a corpus exists even in a checkout where `corpus/` has been deleted. A copy meant to be
without one has to lose this directory as well.

## Two things these skills are trying to demonstrate

**Enforce intent with the tool list, not with instructions.** `corpus-check` reports
mismatches and must not fix them — so it lists `Read`, `Glob`, `Grep`, `Bash` and no write
tools at all. It cannot helpfully repair what it finds, whatever anyone asks it to do
mid-run. `corpus-fix` gets `Edit`, `Write` and `AskUserQuestion`, and its instructions narrow
that further to `corpus/` only. Where a constraint really matters, spend the tool list on it;
prose is a weaker guarantee than an absent capability.

**A skill holds the method; the repository's facts belong in the corpus.** Neither file
mentions this service, its rules, its routes or its vocabulary — you could drop both into an
unrelated repository unchanged. That is not tidiness for its own sake. The corpus is already
responsible for keeping those facts true, and a copy inside a skill is a second copy that
nobody updates and nothing checks. If a skill ever seems to need a repository-specific fact,
that is a gap in the corpus, and filling it there fixes the problem for every other reader
at the same time.

The same split applies to `AGENTS.md` one directory up: technical instructions, house
conventions, how to run the thing. Method and mechanics there and here; business meaning in
`corpus/`.

## Copying them into your own repository

Copy `corpus-check/` and `corpus-fix/` into your `.claude/skills/`. There is nothing to
change — that is the point of keeping them generic. They assume your business context lives
in a directory called `corpus/`; if yours is called something else, say so in your
`AGENTS.md` and both skills will look there.
