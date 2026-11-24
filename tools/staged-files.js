const { execFileSync } = require('node:child_process')

/** Runs git and returns its stdout. */
function git(args) {
  return execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })
}

/** Lists staged added/copied/modified/renamed/typed files (NUL separated, so any file name works). */
function stagedFiles() {
  return git(['diff', '--cached', '--name-only', '-z', '--diff-filter=ACMR']).split('\0').filter(Boolean)
}

module.exports = { git, stagedFiles }
