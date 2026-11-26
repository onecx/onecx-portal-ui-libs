const assert = require('node:assert/strict')
const { execFileSync, spawnSync } = require('node:child_process')
const { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { test } = require('node:test')

const helperPath = path.join(__dirname, 'prettier-staged.js')

function createFixture(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'prettier-staged-'))
  const repo = path.join(root, 'repo')
  const modules = path.join(root, 'node_modules')
  const argsFile = path.join(root, 'prettier-args.json')
  const prettierRoot = path.join(modules, 'prettier')

  t.after(() => rmSync(root, { recursive: true, force: true }))
  mkdirSync(repo)
  mkdirSync(path.join(repo, 'tools'))
  copyFileSync(helperPath, path.join(repo, 'tools', 'prettier-staged.js'))
  copyFileSync(path.join(__dirname, 'staged-files.js'), path.join(repo, 'tools', 'staged-files.js'))
  mkdirSync(path.join(prettierRoot, 'src'), { recursive: true })
  writeFileSync(path.join(prettierRoot, 'package.json'), JSON.stringify({ main: 'src/index.js' }))
  writeFileSync(
    path.join(prettierRoot, 'src/index.js'),
    `const { existsSync, readFileSync, writeFileSync } = require('node:fs')\n\nexports.getFileInfo = async (file, options = {}) => ({ ignored: file === 'ignored.txt' && options.ignorePath === '.prettierignore', inferredParser: 'babel' })\nexports.resolveConfig = async () => ({})\nexports.check = async (content, options) => {\n  const requests = existsSync(process.env.PRETTIER_ARGS_FILE) ? JSON.parse(readFileSync(process.env.PRETTIER_ARGS_FILE, 'utf8')) : []\n  requests.push({ content, filepath: options.filepath })\n  writeFileSync(process.env.PRETTIER_ARGS_FILE, JSON.stringify(requests))\n  return Number(process.env.PRETTIER_EXIT_CODE || 0) === 0\n}\n`
  )
  execFileSync('git', ['init', '--quiet'], { cwd: repo })
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: repo })
  execFileSync('git', ['config', 'user.name', 'Test'], { cwd: repo })
  writeFileSync(path.join(repo, 'base.txt'), 'base')
  execFileSync('git', ['add', 'base.txt'], { cwd: repo })
  execFileSync('git', ['commit', '--quiet', '-m', 'chore: base commit'], { cwd: repo })

  return { argsFile, modules, repo, root }
}

function runHelper(fixture, exitCode = 0) {
  return spawnSync(process.execPath, [path.join(fixture.repo, 'tools', 'prettier-staged.js')], {
    cwd: fixture.repo,
    env: {
      ...process.env,
      NODE_PATH: fixture.modules,
      PRETTIER_ARGS_FILE: fixture.argsFile,
      PRETTIER_EXIT_CODE: String(exitCode),
    },
    encoding: 'utf8',
  })
}

test('skips Prettier when no files are staged', (t) => {
  const fixture = createFixture(t)
  const result = runHelper(fixture)

  assert.equal(result.status, 0, result.stderr)
  assert.throws(() => readFileSync(fixture.argsFile))
})

test('checks only staged files and preserves filenames with spaces', (t) => {
  const fixture = createFixture(t)
  writeFileSync(path.join(fixture.repo, 'staged file.ts'), 'const staged = 1')
  writeFileSync(path.join(fixture.repo, 'unstaged.ts'), 'const unstaged=1')
  execFileSync('git', ['add', 'staged file.ts'], { cwd: fixture.repo })
  writeFileSync(path.join(fixture.repo, 'staged file.ts'), 'const unstaged=1')

  const result = runHelper(fixture)
  const requests = JSON.parse(readFileSync(fixture.argsFile, 'utf8'))

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(requests, [{ content: 'const staged = 1', filepath: 'staged file.ts' }])
})

test('uses the repository Prettier ignore file', (t) => {
  const fixture = createFixture(t)
  writeFileSync(path.join(fixture.repo, '.prettierignore'), 'ignored.txt\n')
  writeFileSync(path.join(fixture.repo, 'ignored.txt'), 'ignored')
  execFileSync('git', ['add', 'ignored.txt'], { cwd: fixture.repo })

  const result = runHelper(fixture)

  assert.equal(result.status, 0, result.stderr)
  assert.throws(() => readFileSync(fixture.argsFile))
})

test('checks staged files larger than the default exec buffer', (t) => {
  const fixture = createFixture(t)
  const content = 'x'.repeat(1_100_000)
  writeFileSync(path.join(fixture.repo, 'large.ts'), content)
  execFileSync('git', ['add', 'large.ts'], { cwd: fixture.repo })

  const result = runHelper(fixture)
  const requests = JSON.parse(readFileSync(fixture.argsFile, 'utf8'))

  assert.equal(result.status, 0, result.stderr)
  assert.equal(requests[0].content, content)
})

test('propagates Prettier failures', (t) => {
  const fixture = createFixture(t)
  writeFileSync(path.join(fixture.repo, 'staged.ts'), 'const staged=1')
  execFileSync('git', ['add', 'staged.ts'], { cwd: fixture.repo })

  const result = runHelper(fixture, 2)

  assert.equal(result.status, 1)
})

test('skips files taken unchanged from the merged branch during a merge', (t) => {
  const fixture = createFixture(t)
  const git = (...args) => execFileSync('git', args, { cwd: fixture.repo, encoding: 'utf8' }).trim()
  const baseBranch = git('rev-parse', '--abbrev-ref', 'HEAD')
  git('checkout', '--quiet', '-b', 'incoming')
  writeFileSync(path.join(fixture.repo, 'incoming.ts'), 'const incoming=1')
  writeFileSync(path.join(fixture.repo, 'resolved.ts'), 'const resolved=1')
  git('add', 'incoming.ts', 'resolved.ts')
  git('commit', '--quiet', '-m', 'chore: incoming')
  git('checkout', '--quiet', baseBranch)
  git('merge', '--quiet', '--no-ff', '--no-commit', 'incoming')
  writeFileSync(path.join(fixture.repo, 'resolved.ts'), 'const resolved = 2')
  git('add', 'resolved.ts')

  const result = runHelper(fixture)
  const requests = JSON.parse(readFileSync(fixture.argsFile, 'utf8'))

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(requests, [{ content: 'const resolved = 2', filepath: 'resolved.ts' }])
})

test('runs the prettier script, which is the staged check, from the pre-commit hook', (t) => {
  const fixture = createFixture(t)
  const bin = path.join(fixture.root, 'bin')
  const callsFile = path.join(fixture.root, 'npm-calls.txt')
  const npmPath = path.join(bin, 'npm')
  const hookPath = path.join(__dirname, '../.husky/pre-commit')

  mkdirSync(bin)
  writeFileSync(
    path.join(fixture.repo, 'package.json'),
    JSON.stringify({ scripts: { lint: 'lint', prettier: 'prettier', 'prettier:staged': 'prettier:staged' } })
  )
  writeFileSync(npmPath, '#!/bin/sh\nprintf "%s\\n" "$*" >> "$NPM_CALLS"\n')
  chmodSync(npmPath, 0o755)

  const result = spawnSync('/bin/sh', [hookPath], {
    cwd: fixture.repo,
    env: {
      ...process.env,
      PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      NPM_CALLS: callsFile,
      CI: '',
      FORCE_CI_COMMIT_HOOKS: '',
    },
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(readFileSync(callsFile, 'utf8').trim().split('\n'), ['run lint', 'run prettier'])
})

test('runs the test script when test:ci is not configured', (t) => {
  const fixture = createFixture(t)
  const bin = path.join(fixture.root, 'bin')
  const callsFile = path.join(fixture.root, 'npm-calls.txt')
  const npmPath = path.join(bin, 'npm')
  const hookPath = path.join(__dirname, '../.husky/pre-commit')

  mkdirSync(bin)
  writeFileSync(
    path.join(fixture.repo, 'package.json'),
    JSON.stringify({ scripts: { lint: 'lint', prettier: 'prettier', test: 'test' } })
  )
  writeFileSync(npmPath, '#!/bin/sh\nprintf "%s\\n" "$*" >> "$NPM_CALLS"\n')
  chmodSync(npmPath, 0o755)

  const result = spawnSync('/bin/sh', [hookPath], {
    cwd: fixture.repo,
    env: {
      ...process.env,
      PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      NPM_CALLS: callsFile,
      CI: '',
      FORCE_CI_COMMIT_HOOKS: '1',
    },
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(readFileSync(callsFile, 'utf8').trim().split('\n'), ['run lint', 'run prettier', 'run test'])
})

test('runs the sonar script under FORCE_CI_COMMIT_HOOKS', (t) => {
  const fixture = createFixture(t)
  const bin = path.join(fixture.root, 'bin')
  const callsFile = path.join(fixture.root, 'npm-calls.txt')
  const npmPath = path.join(bin, 'npm')
  const hookPath = path.join(__dirname, '../.husky/pre-commit')

  mkdirSync(bin)
  writeFileSync(
    path.join(fixture.repo, 'package.json'),
    JSON.stringify({ scripts: { lint: 'lint', prettier: 'prettier', test: 'test', sonar: 'sonar' } })
  )
  writeFileSync(npmPath, '#!/bin/sh\nprintf "%s\\n" "$*" >> "$NPM_CALLS"\n')
  chmodSync(npmPath, 0o755)

  const result = spawnSync('/bin/sh', [hookPath], {
    cwd: fixture.repo,
    env: {
      ...process.env,
      PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      NPM_CALLS: callsFile,
      CI: '',
      FORCE_CI_COMMIT_HOOKS: '1',
    },
    encoding: 'utf8',
  })

  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(readFileSync(callsFile, 'utf8').trim().split('\n'), [
    'run lint',
    'run prettier',
    'run test',
    'run sonar',
  ])
})
