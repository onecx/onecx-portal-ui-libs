# Audit lenses

Give every page a verdict on all three lenses. The run mode, picked in [area-agent.md](area-agent.md#code-scope), sets how much code the first two lenses investigate:
- **Full run**: the whole libs and Shell codebase.
- **Maintenance run**: only the code changed by the relevant commits since the last audit.

The brief check always runs when the Area has a brief. Each bullet below is a check, and every failed check is a finding.

## 1. Coverage: the page holds what matters

- **Brief** (only when the Area has one; with *no brief*, skip this check): give every topic in the brief a verdict:
  - *covered*: cite the Unit and section;
  - *mismatched*: cite the Unit and the discrepancy;
  - *missing*: add it to the owning Unit, or to a new Unit.

  A new Unit uses its planned slug from the root index if one exists. Otherwise give it a new slug and add a Handoff entry for the index. Either way, add it to the Area's Unit map.
- **Team context**: a must-include fact from the brief may be impossible to trace in code. Include it anyway, under a heading that does not claim history or documentation. Add it to Sources as `Context given by the team::`.
- **Code self-check**:
  - *Full run*: search the whole libs and Shell codebase for the code the Area owns. Start from the Sources of its pages, then follow imports, exports, and every use of its Topics, services, tokens and config keys.
  - *Maintenance run*: check only the code changed by the relevant commits.
  - For each public API, Topic, config key, default, error path and lifecycle hook a maintainer touches when changing this behaviour, some Unit must explain it.
  - A gap inside the Area's scope (README *Problem* / *Big picture*) is a finding.
  - Material owned by another Area gets one sentence plus a link.
- **Over-scope**: trim content outside the Area's stated scope to a pointer.
- **Finished Area**: every Unit-map entry links an existing page. Fix each "planned", "TODO", "WIP" or "coming soon" marker by writing the page, or by removing the entry and adding a Handoff for the root index.

## 2. Correctness: every claim traces to code

- **Trace** factual claims to the code. In a full run, trace every claim. In a maintenance run, trace the claims that cite changed code, plus any claim the brief check touches. Trace them against the pinned libs commit (your worktree) or a source checkout. A claim is any identifier, file path, Topic name, payload shape, default, version, ordering or timing rule, error message, or framework difference. Read the code itself rather than trusting the page's Sources list.
- **Wrong** claim: correct it, and log *before → after* with the evidence file.
- **Untraceable** claim that is not from the brief: reword it to what the code shows, or remove it. Log it under *Unverified facts*.
- **Links**: every target exists. The link text names a class, function or constant that really is in the target file.
- **Diagrams and code blocks**: every node, arrow and line matches a real call, publish or signature. Correct only what is wrong, and log the correction. The tightening step keeps them byte for byte. This lens may change them.
- **Attribution**: a vague source ("Experts believe", "Industry reports suggest", "it's well known that") names no one. Name the real source and add it to the page's Sources, or delete the claim.
- **Known issues**: each one still holds in the code. Remove an issue that has been fixed, and cite the fixing file.
- **Deprecated APIs**: one short note plus a pointer to the replacement.
- **Sources**: hold `Code::` and existing team-context entries only. Remove `Verification Sources checked` lists and Area-level verification notes, together with any links to them.

## 3. Readability: tight and well separated

- **Structure**: Units follow the section order in [unit-rules.md](unit-rules.md), and the Area README has Problem, Big picture, Unit map and Related Areas. The lint checks `section-order`, `missing-section` and `readme-sections` cover this.
- **Separation**:
  - One question per Unit. A Unit that answers two questions is split, with a Handoff for the index.
  - An explanatory paragraph that appears on several pages of the Area stays with its owner, and the other pages link to it.
  - A non-template passage repeated across Units, such as a debugging cheat sheet, moves to one README section that the Units link to.
- **Tightness**: apply [cutting-tests.md](cutting-tests.md), section tests first, then sentence tests. The budget is about 2,000 prose words per Unit, as measured by `measure.py`. A Unit still over budget after cutting is split, with a Handoff for the index. Facts stay.
- **Clarity**: a flow with three or more actors gets a Mermaid diagram. Terms use the spelling of the root index.
- **Voice**: pages read as the team's own documentation, with no mention of the audit, the tooling or the PR. No hedging ("likely", "arguably", "it's important to note") and no machine cadence: the linter flags the mechanical tells, and [cutting-tests.md](cutting-tests.md) *Voice* covers the rest, including em-dash ban and varying the rhythm so a fully-cut page does not read sterile.
