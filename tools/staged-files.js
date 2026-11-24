const { execFileSync } = require('node:child_process')

/** Runs git and returns its stdout; `options` (e.g. cwd, input, env) are passed to child_process. */
function git(args, options = {}) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, ...options })
}

/** Lists staged added/copied/modified/renamed/typed files (NUL separated, so any file name works). */
function stagedFiles() {
  return git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR']).split('\0').filter(Boolean)
}

/**
 * Parses the `git diff -U0` output of ONE file into the added/changed line ranges of its new side.
 * The file name is known from `git diff --name-only -z`, so no path header is parsed: names with
 * spaces, quotes or non-ASCII characters and diff.noprefix cannot cause a mismatch.
 * Throws when the output has no `diff --git` header (nothing parseable), so a staged file is never skipped silently.
 * A header without hunks (mode change, empty new file, pure deletion) has no new lines and yields no ranges.
 */
function parseHunkRanges(diff, file) {
  if (!/^diff --git /m.test(diff)) {
    throw new Error(`cannot parse the staged diff of ${file}`)
  }
  const ranges = []
  for (const line of diff.split('\n')) {
    const hunk = /^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/.exec(line)
    if (hunk) {
      const start = Number(hunk[1])
      const count = hunk[2] === undefined ? 1 : Number(hunk[2])
      if (count > 0) ranges.push([start, start + count - 1])
    }
  }
  return ranges
}

/** Maps the new path of every staged rename to its old path. */
function stagedRenames() {
  const fields = git(['diff', '--cached', '--name-status', '-z', '-M', '--diff-filter=R']).split('\0').filter(Boolean)
  const renames = {}
  for (let i = 0; i + 2 < fields.length; i += 3) renames[fields[i + 2]] = fields[i + 1]
  return renames
}

/**
 * Reads the staged added/changed line ranges of every staged file accepted by `include`.
 * Without `followRenames` a renamed file counts as completely new (conservative); with it, only the lines changed
 * compared to the old path count, so moving a file does not turn its existing content into new code.
 */
function stagedRanges(include, { followRenames = false } = {}) {
  const renames = followRenames ? stagedRenames() : {}
  const ranges = {}
  for (const file of stagedFiles().filter(include)) {
    const paths = renames[file] ? ['-M', '--', renames[file], file] : ['--', file]
    const diff = git([
      '-c',
      'core.quotePath=false',
      'diff',
      '--cached',
      '--no-ext-diff',
      '--no-color',
      '--src-prefix=a/',
      '--dst-prefix=b/',
      '-U0',
      ...paths,
    ])
    ranges[file] = parseHunkRanges(diff, file)
  }
  return ranges
}

function overlapsRanges(ranges, first, last) {
  return ranges.some(([from, to]) => first <= to && last >= from)
}

module.exports = { git, overlapsRanges, parseHunkRanges, stagedFiles, stagedRanges }
