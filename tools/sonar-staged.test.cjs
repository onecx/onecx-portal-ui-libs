const assert = require('node:assert/strict')
const { spawnSync } = require('node:child_process')
const fs = require('node:fs')
const http = require('node:http')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const { git } = require('./staged-files.js')
const {
  parseHunkRanges,
  hasSonarConfig,
  stagedSourceRanges,
  groupByLib,
  filterNewCodeIssues,
  fetchIssues,
  isTestFile,
  isSourceFile,
  main,
} = require('./sonar-staged.js')

const header = (name) => `diff --git a/${name} b/${name}\nindex 1..2 100644\n--- a/${name}\n+++ b/${name}\n`
const noop = () => {}

test('parses added ranges and ignores pure deletions', () => {
  const diff = header('a.ts') + '@@ -3,2 +3,3 @@\n@@ -10 +11 @@\n@@ -20,2 +22,0 @@\n'
  assert.deepEqual(parseHunkRanges(diff, 'a.ts'), [
    [3, 5],
    [11, 11],
  ])
})

test('quoted, tabbed and noprefix headers do not matter, mode-only has no lines, unparseable throws', () => {
  const quoted =
    'diff --git "a/\\303\\244.ts" "b/\\303\\244.ts"\n--- "a/\\303\\244.ts"\n+++ "b/\\303\\244.ts"\n@@ -2 +2,2 @@\n'
  const noprefix = 'diff --git a.ts a.ts\n--- a.ts\n+++ a.ts\n@@ -5 +5 @@\n'
  assert.deepEqual(parseHunkRanges(quoted, 'ä.ts'), [[2, 3]])
  assert.deepEqual(parseHunkRanges(noprefix, 'a.ts'), [[5, 5]])
  assert.deepEqual(parseHunkRanges('diff --git a/x b/x\nold mode 100644\nnew mode 100755\n', 'x'), [])
  assert.throws(() => parseHunkRanges('', 'a.ts'), /cannot parse/)
})

test('new files (/dev/null old side) and trailing-tab headers are parsed', () => {
  const added =
    'diff --git a/n.ts b/n.ts\nnew file mode 100644\nindex 0..2\n--- /dev/null\n+++ b/n.ts\n@@ -0,0 +1,4 @@\n'
  const tabbed = 'diff --git a/t x.ts b/t x.ts\nindex 1..2 100644\n--- a/t x.ts\t\n+++ b/t x.ts\t\n@@ -1 +1,2 @@\n'
  assert.deepEqual(parseHunkRanges(added, 'n.ts'), [[1, 4]])
  assert.deepEqual(parseHunkRanges(tabbed, 't x.ts'), [[1, 2]])
})

test('only library sources are grouped by lib; specs are tests, docs and config are ignored', () => {
  const ranges = {
    'libs/a/src/x.ts': [[1, 1]],
    'libs/a/src/x.spec.ts': [[1, 1]],
    'libs/b/src/y.html': [[1, 1]],
  }
  assert.deepEqual(Object.keys(groupByLib(ranges)), ['a', 'b'])
  assert.equal(isSourceFile('libs/a/package.json'), false)
  assert.equal(isSourceFile('README.md'), false)
  assert.equal(isTestFile('libs/a/src/x.spec.ts'), true)
  assert.equal(isTestFile('libs/a/src/x.ts'), false)
})

test('only issues on added or changed lines of staged files are kept', () => {
  const ranges = { 'libs/a/src/a.ts': [[3, 5]] }
  const issues = [
    { component: 'k:src/a.ts', line: 4 },
    { component: 'k:src/a.ts', line: 9 },
    { component: 'k:src/b.ts', line: 4 },
    { component: 'k:src/a.ts', textRange: { startLine: 1, endLine: 3 } },
    { component: 'k:src/a.ts', textRange: { startLine: 6, endLine: 8 } },
  ]
  assert.deepEqual(filterNewCodeIssues(issues, ranges, 'k', new Set(), 'libs/a/'), [issues[0], issues[3]])
})

test('file-level issues count only for newly added files', () => {
  const ranges = { 'libs/a/src/old.ts': [[1, 1]], 'libs/a/src/new.ts': [[1, 9]] }
  const issues = [{ component: 'k:src/old.ts' }, { component: 'k:src/new.ts' }]
  assert.deepEqual(filterNewCodeIssues(issues, ranges, 'k', new Set(['libs/a/src/new.ts']), 'libs/a/'), [issues[1]])
  assert.deepEqual(filterNewCodeIssues(issues, ranges, 'k', new Set(), 'libs/a/'), [])
})

test('staged source without SONAR_TOKEN fails, nothing staged passes', async () => {
  await assert.rejects(
    main({}, () => ({ 'libs/a/src/a.ts': [[1, 1]] }), noop),
    /needs SONAR_TOKEN/
  )
  assert.equal(await main({}, () => ({}), noop), 0)
})

test('the CLI exits 1 without SONAR_TOKEN when a library source is staged', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'sonar-staged-cli-'))
  try {
    git(['init', '-q'], { cwd: repo })
    fs.mkdirSync(path.join(repo, 'libs/a/src'), { recursive: true })
    fs.writeFileSync(path.join(repo, 'libs/a/src/a.ts'), 'export {}\n')
    git(['add', '.'], { cwd: repo })
    const env = { ...process.env }
    delete env.SONAR_TOKEN
    const result = spawnSync(process.execPath, [path.join(__dirname, 'sonar-staged.js')], {
      cwd: repo,
      env,
      encoding: 'utf8',
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /needs SONAR_TOKEN/)
  } finally {
    fs.rmSync(repo, { recursive: true, force: true })
  }
})

test('staged ranges come from the index for odd names, renames (whole file, conservative) and modified files', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'sonar-staged-test-'))
  const cwd = process.cwd()
  try {
    git(['init', '-q'], { cwd: repo })
    git(['config', 'user.email', 't@example.com'], { cwd: repo })
    git(['config', 'user.name', 'T'], { cwd: repo })
    git(['config', 'diff.noprefix', 'true'], { cwd: repo })
    git(['config', 'diff.mnemonicPrefix', 'true'], { cwd: repo })
    fs.mkdirSync(path.join(repo, 'libs/a/src'), { recursive: true })
    fs.writeFileSync(path.join(repo, 'libs/a/src/old.ts'), 'a\nb\nc\nd\ne\n')
    fs.writeFileSync(path.join(repo, 'libs/a/src/mod.ts'), 'a\nb\n')
    git(['add', '.'], { cwd: repo })
    git(['commit', '-q', '-m', 'base'], { cwd: repo })
    git(['mv', 'libs/a/src/old.ts', 'libs/a/src/renamed ü.ts'], { cwd: repo })
    fs.writeFileSync(path.join(repo, 'libs/a/src/mod.ts'), 'a\nB\n')
    fs.writeFileSync(path.join(repo, 'libs/a/src/a b ä.ts'), 'one\n')
    fs.writeFileSync(path.join(repo, 'README.md'), 'doc\n')
    git(['add', '.'], { cwd: repo })
    process.chdir(repo)
    assert.deepEqual(stagedSourceRanges(), {
      'libs/a/src/a b ä.ts': [[1, 1]],
      'libs/a/src/mod.ts': [[2, 2]],
      'libs/a/src/renamed ü.ts': [[1, 5]],
    })
  } finally {
    process.chdir(cwd)
    fs.rmSync(repo, { recursive: true, force: true })
  }
})

test('issues are fetched across pages of the analysed branch, not of a pull request', async () => {
  const queries = []
  const server = http.createServer((req, res) => {
    const query = new URL(req.url, 'https://x').searchParams
    queries.push(query)
    const page = Number(query.get('p'))
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ issues: [{ id: page }], paging: { total: 501 } }))
  })
  await new Promise((resolve) => server.listen(0, resolve))
  try {
    const issues = await fetchIssues(`http://127.0.0.1:${server.address().port}`, 't', 'k', 'precommit-x-1')
    assert.deepEqual(issues, [{ id: 1 }, { id: 2 }])
    for (const query of queries) {
      assert.equal(query.get('branch'), 'precommit-x-1')
      assert.equal(query.has('pullRequest'), false)
    }
  } finally {
    server.close()
  }
})

test('libs without sonar-project.properties are skipped with a message, not analyzed', async () => {
  assert.equal(hasSonarConfig('angular-standalone-shell'), false)
  assert.equal(hasSonarConfig('angular-linter-rules'), false)
  assert.equal(hasSonarConfig('ngrx-linter-rules'), false)
  assert.equal(hasSonarConfig('accelerator'), true)
  const logs = []
  const analyzed = []
  const code = await main(
    { SONAR_TOKEN: 't' },
    () => ({ 'libs/angular-standalone-shell/src/a.ts': [[1, 1]] }),
    (m) => logs.push(m),
    { hasSonarConfig, analyzeLib: async (lib) => analyzed.push(lib) }
  )
  assert.equal(code, 0)
  assert.deepEqual(analyzed, [])
  assert.match(logs.join('\n'), /angular-standalone-shell: skipped, .*sonar-project\.properties does not exist/)
})

test('each affected lib is analyzed separately and their issues are summed', async () => {
  const calls = []
  const deps = {
    hasSonarConfig: () => true,
    analyzeLib: async (lib, ranges) => {
      calls.push([lib, Object.keys(ranges)])
      return lib === 'b' ? 2 : 0
    },
  }
  await assert.rejects(
    main(
      { SONAR_TOKEN: 't' },
      () => ({ 'libs/a/src/x.ts': [[1, 1]], 'libs/a/src/y.ts': [[2, 2]], 'libs/b/src/z.ts': [[3, 3]] }),
      noop,
      deps
    ),
    /found 2 issue/
  )
  assert.deepEqual(calls, [
    ['a', ['libs/a/src/x.ts', 'libs/a/src/y.ts']],
    ['b', ['libs/b/src/z.ts']],
  ])
})
