# Cutting tests

## Section level (run first; biggest wins)

- **Pointer test.** Does another Unit or Area own this concept? Then write one sentence and link to it.
- **Restatement test.** Does the page say this already (Question → Why → How → Angular/React)? Keep the best place and delete the others.
- **Decision test.** List the decisions a maintainer makes with this page. Delete paragraphs that help with none of them.
- **Incident test.** Is this a bug or investigation story? Keep the 1–2 sentence lesson.
- **Topic test.** Can you name the section's topic in one sentence? If not, split it or restructure it.
- **Earned-words test.** Would the reader use every line? Background that does not change behaviour goes.

## Sentence level (paramedic method)

1. Find the action hidden in a noun ("performs validation of" → "validates").
2. Make the actor the subject ("the value is published by the Shell" → "the Shell publishes the value").
3. Cut slow starts ("It is important to note that", "Note that", "Basically").
4. Cut redundancy (doubled adjectives, "in order to", "each and every", repeated qualifiers).
5. Split run-ons. Aim for at most ~25 words per descriptive sentence. Exceed that only when a list would read worse.
6. Put the conclusion first, then the reason.

## Shape

- Three or more parallel items → bullet list with a short bold lead term.
- Items with several attributes → table.
- Never write a one-item list.
- Introduce lists with a full sentence or a clear lead phrase.
- One idea per paragraph.

## Never cut

- Code, listing, and Mermaid blocks (byte for byte).
- Link macro targets and identifiers in link text.
- Version numbers, default values, flags, topic names, and ordering or timing rules.
- Warnings, Edge cases & pitfalls entries, and Known issues entries (shorten wording only).
- Sources entries for files still named in the body.
- Cross-links to other Units.

## Voice (unslop)

A page can pass every section test and every paramedic step and still read machine-written. Run these over the prose; the linter already catches the mechanical ones (`lint.py`: `em-dash`, `curly-quote`, `emoji`, `ai-vocab`, `metaphor-noun`, `fancy-is`, `not-just-but`, `inline-header-list`, `title-case-heading`, `bold-overuse`). What the linter can't decide, you do:

- **Em dashes are banned.** Split the sentence into two or reword with a comma. No `—` anywhere.
- **Keep the verb and the article.** Tight is not verbless. A line with no verb, or a dropped "the", reads as AI. "Remove the backup file", not "Remove backup file". No symbol-speak or telegraphic fragments.
- **Rule of three.** Three padded parallel items ("fast, reliable, and modern") is a tell. Two honest items beat a padded trio.
- **Synonym cycling.** Naming the same thing "the preloader", "the mechanism", and "that system" in one page teaches three things. One term, everywhere.
- **False ranges.** "from the preloader to the router" on a scale that isn't a scale. Delete the range, state the two things.
- **Hedging.** "likely", "arguably", "it's important to note", "one could say". State the fact or name the source. See [audit-lenses](audit-lenses.md) Correctness.
- **Generic conclusions.** "In conclusion, this is important." "Understanding this helps developers." Delete the line; the section already made the point.
- **Mannered prose.** Aphorisms, personified code ("the router chooses"), flourish. Say the mechanism and the number, not the feeling. If the sentence could sit unchanged in another project's docs, it says nothing about this one.
- **Vary the rhythm.** Every sentence clipped short reads mechanical on its own. A doc that obeys every rule above and still feels sterile needs a longer sentence carrying a fact with its condition, and a place where the writer takes a view (explanation allows it).

## Global English: no two readings

- Keep `only` and `not` next to the word they change.
- Break long noun strings: "the script that checks the preloader version".
- Every `it`, `this`, `that` points at one obvious thing. Never `this`/`which` pointing at a whole clause.
- No slashes. "a, b, or both", not "a/b" or "and/or".
- Periods, not semicolons.
- One name per thing across the page and the Area (see [seams](seams.md)).

Worked standard:

> Before: *Configuration of the preloader budget parameters is performed via `budget.json`. Note that it's important to remember that running with `--write`, which updates the committed budget, should only be done when lowering it.*
> After: *`preloaders.ts` reads the committed version from `budget.json`. Run it with `--write` only to lower the version.*

## Red flags in this corpus

- 100–200-word single-line paragraphs that mix problem, mechanism, and config.
- "Question answered" that holds two questions.
- The same Angular-vs-React comparison told three times.
- An Area README that re-explains what its Units explain.
