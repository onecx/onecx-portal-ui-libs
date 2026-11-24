const { spawnSync } = require('node:child_process')
const crypto = require('node:crypto')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { git, overlapsRanges, parseHunkRanges, stagedRanges } = require('./staged-files.js')

const SOURCE_FILE = /^libs\/([^/]+)\/src\/.+\.(?:ts|tsx|js|jsx|html)$/
// same as sonar.test.inclusions in the libs' sonar-project.properties: these files are analysed as tests
const TEST_FILE = /^libs\/[^/]+\/src\/.+\.(?:spec|test)\.ts$/
const API_TIMEOUT_MS = 30000
const DEFAULT_HOST = 'https://sonarcloud.io'
const ORGANIZATION = 'onecx'
const PROJECT_PREFIX = 'onecx_onecx-portal-ui-libs_'

/** Reads the staged added/changed ranges of every staged analysable source file. */
function stagedSourceRanges() {
  return stagedRanges((f) => SOURCE_FILE.test(f))
}

/** Staged files that are newly added (git status A). */
function stagedNewFiles() {
  return new Set(git(['diff', '--cached', '--name-only', '-z', '--diff-filter=A']).split('\0').filter(Boolean))
}

/** Keeps only issues located on added/changed lines of staged files, and file-level issues of newly added files. */
function filterNewCodeIssues(issues, ranges, projectKey, newFiles = new Set(), prefix = '') {
  return issues.filter((issue) => {
    const file = prefix + String(issue.component).replace(`${projectKey}:`, '')
    const fileRanges = ranges[file]
    if (!fileRanges) return false
    const first = issue.textRange?.startLine ?? issue.line
    const last = issue.textRange?.endLine ?? issue.line
    // a file-level issue (no line) is only new code when the whole file is new
    if (first === undefined) return newFiles.has(file)
    return overlapsRanges(fileRanges, first, last)
  })
}

async function api(host, token, pathname) {
  const response = await fetch(`${host}${pathname}`, {
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
    headers: { Authorization: 'Basic ' + Buffer.from(`${token}:`).toString('base64') },
  })
  if (!response.ok) {
    throw new Error(`Sonar API ${pathname} failed: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

async function waitForAnalysis(host, token, reportTaskFile) {
  const info = Object.fromEntries(
    fs
      .readFileSync(reportTaskFile, 'utf8')
      .split('\n')
      .filter(Boolean)
      .map((l) => l.split(/=(.*)/s).slice(0, 2))
  )
  for (let i = 0; i < 120; i++) {
    const { task } = await api(host, token, `/api/ce/task?id=${encodeURIComponent(info.ceTaskId)}`)
    if (task.status === 'SUCCESS') return
    if (task.status === 'FAILED' || task.status === 'CANCELED') {
      throw new Error(`Sonar background task ${task.status}: ${task.errorMessage ?? ''}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
  throw new Error('Timed out waiting for the Sonar background task')
}

async function fetchIssues(host, token, projectKey, branch) {
  const issues = []
  for (let page = 1; ; page++) {
    const query = new URLSearchParams({
      componentKeys: projectKey,
      branch,
      resolved: 'false',
      organization: ORGANIZATION,
      ps: '500',
      p: String(page),
    })
    const data = await api(host, token, `/api/issues/search?${query}`)
    issues.push(...data.issues)
    if (page * 500 >= data.paging.total) return issues
  }
}

/** Groups the staged source ranges by library (libs/<lib>/src/**). */
function groupByLib(ranges) {
  const libs = {}
  for (const [file, fileRanges] of Object.entries(ranges)) {
    const lib = SOURCE_FILE.exec(file)?.[1]
    if (lib) libs[lib] = { ...(libs[lib] ?? {}), [file]: fileRanges }
  }
  return libs
}

/** Only libraries with a sonar-project.properties have a SonarCloud project. */
function hasSonarConfig(lib) {
  return fs.existsSync(path.resolve(__dirname, '..', 'libs', lib, 'sonar-project.properties'))
}

function projectKeyFor(lib) {
  return `${PROJECT_PREFIX}${lib}`
}

/** Exports the staged blobs of one library, so the scanner sees exactly what will be committed (not the working tree). */
function exportLib(dir, lib) {
  // root tsconfig*.json and package.json, so libs/<lib>/tsconfig*.json (extends ../../tsconfig.base.json) resolves
  const files = git(['ls-files', '-z', '--', `libs/${lib}`, ':(glob)tsconfig*.json', 'package.json'])
  git(['checkout-index', `--prefix=${dir}${path.sep}`, '-z', '--stdin'], {
    input: files,
  })
}

/** The pinned sonarqube-scanner (devDependency) is started with node directly, so no shell is involved on any platform. */
function runScanner(args, cwd, env) {
  const script = path.resolve(__dirname, '..', 'node_modules', 'sonarqube-scanner', 'bin', 'sonar-scanner.js')
  if (!fs.existsSync(script)) {
    throw new Error('sonarqube-scanner is not installed, run npm ci')
  }
  const scan = spawnSync(process.execPath, [script, ...args], { cwd, env, stdio: 'inherit' })
  if (scan.error) {
    throw new Error(`sonarqube-scanner could not be started: ${scan.error.message}`)
  }
  return scan
}

/**
 * Every run is a Sonar branch analysis of its own synthetic branch, so concurrent runs cannot overwrite each other.
 * It must not be a pull-request analysis: the projects are bound to GitHub, and SonarCloud rejects a pull-request
 * key without a real GitHub pull request ("Could not find the pullrequest with key ..."). A real pull-request key
 * is not used either, as this partial analysis of the staged files would replace that PR's full analysis.
 * SonarCloud removes inactive branches automatically (default 30 days, "Number of days before deleting inactive
 * branches").
 */
function analysisBranch(env) {
  return `precommit-${env.USER || env.USERNAME || 'local'}-${crypto.randomBytes(4).toString('hex')}`
}

async function analyzeLib(lib, ranges, env, newFiles) {
  const projectKey = projectKeyFor(lib)
  const branch = analysisBranch(env)
  const host = env.SONAR_HOST_URL || DEFAULT_HOST
  const prefix = `libs/${lib}/`
  const relative = (file) => file.slice(prefix.length)
  const inclusions = Object.keys(ranges).filter((file) => ranges[file].length > 0)
  if (inclusions.length === 0) return 0
  // the lib's sonar.test.inclusions would match every spec; restrict it to the staged specs (or to nothing)
  const testInclusions = inclusions.filter((file) => TEST_FILE.test(file)).map(relative)
  const exportDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sonar-staged-'))
  const cleanup = () => fs.rmSync(exportDir, { recursive: true, force: true })
  const onSignal = (signal) => {
    cleanup()
    process.exit(128 + (os.constants.signals[signal] ?? 0))
  }
  process.once('SIGINT', onSignal)
  process.once('SIGTERM', onSignal)
  try {
    exportLib(exportDir, lib)
    const libDir = path.join(exportDir, 'libs', lib)
    const workDir = path.join(exportDir, 'reports', lib, '.scannerwork')
    console.log(`sonar:staged ${lib}: analyzing ${inclusions.length} staged file(s)`)
    // the token is passed through the environment (SONAR_TOKEN), never on the command line
    const scan = runScanner(
      [
        `-Dsonar.projectKey=${projectKey}`,
        `-Dsonar.host.url=${host}`,
        `-Dsonar.organization=${ORGANIZATION}`,
        `-Dsonar.inclusions=${inclusions.map(relative).join(',')}`,
        `-Dsonar.test.inclusions=${testInclusions.length > 0 ? testInclusions.join(',') : 'staged-none/**'}`,
        '-Dsonar.scm.disabled=true',
        // no coverage/test reports exist in the export; avoid missing-report warnings
        '-Dsonar.javascript.lcov.reportPaths=',
        '-Dsonar.testExecutionReportPaths=',
        `-Dsonar.working.directory=${workDir}`,
        `-Dsonar.branch.name=${branch}`,
      ],
      libDir,
      env
    )
    if (scan.status !== 0) {
      const signalSuffix = scan.signal ? `, signal ${scan.signal}` : ''
      const reason = scan.error ? scan.error.message : `exit ${scan.status}${signalSuffix}`
      throw new Error(`sonarqube-scanner failed for ${lib} (${reason})`)
    }
    await waitForAnalysis(host, env.SONAR_TOKEN, path.join(workDir, 'report-task.txt'))
    const issues = filterNewCodeIssues(
      await fetchIssues(host, env.SONAR_TOKEN, projectKey, branch),
      ranges,
      projectKey,
      newFiles,
      prefix
    )
    for (const issue of issues) {
      console.error(
        `${prefix}${issue.component.split(':').pop()}:${issue.line ?? '?'} [${issue.rule}] ${issue.message}`
      )
    }
    return issues.length
  } finally {
    process.removeListener('SIGINT', onSignal)
    process.removeListener('SIGTERM', onSignal)
    cleanup()
  }
}

/** Entry point; returns the number of issues on new code. Throws when the gate cannot run. */
async function main(
  env = process.env,
  readRanges = stagedSourceRanges,
  log = console.log,
  deps = { analyzeLib, hasSonarConfig }
) {
  const ranges = readRanges()
  const files = Object.keys(ranges)
  if (files.length === 0) {
    log('sonar:staged: no staged source changes, nothing to analyze')
    return 0
  }
  if (!env.SONAR_TOKEN) {
    throw new Error(
      `sonar:staged needs SONAR_TOKEN (and optionally SONAR_HOST_URL, default ${DEFAULT_HOST}) to analyze: ${files.join(', ')}`
    )
  }
  const newFiles = stagedNewFiles()
  let total = 0
  for (const [lib, libRanges] of Object.entries(groupByLib(ranges))) {
    if (!deps.hasSonarConfig(lib)) {
      log(`sonar:staged ${lib}: skipped, libs/${lib}/sonar-project.properties does not exist (no Sonar project)`)
      continue
    }
    total += await deps.analyzeLib(lib, libRanges, env, newFiles)
  }
  if (total > 0) {
    throw new Error(`sonar:staged found ${total} issue(s) on new or changed lines`)
  }
  log('sonar:staged: no issues on new or changed lines')
  return 0
}

module.exports = {
  isSourceFile: (f) => SOURCE_FILE.test(f),
  isTestFile: (f) => TEST_FILE.test(f),
  groupByLib,
  hasSonarConfig,
  projectKeyFor,
  fetchIssues,
  parseHunkRanges,
  stagedSourceRanges,
  filterNewCodeIssues,
  main,
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
}
