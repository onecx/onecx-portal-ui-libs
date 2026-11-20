import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const script = fileURLToPath(new URL('./ai-review-dispatch.mjs', import.meta.url))

async function fixture(t, options = {}) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ai-review-dispatch-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const bin = path.join(root, 'bin')
  const workspace = path.join(root, 'checkout')
  await mkdir(bin)
  await mkdir(path.join(workspace, '.github'), { recursive: true })
  const eventName = options.eventName ?? 'pull_request_target'
  const actor = options.actor ?? 'maintainer'
  const pullRequest = {
    number: 42,
    html_url: 'https://github.com/example/consumer/pull/42',
    state: 'open',
    draft: false,
    user: { login: 'contributor', type: 'User' },
    author_association: 'MEMBER',
    base: { repo: { full_name: 'example/consumer' }, sha: 'base-sha' },
    head: { repo: { full_name: 'example/consumer' } },
    ...options.pullRequest,
  }
  const event = {
    action: options.action ?? (eventName === 'issue_comment' ? 'created' : 'opened'),
    sender: { login: actor, type: 'User', ...options.sender },
    repository: { full_name: 'example/consumer', default_branch: 'main' },
    ...(eventName === 'pull_request_target' ? { pull_request: pullRequest } : {}),
    ...(eventName === 'workflow_dispatch' ? { inputs: { pr_number: options.prNumber ?? '42' } } : {}),
    ...(eventName === 'issue_comment'
      ? {
          issue: {
            number: 42,
            pull_request: { html_url: pullRequest.html_url },
            ...options.issue,
          },
          comment: {
            body: options.comment ?? '@ai-review',
            user: { login: actor, type: 'User', ...options.commentUser },
          },
        }
      : {}),
  }
  const eventPath = path.join(root, 'event.json')
  await writeFile(eventPath, JSON.stringify(event))
  if (options.guidance !== undefined) {
    await writeFile(path.join(workspace, '.github', 'ai-review.md'), options.guidance)
  }
  if (options.guidanceError) {
    await mkdir(path.join(workspace, '.github', 'ai-review.md'))
  }
  const logPath = path.join(root, 'calls.jsonl')
  const gh = path.join(bin, 'gh')
  await writeFile(
    gh,
    `#!/usr/bin/env node
import { appendFileSync } from 'node:fs'
const args = process.argv.slice(2)
appendFileSync(process.env.FAKE_LOG, JSON.stringify({ args, token: process.env.GH_TOKEN }) + '\\n')
if (args[0] === 'api') {
  if (process.env.FAKE_MODE === 'auth-failure') {
    process.stderr.write('raw auth private/destination ' + process.env.GH_TOKEN)
    process.exit(1)
  }
  if (args[1].endsWith('/permission')) {
    process.stdout.write(process.env.FAKE_PERMISSION)
  } else {
    if (process.env.FAKE_MODE === 'pr-failure') process.exit(1)
    process.stdout.write(process.env.FAKE_PR)
  }
} else {
  process.stdout.write('raw dispatch private/destination ' + process.env.GH_TOKEN)
  if (process.env.FAKE_MODE === 'dispatch-failure') process.exit(1)
}
`
  )
  await chmod(gh, 0o755)
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${bin}${path.delimiter}${process.env.PATH}`,
      GITHUB_EVENT_NAME: eventName,
      GITHUB_EVENT_PATH: eventPath,
      GITHUB_ACTOR: actor,
      GITHUB_REPOSITORY: 'example/consumer',
      GITHUB_REF: options.ref ?? 'refs/heads/main',
      GITHUB_WORKSPACE: workspace,
      AI_REVIEW_DISPATCH_REPOSITORY: options.target ?? 'private/destination',
      GH_TOKEN: options.dispatchToken ?? 'service-secret',
      GH_READ_TOKEN: 'repository-read-secret',
      FAKE_LOG: logPath,
      FAKE_MODE: options.ghMode ?? 'success',
      FAKE_PERMISSION: options.permissionResponse ?? JSON.stringify({ permission: options.permission ?? 'write' }),
      FAKE_PR: options.prResponse ?? JSON.stringify({ ...pullRequest, ...options.currentPullRequest }),
    },
  })
  let calls = []
  try {
    calls = (await readFile(logPath, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  for (const secret of [
    'service-secret',
    'repository-read-secret',
    'private/destination',
    'raw auth',
    'raw dispatch',
  ]) {
    assert.equal(`${result.stdout}${result.stderr}`.includes(secret), false, `output exposed ${secret}`)
  }
  return { result, calls }
}

function assertDispatched({ result, calls }) {
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(
    calls.map(({ token }) => token),
    ['repository-read-secret', 'repository-read-secret', 'service-secret']
  )
  assert.deepEqual(calls[0].args, ['api', 'repos/example/consumer/collaborators/maintainer/permission'])
  assert.deepEqual(calls[1].args, ['api', 'repos/example/consumer/pulls/42'])
  assert.deepEqual(calls[2].args, [
    'workflow',
    'run',
    'hybrid-agent-pipeline.yml',
    '--repo',
    'private/destination',
    '--ref',
    'main',
    '-f',
    'pr_url=https://github.com/example/consumer/pull/42',
    '-f',
    'profile=review-gh-pr',
    '-f',
    'workflow_config={"version":1}',
    '-f',
    'post_comments=true',
  ])
}

test('dispatches automatic reviews with a service token, not the event actor PAT', async (t) => {
  assertDispatched(await fixture(t))
})

test('manual Actions dispatch looks up an existing PR on the default branch', async (t) => {
  assertDispatched(await fixture(t, { eventName: 'workflow_dispatch' }))
})

test('an exact PR comment dispatches after checking the commenter write permission', async (t) => {
  assertDispatched(await fixture(t, { eventName: 'issue_comment' }))
})

test('allows trusted team fork PRs through automatic and both manual triggers', async (t) => {
  for (const eventName of ['pull_request_target', 'issue_comment', 'workflow_dispatch']) {
    await t.test(eventName, async (t) => {
      assertDispatched(
        await fixture(t, {
          eventName,
          pullRequest: { head: { repo: { full_name: 'teammate/fork' } } },
        })
      )
    })
  }
})

test('a fork requester still needs write access to the consumer repository', async (t) => {
  const { result, calls } = await fixture(t, {
    eventName: 'issue_comment',
    permission: 'read',
    pullRequest: { head: { repo: { full_name: 'teammate/fork' } } },
  })
  assert.equal(result.status, 1)
  assert.equal(calls.length, 1)
  assert.match(result.stderr, /authorization failed/i)
})

test('rejects unrelated or untrusted events before using GitHub credentials', async (t) => {
  const cases = [
    { eventName: 'pull_request' },
    { action: 'closed' },
    { actor: 'automation[bot]' },
    { sender: { login: 'someone-else' } },
    { sender: { type: 'Bot' } },
    { eventName: 'workflow_dispatch', prNumber: '0' },
    { eventName: 'workflow_dispatch', prNumber: '../other' },
    { eventName: 'workflow_dispatch', prNumber: '9007199254740992' },
    { eventName: 'workflow_dispatch', ref: 'refs/heads/untrusted' },
    { eventName: 'issue_comment', action: 'edited' },
    { eventName: 'issue_comment', comment: 'please @ai-review' },
    { eventName: 'issue_comment', issue: { pull_request: undefined } },
    { eventName: 'issue_comment', commentUser: { login: 'someone-else' } },
    { eventName: 'issue_comment', commentUser: { type: 'Bot' } },
    { target: '' },
    { dispatchToken: '' },
  ]
  for (const options of cases) {
    await t.test(JSON.stringify(options), async (t) => {
      const { result, calls } = await fixture(t, options)
      assert.equal(result.status, 1)
      assert.deepEqual(calls, [])
      assert.match(result.stderr, /validation failed/i)
    })
  }
})

test('rejects requesters without repository write access for every trigger', async (t) => {
  for (const eventName of ['pull_request_target', 'issue_comment', 'workflow_dispatch']) {
    await t.test(eventName, async (t) => {
      const { result, calls } = await fixture(t, { eventName, permission: 'read' })
      assert.equal(result.status, 1)
      assert.equal(calls.length, 1)
      assert.match(result.stderr, /authorization failed/i)
    })
  }
})

test('maintainers and administrators can request reviews', async (t) => {
  for (const permission of ['maintain', 'admin']) {
    await t.test(permission, async (t) => {
      assertDispatched(await fixture(t, { eventName: 'issue_comment', permission }))
    })
  }
})

test('validates the current PR for manual requests, including its canonical URL', async (t) => {
  const cases = [
    { state: 'closed' },
    { draft: true },
    { number: 43 },
    { author_association: 'FIRST_TIME_CONTRIBUTOR' },
    { user: { type: 'Bot' } },
    { head: { repo: null } },
    { base: { repo: { full_name: 'different/repository' } } },
    { html_url: 'https://github.com/example/consumer/pull/43' },
    { html_url: 'https://github.com/example/consumer/pull/42?other=1' },
    { html_url: 'https://github.com/example/consumer/pull/42#other' },
    { html_url: 'https://attacker.example/example/consumer/pull/42' },
  ]
  for (const currentPullRequest of cases) {
    await t.test(JSON.stringify(currentPullRequest), async (t) => {
      const { result, calls } = await fixture(t, { eventName: 'issue_comment', currentPullRequest })
      assert.equal(result.status, 1)
      assert.equal(calls.length, 2)
      assert.match(result.stderr, /validation failed/i)
    })
  }
})

test('does not dispatch a PR closed since the automatic event was queued', async (t) => {
  const { result, calls } = await fixture(t, { currentPullRequest: { state: 'closed' } })
  assert.equal(result.status, 1)
  assert.equal(calls.length, 2)
})

test('preserves the trusted guidance limit and dispatches multiline focus', async (t) => {
  const guidance = `${'\u{1f600}'.repeat(1000)}\n${'\u754c'.repeat(1999)}`
  const { result, calls } = await fixture(t, { guidance })
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(calls[2].args.slice(-2), ['-f', `additional_context=${guidance}`])
})

test('fails explicitly on oversized or unreadable guidance before gh', async (t) => {
  for (const options of [{ guidance: '\u{1f600}'.repeat(2001) }, { guidanceError: true }]) {
    await t.test(JSON.stringify(options).slice(0, 80), async (t) => {
      const { result, calls } = await fixture(t, options)
      assert.equal(result.status, 1)
      assert.deepEqual(calls, [])
    })
  }
})

test('sanitizes GitHub API, malformed response and dispatch failures', async (t) => {
  const cases = [
    { ghMode: 'auth-failure', diagnostic: /authorization failed/i, count: 1 },
    { permissionResponse: '{broken', diagnostic: /authorization failed/i, count: 1 },
    { ghMode: 'pr-failure', diagnostic: /pull request lookup failed/i, count: 2 },
    { prResponse: '{broken', diagnostic: /pull request lookup failed/i, count: 2 },
    { ghMode: 'dispatch-failure', diagnostic: /dispatch failed/i, count: 3 },
  ]
  for (const { diagnostic, count, ...options } of cases) {
    await t.test(JSON.stringify(options), async (t) => {
      const { result, calls } = await fixture(t, options)
      assert.equal(result.status, 1)
      assert.equal(calls.length, count)
      assert.match(result.stderr, diagnostic)
    })
  }
})
