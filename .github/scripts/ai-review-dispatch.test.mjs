import assert from 'node:assert/strict'
import test from 'node:test'
import { assertDispatched, fixture } from './ai-review-dispatch.test-helpers.mjs'

test('dispatches automatic reviews with a service token, not the event actor PAT', async (t) => {
  assertDispatched(await fixture(t))
})

test('release-target PRs still dispatch the central main workflow by default', async (t) => {
  assertDispatched(
    await fixture(t, {
      ref: 'refs/heads/v7',
      pullRequest: { base: { repo: { full_name: 'example/consumer' }, ref: 'v7', sha: 'release-sha' } },
    })
  )
})

test('an explicit trusted dispatch ref overrides main without using the PR target ref', async (t) => {
  assertDispatched(await fixture(t, { ref: 'refs/heads/v7', dispatchRef: 'release/review-v2' }), {
    dispatchRef: 'release/review-v2',
  })
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

test('accepts a team fork author reported as CONTRIBUTOR when repository permissions prove admin access', async (t) => {
  for (const eventName of ['pull_request_target', 'issue_comment', 'workflow_dispatch']) {
    await t.test(eventName, async (t) => {
      assertDispatched(
        await fixture(t, {
          eventName,
          pullRequest: {
            author_association: 'CONTRIBUTOR',
            head: { repo: { full_name: 'teammate/fork' } },
          },
          authorPermission: 'admin',
        }),
        { permissionChecks: 3 }
      )
    })
  }
})

test('rejects an unassociated author without verified repository write access', async (t) => {
  const { result, calls } = await fixture(t, {
    eventName: 'workflow_dispatch',
    pullRequest: { author_association: 'CONTRIBUTOR' },
    authorPermission: 'read',
  })
  assert.equal(result.status, 1)
  assert.equal(calls.length, 3)
  assert.match(result.stderr, /author authorization failed/i)
})

test('reuses verified requester permissions when the CONTRIBUTOR author is the requester', async (t) => {
  assertDispatched(
    await fixture(t, {
      eventName: 'workflow_dispatch',
      pullRequest: { author_association: 'CONTRIBUTOR', user: { login: 'maintainer', type: 'User' } },
    })
  )
})

test('author permission lookup failures remain explicit and redacted', async (t) => {
  const { result, calls } = await fixture(t, {
    eventName: 'workflow_dispatch',
    pullRequest: { author_association: 'CONTRIBUTOR' },
    authorPermissionResponse: '{broken',
  })
  assert.equal(result.status, 1)
  assert.equal(calls.length, 3)
  assert.match(result.stderr, /author authorization failed/i)
})

const untrustedEvents = [
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

test('rejects unrelated or untrusted events before using GitHub credentials', async (t) => {
  for (const options of untrustedEvents) {
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
