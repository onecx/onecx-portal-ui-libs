const assert = require('node:assert/strict')
const { test } = require('node:test')
const { parseAddedRanges, groupByLib, filterNewCodeIssues, projectKeyFor } = require('./sonar-staged.js')

const diff = [
  'diff --git a/libs/angular-accelerator/src/lib/a.ts b/libs/angular-accelerator/src/lib/a.ts',
  '--- a/libs/angular-accelerator/src/lib/a.ts',
  '+++ b/libs/angular-accelerator/src/lib/a.ts',
  '@@ -3,2 +3,3 @@',
  '@@ -10 +11 @@',
  '@@ -20,2 +22,0 @@',
  'diff --git a/README.md b/README.md',
  '--- a/README.md',
  '+++ b/README.md',
  '@@ -1 +1,2 @@',
].join('\n')

test('parses added ranges and ignores pure deletions', () => {
  assert.deepEqual(parseAddedRanges(diff), {
    'libs/angular-accelerator/src/lib/a.ts': [
      [3, 5],
      [11, 11],
    ],
    'README.md': [[1, 2]],
  })
})

test('only library sources are grouped, docs and config are ignored', () => {
  assert.deepEqual(Object.keys(groupByLib(parseAddedRanges(diff))), ['angular-accelerator'])
  assert.deepEqual(groupByLib({ 'libs/x/package.json': [[1, 1]], 'libs/x/src/a.spec.ts': [[1, 1]] }), {
    x: { 'libs/x/src/a.spec.ts': [[1, 1]] },
  })
})

test('only issues on new lines of staged files are kept', () => {
  const key = projectKeyFor('angular-accelerator')
  const ranges = { 'libs/angular-accelerator/src/lib/a.ts': [[3, 5]] }
  const issue = (component, startLine, endLine = startLine) => ({
    component: `${key}:${component}`,
    textRange: { startLine, endLine },
  })
  const kept = filterNewCodeIssues(
    [issue('src/lib/a.ts', 4), issue('src/lib/a.ts', 1, 2), issue('src/lib/a.ts', 5, 9), issue('src/lib/b.ts', 4)],
    'angular-accelerator',
    ranges,
    key
  )
  assert.equal(kept.length, 2)
  assert.deepEqual(
    kept.map((i) => i.textRange.startLine),
    [4, 5]
  )
})
