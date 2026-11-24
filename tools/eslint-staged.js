const fs = require('node:fs')
const path = require('node:path')
const { git, overlapsRanges, stagedRanges } = require('./staged-files.js')

const ROOT = path.resolve(__dirname, '..')
const SOURCE_FILE = /^libs\/([^/]+)\/.+\.ts$/
// the rules of our own ESLint plugins (libs/angular-linter-rules, libs/ngrx-linter-rules)
const OWN_RULE = /^@onecx\/[^/]+-linter-rules\//

/** Reads the staged added/changed ranges of every staged library TypeScript file; moved files keep their old lines. */
function stagedSourceRanges() {
  return stagedRanges((f) => SOURCE_FILE.test(f), { followRenames: true })
}

/** Groups the staged ranges by library (libs/<lib>/**). */
function groupByLib(ranges) {
  const libs = {}
  for (const [file, fileRanges] of Object.entries(ranges)) {
    const lib = SOURCE_FILE.exec(file)?.[1]
    if (lib) (libs[lib] ??= {})[file] = fileRanges
  }
  return libs
}

/** Keeps only findings of our own rules that are located on added/changed lines. */
function filterNewCodeFindings(messages, ranges) {
  return messages.filter((m) => OWN_RULE.test(m.ruleId ?? '') && overlapsRanges(ranges, m.line, m.endLine ?? m.line))
}

/** Lints the staged content (not the working tree) of the given files with the lib's own eslint.config.mjs. */
async function lintStagedFiles(lib, files) {
  const { ESLint } = require('eslint')
  let configFile = path.join(ROOT, 'libs', lib, 'eslint.config.mjs')
  if (!fs.existsSync(configFile)) {
    console.warn(`lint:staged ${lib}: libs/${lib}/eslint.config.mjs does not exist, using the root eslint.config.mjs`)
    configFile = path.join(ROOT, 'eslint.config.mjs')
  }
  const eslint = new ESLint({ cwd: ROOT, overrideConfigFile: configFile })
  const results = {}
  for (const file of files) {
    const [result] = await eslint.lintText(git(['show', `:${file}`]), { filePath: path.join(ROOT, file) })
    results[file] = result?.messages ?? []
    // a file ESLint cannot parse has no rule findings; make that visible instead of passing silently
    for (const fatal of results[file].filter((m) => m.fatal)) {
      console.warn(`lint:staged: ${file}:${fatal.line} could not be linted: ${fatal.message}`)
    }
  }
  return results
}

/** Entry point; returns the number of findings on new code. Throws when there are any. */
async function main(readRanges = stagedSourceRanges, lint = lintStagedFiles, log = console.log) {
  const ranges = readRanges()
  if (Object.keys(ranges).length === 0) {
    log('lint:staged: no staged library sources, nothing to lint')
    return 0
  }
  let total = 0
  for (const [lib, libRanges] of Object.entries(groupByLib(ranges))) {
    const files = Object.keys(libRanges).filter((file) => libRanges[file].length > 0)
    if (files.length === 0) continue
    const messages = await lint(lib, files)
    for (const file of files) {
      for (const finding of filterNewCodeFindings(messages[file], libRanges[file])) {
        console.error(`${file}:${finding.line}:${finding.column} [${finding.ruleId}] ${finding.message}`)
        total++
      }
    }
  }
  if (total > 0) {
    throw new Error(`lint:staged found ${total} OneCX linter rule finding(s) on new or changed lines`)
  }
  log('lint:staged: no OneCX linter rule findings on new or changed lines')
  return 0
}

module.exports = { groupByLib, filterNewCodeFindings, lintStagedFiles, main, stagedSourceRanges }

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
