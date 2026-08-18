#!/bin/sh
# Build the copy a demo is run from: this repository, with the things the assistant must not
# be able to read taken out of it.
#
#   ./prepare.sh with        keeps corpus/, .claude/ and AGENTS.md whole, and drops the demo
#                            half of README.md — which holds the answers /corpus-check is
#                            supposed to work out for itself
#   ./prepare.sh without     Act 2: no corpus anywhere, in any file, in any history
#
# Both write ../test-it-out, and neither touches this repository. Stripping a COPY rather
# than this repository is what lets .git go with it — otherwise every stripped line is still
# there in the history, in a diff, in a deleted line — and it means there is nothing to
# restore when the demo is over. The copy gets no history of its own either: /corpus-check
# reads git log as evidence of what changed when, and a history invented at copy time is a
# fiction it would read as fact.
#
# Everything is checked before anything is written, and the copy is built under a temporary
# name and moved into place only once it is complete and verified. A failure at any point
# leaves you with no ../test-it-out rather than a half-stripped one, because a half-stripped
# copy is worse than none: it still carries the thing the demo depends on it not carrying.

set -eu

fail() { echo "prepare: $*" >&2; exit 1; }

usage() {
  cat >&2 <<'USAGE'
usage: ./prepare.sh with|without

  with       Use this to create a copy of the repository WITH the corpus, so you can check
             how an AI answers with the help of the corpus. corpus/, .claude/ and AGENTS.md
             are kept whole; the demo half of README.md is not.

  without    Use this to create a copy of the repository WITHOUT the corpus, so you can check
             how the same AI answers without it. No mention of the corpus survives anywhere
             in the copy.

Both write ../test-it-out and refuse if it already exists, so switch modes with
rm -rf ../test-it-out. There is no default mode: guessing it wrong either deletes a corpus
nobody asked to delete or hands over a copy that gives the demo away.
USAGE
  exit 2
}

[ $# -eq 1 ] || usage
case $1 in
  with|without) mode=$1 ;;
  *) usage ;;
esac

# ---------------------------------------------------------------- preflight: the source

src=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd) || fail "cannot resolve my own directory"

for cmd in cp sed grep mv rm mkdir find; do
  command -v "$cmd" >/dev/null 2>&1 || fail "'$cmd' not found in PATH"
done

[ -d "$src/corpus" ]    || fail "no corpus/ in $src — is this the right repository?"
[ -d "$src/src" ]       || fail "no src/ in $src — is this the right repository?"
[ -f "$src/AGENTS.md" ] || fail "no AGENTS.md in $src"
[ -f "$src/README.md" ] || fail "no README.md in $src"
[ -r "$src/AGENTS.md" ] || fail "cannot read $src/AGENTS.md"
[ -r "$src/README.md" ] || fail "cannot read $src/README.md"

# Both strips are one cut from a heading to the end of the file. If a heading has been
# renamed, moved or duplicated the cut would take nothing, or take too much, and the copy
# would go out carrying what it was supposed to lose — so refuse before copying anything.
readme_cut='^# The demo'
agents_cut='^## Business context lives in'

check_heading() {  # file, pattern, name, why
  headings=$(grep -c "$2" "$1" || true)
  case $headings in
    1) ;;
    0) fail "$1 has no '$3' heading.
    $4" ;;
    *) fail "$1 has $headings '$3' headings, expected 1" ;;
  esac
}

check_heading "$src/README.md" "$readme_cut" "# The demo" \
  "Everything about the demo belongs under that one trailing heading; this script cuts from
    it to the end of the file, in both modes."
check_heading "$src/AGENTS.md" "$agents_cut" "## Business context lives in ..." \
  "Every mention of the corpus in AGENTS.md must sit under that one trailing heading;
    'without' cuts from it to the end of the file."

# ----------------------------------------------------------- preflight: the destination

parent=$(dirname -- "$src")
[ -d "$parent" ] || fail "$parent does not exist"
parent=$(CDPATH= cd -- "$parent" && pwd) || fail "cannot enter $parent"
[ -w "$parent" ] || fail "$parent is not writable"
dest=$parent/test-it-out

if [ "$mode" = without ]; then
  case $dest in
    *corpus*) fail "the copy would be $dest, and its path says 'corpus': the assistant can
    see its own working directory, and the name alone gives Act 2 away. Move this repository
    somewhere whose parent directory does not say it." ;;
  esac
fi

[ "$dest" = "$src" ] && fail "destination is this repository — that would strip it in place"
case "$dest/" in
  "$src"/*) fail "destination is inside this repository ($dest) — it would copy into itself" ;;
esac
[ -e "$dest" ] && fail "$dest exists. Remove it first: rm -rf \"$dest\""

stage=$dest.partial.$$
[ -e "$stage" ] && fail "$stage exists — remove it and try again"

# From here on anything that fails takes the half-built copy with it.
trap 'rm -rf -- "$stage"' EXIT INT TERM

# --------------------------------------------------------------------------- build it

mkdir -p -- "$stage" || fail "cannot create $stage"
cp -R "$src/." "$stage/" || fail "copy failed (out of disk?)"
cd "$stage" || fail "cannot enter $stage"

# Gone in both modes: the history, which still holds every line the working tree no longer
# does; this script; any deck or editor swap file lying around.
rm -rf .git
rm -f -- prepare.sh
rm -f -- *.pptx .*.sw? *.sw?

# README.md keeps what this service is and how to run it, and loses everything from the demo
# heading down: the acts, the two tracks, and the table of what /corpus-check should find.
sed "/$readme_cut/,\$d" README.md > README.tmp || fail "could not cut README.md"
[ -s README.tmp ] || fail "cutting README.md left it empty"
mv README.tmp README.md

if [ "$mode" = without ]; then
  # The corpus; and the skills, whose descriptions are loaded into every session and so
  # announce that a corpus once existed.
  rm -rf corpus .claude

  sed "/$agents_cut/,\$d" AGENTS.md > AGENTS.tmp || fail "could not cut AGENTS.md"
  [ -s AGENTS.tmp ] || fail "cutting AGENTS.md left it empty"
  mv AGENTS.tmp AGENTS.md
fi

# --------------------------------------------------------- verify before handing over

[ -e prepare.sh ] && fail "prepare.sh survived in the copy"
find . -name '*.pptx' -not -path './node_modules/*' | grep -q . \
  && fail "a deck survived in the copy"
grep -q "$readme_cut" README.md && fail "README.md still has its demo section"
[ -e .git ] && fail ".git survived in the copy"
for kept in README.md AGENTS.md package.json src/server.js data/items.json; do
  [ -s "$kept" ] || fail "$kept is missing or empty in the copy"
done

if [ "$mode" = without ]; then
  for gone in corpus .claude; do
    [ -e "$gone" ] && fail "$gone survived in the copy"
  done
  # One surviving mention does not weaken Act 2, it inverts it: the assistant stops answering
  # and starts asking about the directory it has been told to read.
  leaks=$(grep -rni corpus . --exclude-dir=node_modules || true)
  [ -n "$leaks" ] && fail "the copy still mentions the corpus:
$leaks"
else
  # The mirror image: prove the strip above did not run, and that nothing left in the copy
  # tells the assistant what /corpus-check is supposed to find for itself.
  for kept in corpus/05-rules.md .claude/skills/corpus-check/SKILL.md; do
    [ -s "$kept" ] || fail "$kept is missing or empty in the copy"
  done
  grep -q "$agents_cut" AGENTS.md || fail "AGENTS.md lost its corpus section"
  leaks=$(grep -rniwE 'demos?|planted|spoilers?|one of each kind' . \
    --exclude-dir=node_modules || true)
  [ -n "$leaks" ] && fail "the copy still knows there is a demo, or what it should find:
$leaks"
fi

# ----------------------------------------------------------- publish the finished copy

cd "$parent" || fail "cannot enter $parent"
mv -- "$stage" "$dest" || fail "could not move the finished copy to $dest"
trap - EXIT INT TERM

echo "Copy ready: $dest"
if [ "$mode" = without ]; then
  echo "Open a NEW assistant session there and ask the Act 1 question. Then: rm -rf \"$dest\""
else
  echo "Open a NEW assistant session there and run /corpus-check. Then: rm -rf \"$dest\""
fi
