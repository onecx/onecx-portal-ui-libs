const assert = require('node:assert/strict')
const { execFileSync, spawnSync } = require('node:child_process')
const fs = require('node:fs')
const http = require('node:http')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const {
  parseHunkRanges,
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
    const git = (...args) => execFileSync('git', args, { cwd: repo })
    git('init', '-q')
    fs.mkdirSync(path.join(repo, 'libs/a/src'), { recursive: true })
    fs.writeFileSync(path.join(repo, 'libs/a/src/a.ts'), 'export {}\n')
    git('add', '.')
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
    const git = (...args) => execFileSync('git', args, { cwd: repo })
    git('init', '-q')
    git('config', 'user.email', 't@example.com')
    git('config', 'user.name', 'T')
    git('config', 'diff.noprefix', 'true')
    git('config', 'diff.mnemonicPrefix', 'true')
    fs.mkdirSync(path.join(repo, 'libs/a/src'), { recursive: true })
    fs.writeFileSync(path.join(repo, 'libs/a/src/old.ts'), 'a\nb\nc\nd\ne\n')
    fs.writeFileSync(path.join(repo, 'libs/a/src/mod.ts'), 'a\nb\n')
    git('add', '.')
    git('commit', '-q', '-m', 'base')
    git('mv', 'libs/a/src/old.ts', 'libs/a/src/renamed ü.ts')
    fs.writeFileSync(path.join(repo, 'libs/a/src/mod.ts'), 'a\nB\n')
    fs.writeFileSync(path.join(repo, 'libs/a/src/a b ä.ts'), 'one\n')
    fs.writeFileSync(path.join(repo, 'README.md'), 'doc\n')
    git('add', '.')
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

test('issues are fetched across pages', async () => {
  const server = http.createServer((req, res) => {
    const page = Number(new URL(req.url, 'http://x').searchParams.get('p'))
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify({ issues: [{ id: page }], paging: { total: 501 } }))
  })
  await new Promise((resolve) => server.listen(0, resolve))
  try {
    const issues = await fetchIssues(`http://127.0.0.1:${server.address().port}`, 't', 'k', 'pr')
    assert.deepEqual(issues, [{ id: 1 }, { id: 2 }])
  } finally {
    server.close()
  }
})
