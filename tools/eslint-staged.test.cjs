const assert = require('node:assert/strict')
const { execFileSync } = require('node:child_process')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')
const { groupByLib, filterNewCodeFindings, main, stagedSourceRanges } = require('./eslint-staged.js')

const OWN_RULE = '@onecx/angular-linter-rules/no-subscribe-assignment'
const noop = () => {}

test('only own-rule findings on added or changed lines are kept', () => {
  const messages = [
    { ruleId: OWN_RULE, line: 4 },
    { ruleId: OWN_RULE, line: 9 },
    { ruleId: OWN_RULE, line: 1, endLine: 3 },
    { ruleId: '@typescript-eslint/no-unused-vars', line: 4 },
    { ruleId: null, line: 4, fatal: true },
  ]
  assert.deepEqual(filterNewCodeFindings(messages, [[3, 5]]), [
    { ruleId: OWN_RULE, line: 4 },
    { ruleId: OWN_RULE, line: 1, endLine: 3 },
  ])
})

test('library TypeScript files are grouped by lib, other files are ignored', () => {
  const ranges = {
    'libs/a/src/x.ts': [[1, 1]],
    'libs/a/testing/y.spec.ts': [[1, 1]],
    'libs/b/src/z.ts': [[1, 1]],
    'tools/t.ts': [[1, 1]],
  }
  assert.deepEqual(groupByLib(ranges), {
    a: { 'libs/a/src/x.ts': [[1, 1]], 'libs/a/testing/y.spec.ts': [[1, 1]] },
    b: { 'libs/b/src/z.ts': [[1, 1]] },
  })
})

test('nothing staged passes without linting', async () => {
  const lint = () => assert.fail('must not lint')
  assert.equal(await main(() => ({}), lint, noop), 0)
})

test('findings on new lines fail, findings on untouched lines and files without new lines pass', async () => {
  const linted = []
  const lint = async (lib, files) => {
    linted.push([lib, files])
    return { 'libs/a/src/x.ts': [{ ruleId: OWN_RULE, line: 7, column: 1, message: 'm' }] }
  }
  const staged = (range) => () => ({ 'libs/a/src/x.ts': [range], 'libs/a/src/deleted-only.ts': [] })

  assert.equal(await main(staged([1, 2]), lint, noop), 0)
  assert.deepEqual(linted, [['a', ['libs/a/src/x.ts']]])
  await assert.rejects(main(staged([6, 8]), lint, noop), /found 1 OneCX linter rule finding/)
})

test('moved files only count their changed lines as new, other library sources count as staged', () => {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-staged-test-'))
  const cwd = process.cwd()
  try {
    const git = (...args) => execFileSync('git', args, { cwd: repo })
    git('init', '-q')
    git('config', 'user.email', 't@example.com')
    git('config', 'user.name', 'T')
    fs.mkdirSync(path.join(repo, 'libs/a/src'), { recursive: true })
    fs.writeFileSync(path.join(repo, 'libs/a/src/moved.ts'), 'a\nb\nc\nd\ne\nf\n')
    fs.writeFileSync(path.join(repo, 'libs/a/src/edited.ts'), 'a\nb\nc\nd\ne\nf\n')
    git('add', '.')
    git('commit', '-q', '-m', 'base')
    git('mv', 'libs/a/src/moved.ts', 'libs/a/src/moved ü.ts')
    git('mv', 'libs/a/src/edited.ts', 'libs/a/src/edited-new.ts')
    fs.writeFileSync(path.join(repo, 'libs/a/src/edited-new.ts'), 'a\nb\nC\nd\ne\nf\n')
    fs.writeFileSync(path.join(repo, 'libs/a/src/new.ts'), 'one\n')
    fs.writeFileSync(path.join(repo, 'README.md'), 'doc\n')
    git('add', '.')
    process.chdir(repo)
    assert.deepEqual(stagedSourceRanges(), {
      'libs/a/src/edited-new.ts': [[3, 3]],
      'libs/a/src/moved ü.ts': [],
      'libs/a/src/new.ts': [[1, 1]],
    })
  } finally {
    process.chdir(cwd)
    fs.rmSync(repo, { recursive: true, force: true })
  }
})
