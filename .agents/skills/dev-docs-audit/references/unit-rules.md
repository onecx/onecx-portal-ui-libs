# Unit rules (from dev-docs/unit-template.adoc)

The template in the repo is authoritative. Re-read it if it may have changed.

## Section order

Keep this order. Optional sections appear only when they have content. Never add empty sections.

0. Text before Question answered (if any): at most one sentence that orients the reader. Do not add it if it is missing.
1. Question answered: one sentence, one question. Two questions mean two Units. When an existing page chains several closely related sub-questions of one topic, merge them into one question. Do not split the Unit, and do not rename headings.
2. Why it exists: the problem or design constraint. It comes before any mechanism.
3. How it works: framework-agnostic first, with source links.
4. Libs side / Shell side: two subsections. Describe both sides even when one is small.
5. Angular / React (optional): only the differences. Do not repeat the framework-agnostic text.
6. Edge cases & pitfalls
7. Debugging (optional): link to Area 13 (Diagnostics) for general tools.
8. Known issues (optional): actual behaviour, why it looks wrong, source file.
9. Related Units
10. Sources: `Code::` list, with no verification sources. Keep other existing entries, such as "Context given by the team::", unchanged.

## Rules

- Audience: maintainers of the libs and the Shell, and advanced App developers. Explain how and why. How-tos belong in docs-guides-ui.
- Register: a Unit is an explanation. Each section keeps its own register: *Why it exists* argues the design decision, *How it works* states the mechanism dry, *Edge cases & pitfalls* and *Debugging* are action (imperative, condition first). Do not lecture *why* inside *How it works*, and do not drop reference tables into *Why*.
- Explain each concept once, in its owning Area. Other Units link to it.
- Deprecated APIs get one short note plus a pointer to the replacement.
- Size: about 10 minutes to read. The template says "≈300 lines", but paragraphs here sit on single lines. Use the word count from `measure.py` instead.
- Diagrams: Mermaid or ASCII only.
- Link to files, not line numbers. Name the class, function, or constant in the link text.
- Every file named in *How it works* also appears in *Sources*. If the body links a file that is missing from Sources, add it and mention the addition in the report.
- Cross-Area links use the planned slugs from the index.
- Overview page (`README.adoc`): Problem, Big picture, Unit map, Related Areas. It links to Units and does not explain mechanisms. Keep extra sections that other Units link to, such as `#debugging-conventions`. Shorten them, but do not remove them.
- Anchors: you may add an explicit anchor (`[#id]`) to support a `<<id>>` cross-reference. Never rename existing anchors or headings.

## Expected yield

Link-heavy Units usually shrink by 20–30%, and reference tables by about 10%. Related Units, Sources, and link text set a floor on the count. Do not chase a percentage at the cost of facts.
