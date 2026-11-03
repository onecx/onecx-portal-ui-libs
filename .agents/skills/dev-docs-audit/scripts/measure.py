#!/usr/bin/env python3
"""Measure prose length/readability of AsciiDoc files, or check that a rewrite preserved code and links.

Usage:
  measure.py [--wpm N] PATH...                 # files or directories (*.adoc)
  measure.py --check-preserved ORIG NEW        # exit 1 if blocks/link targets/sections differ
  measure.py --check-preserved --git-ref REF FILE...   # compare FILE with its version at REF (run inside the repo)
"""
import argparse
import re
import subprocess
import sys
from collections import Counter
from pathlib import Path

DELIM = re.compile(r"^(-{4,}|\.{4,}|\+{4,}|/{4,})\s*$")
LINK = re.compile(r"(?:link:|xref:|https?://)([^\s\[]*)\[([^\]]*)\]")
XREF = re.compile(r"<<([^,>]+)")
HEADING = re.compile(r"^(={1,6})\s+(.*)$")
SENT_SPLIT = re.compile(r"(?<=[.!?])\s+(?=[A-Z`*_(])")


def parse(text):
    """Return (prose_lines, blocks, headings)."""
    prose, blocks, headings = [], [], []
    in_block, delim, buf = False, None, []
    for line in text.splitlines():
        m = DELIM.match(line)
        if in_block:
            if m and line.strip() == delim:
                blocks.append("\n".join(buf))
                in_block, buf = False, []
            else:
                buf.append(line)
            continue
        if m:
            in_block, delim = True, line.strip()
            continue
        s = line.strip()
        if not s or s.startswith("//") or re.match(r"^:[\w-]+:", s) or re.match(r"^\[.*\]$", s) or s.startswith("|==="):
            continue
        if s.startswith("toc::") or s.startswith("include::"):
            continue
        h = HEADING.match(s)
        if h:
            headings.append(h.group(2).strip())
            continue
        prose.append(s)
    return prose, blocks, headings


def clean(line):
    line = LINK.sub(lambda m: m.group(2), line)
    line = re.sub(r"<<[^,>]*,?([^>]*)>>", r"\1", line)
    line = re.sub(r"^[*.\-]+\s+", "", line)
    line = re.sub(r"^\|", "", line).replace("|", " ")
    line = re.sub(r"[`*_+#]", "", line)
    return line


def stats(path, wpm):
    prose, blocks, headings = parse(Path(path).read_text(encoding="utf-8"))
    text = [clean(l) for l in prose]
    words = sum(len(t.split()) for t in text)
    sentences = [s for t in text for s in SENT_SPLIT.split(t) if s.split()]
    lens = [len(s.split()) for s in sentences] or [0]
    para_max = max((len(t.split()) for t in text), default=0)
    return {
        "words": words,
        "min": words / wpm,
        "avg_sent": sum(lens) / len(lens),
        "long_sent": sum(1 for n in lens if n > 30),
        "max_para": para_max,
        "headings": len(headings),
    }


def collect(paths):
    out = []
    for p in paths:
        p = Path(p)
        out.extend(sorted(p.rglob("*.adoc")) if p.is_dir() else [p])
    return out


def check_preserved(o_text, new):
    n_text = Path(new).read_text(encoding="utf-8")
    _, o_blocks, o_heads = parse(o_text)
    _, n_blocks, n_heads = parse(n_text)
    o_links = Counter([m.group(1) for m in LINK.finditer(o_text)] + [f"<<{x}>>" for x in XREF.findall(o_text)])
    n_links = Counter([m.group(1) for m in LINK.finditer(n_text)] + [f"<<{x}>>" for x in XREF.findall(n_text)])
    o_attrs = [l for l in o_text.splitlines() if re.match(r"^:[\w-]+:", l)]
    n_attrs = [l for l in n_text.splitlines() if re.match(r"^:[\w-]+:", l)]
    problems = []
    if o_blocks != n_blocks:
        problems.append(f"code/listing blocks changed ({len(o_blocks)} -> {len(n_blocks)})")
    missing = sorted(t for t in o_links if t not in n_links)
    if missing:
        problems.append("link targets removed: " + ", ".join(missing))
    fewer = sorted(f"{t} ({o_links[t]}->{n_links[t]})" for t in o_links if 0 < n_links[t] < o_links[t])
    if fewer:
        print(f"WARN {new}: link occurrences reduced (OK if duplicate links were removed on purpose): " + ", ".join(fewer))
    if o_heads != n_heads:
        problems.append(f"headings changed:\n  before: {o_heads}\n  after:  {n_heads}")
    if o_attrs != n_attrs:
        problems.append("attribute header lines changed")
    if problems:
        print(f"FAIL {new}")
        for p in problems:
            print("  - " + p)
        return 1
    print(f"OK   {new}")
    return 0


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--wpm", type=int, default=238, help="reading speed (Brysbaert 2019 non-fiction mean)")
    ap.add_argument("--check-preserved", action="store_true")
    ap.add_argument("--git-ref", help="with --check-preserved: read originals from git at this ref")
    ap.add_argument("paths", nargs="*")
    a = ap.parse_args()
    if a.check_preserved:
        if a.git_ref:
            rc = 0
            for f in a.paths:
                rel = subprocess.run(["git", "ls-files", "--full-name", f], capture_output=True, text=True, check=True).stdout.strip()
                orig = subprocess.run(["git", "show", f"{a.git_ref}:{rel}"], capture_output=True, text=True, check=True).stdout
                rc |= check_preserved(orig, f)
            sys.exit(rc)
        if len(a.paths) != 2:
            ap.error("--check-preserved needs ORIG NEW (or --git-ref REF FILE...)")
        sys.exit(check_preserved(Path(a.paths[0]).read_text(encoding="utf-8"), a.paths[1]))
    files = collect(a.paths or ["."])
    rows = sorted(((stats(f, a.wpm), f) for f in files), key=lambda r: -r[0]["words"])
    print(f"{'words':>6} {'min':>5} {'avgSent':>7} {'>30w':>5} {'maxPara':>7}  file")
    total = 0
    for s, f in rows:
        total += s["words"]
        print(f"{s['words']:>6} {s['min']:>5.1f} {s['avg_sent']:>7.1f} {s['long_sent']:>5} {s['max_para']:>7}  {f}")
    print(f"{total:>6} {total / a.wpm:>5.1f}  TOTAL ({len(rows)} files)")


if __name__ == "__main__":
    main()
