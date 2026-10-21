#!/usr/bin/env python3
"""Mechanical checks for an Area/Unit dev-docs tree. Prints `path:line: [check] message`; exit 1 on findings.

Usage:
  lint.py DEV_DOCS_ROOT                        # whole tree, including root-index checks
  lint.py DEV_DOCS_ROOT --area SLUG [...]      # only pages inside the given Area(s); links into other Areas still resolve
  lint.py ... --map URL_PREFIX=LOCAL_DIR       # resolve absolute links (e.g. the {shell} attribute) against a local checkout
  lint.py ... --list-sources                   # print the code files the in-scope pages link, as `<repo>\t<repo-relative path>`
                                               # (<repo> is `libs` for this repository, else the matching --map URL prefix)

Checks: broken-link, planned-link (target is a planned slug in the root index; informational, does not fail), broken-anchor, unmapped-missing (mapped URL target absent), section-order, missing-section,
readme-sections, unit-map, sources-coverage, stale-marker, verification-sources, area-readme-missing, unindexed-folder.
Voice/format checks (unslop): em-dash and curly-quote and emoji (hard — banned, fails the run) and
ai-vocab, metaphor-noun, fancy-is, not-just-but, inline-header-list, title-case-heading, bold-overuse
(warn — reported for triage, does not fail the clean pass).
"""
import argparse
import re
import sys
from pathlib import Path

ATTR = re.compile(r"^:([\w-]+):\s*(.*)$")
LINK = re.compile(r"(?:link|xref):([^\s\[]+)\[")
XREF = re.compile(r"<<([^,>]+)(?:,[^>]*)?>>")
HEADING = re.compile(r"^(={1,6})\s+(.*?)\s*$")
EXPLICIT_ID = re.compile(r"\[\[([\w-]+)(?:,[^\]]*)?\]\]|\[#([\w-]+)[^\]]*\]|\[id=\"?([\w-]+)")
DELIM = re.compile(r"^(-{4,}|\.{4,}|\+{4,}|/{4,})\s*$")
STALE = re.compile(r"\b(TODO|TBD|WIP|FIXME)\b|coming soon|will be (?:created|written|added) (?:in the future|later)", re.I)
INDEX_AREA = re.compile(r"—\s*`([a-z0-9][\w-]*)/`")

UNIT_ORDER = ["question answered", "why it exists", "how it works", "libs side", "shell side", "libs side / shell side",
              "angular / react", "edge cases & pitfalls", "debugging", "known issues", "related units", "sources"]
UNIT_REQUIRED = ["question answered", "why it exists", "how it works", "edge cases & pitfalls", "related units", "sources"]
HOW_SECTIONS = {"how it works", "libs side", "shell side", "libs side / shell side", "angular / react"}
README_REQUIRED = ["problem", "big picture", "unit map", "related areas"]

# Kinds reported as warnings: they flag voice tells for the subagent to triage
# but do not gate the clean pass. Every other kind is hard and fails the run.
WARN_KINDS = {
    "ai-vocab", "metaphor-noun", "fancy-is", "not-just-but",
    "inline-header-list", "title-case-heading", "bold-overuse",
}
# Em dash only. The en dash is kept: it is the legitimate separator for numeric
# ranges the docs use throughout (Units 4–6, Angular 18–20, the 50–950 scale).
# The ban targets the prose tell, not a valid punctuation role.
EM_DASH = re.compile(r"—")
CURLY_QUOTE = re.compile(r"[“”‘’]")
# Decorative emoji only. The supplementary emoji planes (U+1F000-U+1FAFF).
# Deliberately excludes the arrows (U+2190-21FF) and misc/dingbat blocks: the
# docs use "a -> b" flow arrows and check/cross marks legitimately.
EMOJI = re.compile(r"[\U0001F000-\U0001FAFF]")
# Emoji the docs quote verbatim as code output (a Shell log line such as
# `📢 TKA001: ...` or `🧭 Adding Workspace routes`). These sit inside inline
# code spans and are factual content, not decoration, so the emoji check skips
# them — same carve-out as the flow arrows above.
CODE_SPAN = re.compile(r"`[^`]*`")

# unslop tells (rules 7, 26, 8, 9). Whole-word matches so a real symbol named
# e.g. `feature` is not flagged. "landscape" is the abstract-usage entry only.
AI_VOCAB = [
    "additionally", "crucial", "crucially", "delve", "delves", "enduring",
    "enhance", "enhances", "foster", "fostering", "garner", "garnering",
    "interplay", "intricate", "landscape", "pivotal", "showcase",
    "showcases", "tapestry", "testament", "underscore", "underscores",
    "underscoring", "vibrant",
]
METAPHOR_NOUN = [
    "substrate", "wedge", "vector", "locus", "vantage", "nexus",
    "harness", "bedrock", "scaffolding", "modality", "paradigm", "ratchet",
    "evacuate", "endgame", "flywheel",
]
NOT_JUST_BUT = re.compile(r"(?i)\bnot just\b[^.!?]*\bbut\b")
INLINE_HEADER = re.compile(r"^\s*[-*]\s+\*\*[^*]+\*\*\s*[:：]")
FANCY_IS = ["serves as", "stands as", "boasts", "features "]
STOP_WORDS = {"the", "of", "and", "or", "to", "a", "an", "in", "on", "for",
              "with", "from", "by", "is", "are", "its"}
# Headings the Unit/README template fixes (UNIT_ORDER / README_REQUIRED below).
# Title case is a tell only on headings the author chose, so the fixed section
# names are exempt from the case check.
_TEMPLATE_HEADINGS = set(t.lower() for t in UNIT_ORDER)
_TEMPLATE_HEADINGS.update(t.lower() for t in README_REQUIRED)
_TEMPLATE_HEADINGS.add("verification note")


def is_title_case(text: str) -> bool:
    # Title-case when two-plus four-letter words start with a capital.
    if text.lower() in _TEMPLATE_HEADINGS:
        return False
    words = [w for w in re.findall(r"[A-Za-z0-9]+", text)
             if w[0].isupper() and w[1:].isalpha() and len(w) >= 4
             and w.lower() not in STOP_WORDS]
    return len(words) >= 2


def voice_findings(body, headings, bold_runs):
    # body: (lineno, line) tuples; headings: (lineno, text) tuples.
    out = []
    for n, line in body:
        if m := NOT_JUST_BUT.search(line):
            out.append(("not-just-but", n, m.group(0).strip()[:50]))
        if m := INLINE_HEADER.match(line):
            out.append(("inline-header-list", n, line.strip()[:50]))
    for word in sorted(set(AI_VOCAB) | set(METAPHOR_NOUN)):
        kind = "ai-vocab" if word in AI_VOCAB else "metaphor-noun"
        for n, line in body:
            if re.search(rf"(?i)\b{re.escape(word)}\b", line):
                out.append((kind, n, word))
                break
    for phrase in FANCY_IS:
        for n, line in body:
            if re.search(rf"(?i){re.escape(phrase)}", line):
                out.append(("fancy-is", n, phrase.strip()))
                break
    for n, text in headings:
        if is_title_case(text):
            out.append(("title-case-heading", n, text[:50]))
    if bold_runs > 8:
        out.append(("bold-overuse", 0, f"{bold_runs} bold runs"))
    return out


def auto_id(title):
    t = re.sub(r"<[^>]+>|`|\*|_(?=\w)|(?<=\w)_", "", title).lower()
    t = re.sub(r"[^\w .-]", "", t)
    return re.sub(r"[ .-]+", "-", t).strip("-")


class Page:
    def __init__(self, path):
        self.path = path
        self.lines = path.read_text(encoding="utf-8").splitlines()
        self.attrs, self.ids, self.headings, self.prose = {}, set(), [], []
        in_block, delim = False, None
        for n, line in enumerate(self.lines, 1):
            m = DELIM.match(line)
            if in_block:
                if m and line.strip() == delim:
                    in_block = False
                continue
            if m:
                in_block, delim = True, line.strip()
                continue
            if a := ATTR.match(line):
                self.attrs.setdefault(a.group(1), a.group(2))
            for g in EXPLICIT_ID.findall(line):
                self.ids.update(x for x in g if x)
            if h := HEADING.match(line):
                self.headings.append((len(h.group(1)), h.group(2), n))
                self.ids.add(auto_id(h.group(2)))
            self.prose.append((n, line))

    def expand(self, target):
        for _ in range(5):
            nxt = re.sub(r"\{([\w-]+)\}", lambda m: self.attrs.get(m.group(1), m.group(0)), target)
            if nxt == target:
                break
            target = nxt
        return target


def resolve(page, target, maps):
    target = page.expand(target)
    path, _, frag = target.partition("#")
    if "{" in path:
        return None, frag, f"unresolved attribute in {target}"
    if re.match(r"\w+://", path):
        for prefix, local in maps:
            if path.startswith(prefix):
                return Path(local) / path[len(prefix):].lstrip("/"), frag, None
        return None, frag, None
    if path.startswith("mailto:"):
        return None, frag, None
    return ((page.path.parent / path).resolve() if path else page.path), frag, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--area", action="append", default=[])
    ap.add_argument("--map", action="append", default=[], help="URL_PREFIX=LOCAL_DIR")
    ap.add_argument("--list-sources", action="store_true")
    args = ap.parse_args()
    root = Path(args.root).resolve()
    maps = [tuple(m.split("=", 1)) for m in args.map]
    pages = {p.resolve(): Page(p) for p in root.rglob("*.adoc")}
    out = []
    if args.list_sources:
        found = set()
        for page in pages.values():
            if args.area and not (page.path.parent.name in args.area and page.path.parent.parent == root):
                continue
            for _, line in page.prose:
                for raw in LINK.findall(re.sub(r"\+[^+]*\+", "", line)):
                    target = page.expand(raw).partition("#")[0]
                    if target.endswith(".adoc") or "{" in target:
                        continue
                    hit = next((p for p, _ in maps if target.startswith(p)), None)
                    if hit:
                        found.add((hit, target[len(hit):].lstrip("/")))
                    elif not re.match(r"\w+:", target):
                        path = (page.path.parent / target).resolve()
                        if path.is_relative_to(root.parent):
                            found.add(("libs", str(path.relative_to(root.parent))))
        print("\n".join(f"{r}\t{p}" for r, p in sorted(found)))
        return

    def report(page, line, check, msg):
        out.append(f"{page.path.relative_to(root.parent)}:{line}: [{check}] {msg}")

    index = pages.get(root / "README.adoc")
    indexed_areas, planned, area = [], set(), None
    for line in index.lines if index else []:
        if m := INDEX_AREA.search(line):
            area = m.group(1)
            indexed_areas.append(area)
        elif area:
            planned.update((root / area / f).resolve() for f in re.findall(r"`([\w-]+\.adoc)`", line))
    areas = args.area or [a for a in indexed_areas if (root / a).is_dir()]
    in_scope = [p for p in pages.values() if not args.area or p.path.parent.name in args.area and p.path.parent.parent == root]

    for page in in_scope:
        is_area = page.path.parent.parent == root and page.path.parent.name in areas
        sources_line = next((n for lvl, t, n in page.headings if lvl == 2 and t.lower() == "sources"), None)
        body_targets, source_targets = set(), set()
        h2_at = {n: t.lower() for lvl, t, n in page.headings if lvl == 2}
        section = None
        for n, line in page.prose:
            section = h2_at.get(n, section)
            line = re.sub(r"\+[^+]*\+", "", line)
            for raw in LINK.findall(line):
                target, frag, err = resolve(page, raw, maps)
                if err:
                    report(page, n, "broken-link", err)
                    continue
                expanded = page.expand(raw).partition("#")[0]
                if not target and not re.match(r"\w+://", expanded) or target and target.suffix != ".adoc":
                    if section == "sources":
                        source_targets.add(expanded)
                    elif section in HOW_SECTIONS:
                        body_targets.add(expanded)
                if target is None:
                    continue
                if not target.exists():
                    check = "planned-link" if target.resolve() in planned else "broken-link"
                    report(page, n, check, f"{raw} -> {target.relative_to(root.parent) if target.is_relative_to(root.parent) else target} does not exist")
                elif frag and target.suffix == ".adoc":
                    tp = pages.get(target.resolve())
                    if tp and frag not in tp.ids:
                        report(page, n, "broken-anchor", f"{raw}: no anchor #{frag} in {target.name}")
            for x in XREF.findall(line):
                file, _, frag = x.partition("#") if "#" in x or x.endswith(".adoc") else ("", "", x)
                tp = pages.get((page.path.parent / file).resolve()) if file else page
                if tp is None:
                    report(page, n, "broken-link", f"<<{x}>>: file not found")
                elif frag and frag not in tp.ids:
                    report(page, n, "broken-anchor", f"<<{x}>>: no anchor #{frag}")
            if STALE.search(line):
                report(page, n, "stale-marker", line.strip()[:100])
            if re.match(r"\s*(Verification Sources checked::|=+\s*Verification note)", line, re.I):
                report(page, n, "verification-sources", line.strip()[:100])
        body = [(n, re.sub(r"\+[^+]*\+", "", line)) for n, line in page.prose]
        for kind, n, msg in voice_findings(body, [(n, t) for _, t, n in page.headings],
                                           sum(len(re.findall(r"\*\*[^*]+\*\*", l)) for _, l in body)):
            report(page, n, kind, msg)
        for n, line in body:
            if EM_DASH.search(line):
                report(page, n, "em-dash", line.strip()[:60])
            if CURLY_QUOTE.search(line):
                report(page, n, "curly-quote", line.strip()[:60])
            if EMOJI.search(CODE_SPAN.sub("", line)):
                report(page, n, "emoji", line.strip()[:60])
        if not is_area:
            continue
        h2 = [(t.lower(), n) for lvl, t, n in page.headings if lvl == 2]
        if page.path.name == "README.adoc":
            for req in README_REQUIRED:
                if req not in [t for t, _ in h2]:
                    report(page, 1, "readme-sections", f"missing '== {req}'")
            linked, section = set(), None
            for n, line in page.prose:
                section = h2_at.get(n, section)
                if section == "unit map":
                    linked.update(resolve(page, raw, maps)[0] for raw in LINK.findall(line))
            for sib in sorted(page.path.parent.glob("*.adoc")):
                if sib.name != "README.adoc" and sib.resolve() not in linked:
                    report(page, 1, "unit-map", f"{sib.name} is not linked from the Unit map")
            continue
        known = [(t, n) for t, n in h2 if t in UNIT_ORDER]
        ranks = [UNIT_ORDER.index(t) for t, _ in known]
        for (t, n), prev, cur in zip(known[1:], ranks, ranks[1:]):
            if cur < prev:
                report(page, n, "section-order", f"'{t}' appears after a later template section")
        for req in UNIT_REQUIRED:
            if req not in [t for t, _ in h2]:
                report(page, 1, "missing-section", f"missing '== {req}'")
        if sources_line:
            for t in sorted(body_targets - source_targets):
                report(page, sources_line, "sources-coverage", f"{t} linked in How it works but not listed in Sources")

    if not args.area and index:
        for a in indexed_areas:
            if (root / a).is_dir() and not (root / a / "README.adoc").exists():
                report(index, 1, "area-readme-missing", f"Area folder {a}/ has no README.adoc")
        text = "\n".join(index.lines)
        for d in sorted(p for p in root.iterdir() if p.is_dir()):
            if not re.search(rf"(`|\./){re.escape(d.name)}/", text):
                report(index, 1, "unindexed-folder", f"{d.name}/ is not mentioned in the root index")

    def non_gating(o):
        return "[planned-link]" in o or any(f"[{k}]" in o for k in WARN_KINDS)
    failing = [o for o in out if not non_gating(o)]
    print("\n".join(sorted(out)) if out else "OK: no findings")
    sys.exit(1 if failing else 0)


if __name__ == "__main__":
    main()
