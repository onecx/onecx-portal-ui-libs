import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { chmod, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const script = fileURLToPath(new URL('./ai-review-dispatch.mjs', import.meta.url))
const ghStub = `#!/usr/bin/env node
import { appendFileSync } from 'node:fs'
const args = process.argv.slice(2)
appendFileSync(process.env.FAKE_LOG, JSON.stringify({ args, token: process.env.GH_TOKEN }) + '\\n')
if (args[0] === 'api') {
  if (process.env.FAKE_MODE === 'auth-failure') {
    process.stderr.write('raw auth private/destination ' + process.env.GH_TOKEN)
    process.exit(1)
  }
  if (args[1].endsWith('/permission')) {
    process.stdout.write(args[1].includes('/collaborators/contributor/') ? process.env.FAKE_AUTHOR_PERMISSION : process.env.FAKE_PERMISSION)
  } else {
    if (process.env.FAKE_MODE === 'pr-failure') process.exit(1)
    process.stdout.write(process.env.FAKE_PR)
  }
} else {
  process.stdout.write('raw dispatch private/destination ' + process.env.GH_TOKEN)
  if (process.env.FAKE_MODE === 'dispatch-failure') process.exit(1)
}
`

function createPullRequest(options) {
  return {
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
}

function commentEvent(options, pullRequest) {
  return {
    issue: {
      number: 42,
      pull_request: { html_url: pullRequest.html_url },
      ...options.issue,
    },
    comment: {
      body: options.comment ?? '@ai-review',
      user: { login: options.actor ?? 'maintainer', type: 'User', ...options.commentUser },
    },
  }
}

function createEvent(options, pullRequest) {
  const eventName = options.eventName ?? 'pull_request_target'
  return {
    action: options.action ?? (eventName === 'issue_comment' ? 'created' : 'opened'),
    sender: { login: options.actor ?? 'maintainer', type: 'User', ...options.sender },
    repository: { full_name: 'example/consumer', default_branch: 'main' },
    ...(eventName === 'pull_request_target' ? { pull_request: pullRequest } : {}),
    ...(eventName === 'workflow_dispatch' ? { inputs: { pr_number: options.prNumber ?? '42' } } : {}),
    ...(eventName === 'issue_comment' ? commentEvent(options, pullRequest) : {}),
  }
}

async function createWorkspace(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ai-review-dispatch-'))
  t.after(() => rm(root, { recursive: true, force: true }))
  const bin = path.join(root, 'bin')
  const workspace = path.join(root, 'checkout')
  await mkdir(bin)
  await mkdir(path.join(workspace, '.github'), { recursive: true })
  return { root, bin, workspace, eventPath: path.join(root, 'event.json'), logPath: path.join(root, 'calls.jsonl') }
}

async function writeGuidance(options, workspace) {
  if (options.guidance !== undefined) {
    await writeFile(path.join(workspace, '.github', 'ai-review.md'), options.guidance)
  }
  if (options.guidanceError) {
    await mkdir(path.join(workspace, '.github', 'ai-review.md'))
  }
}

async function createGh(bin) {
  const gh = path.join(bin, 'gh')
  await writeFile(gh, ghStub)
  await chmod(gh, 0o755)
}

function requestEnvironment(options, context) {
  return {
    PATH: `${context.bin}${path.delimiter}${process.env.PATH}`,
    GITHUB_EVENT_NAME: options.eventName ?? 'pull_request_target',
    GITHUB_EVENT_PATH: context.eventPath,
    GITHUB_ACTOR: options.actor ?? 'maintainer',
    GITHUB_REPOSITORY: 'example/consumer',
    GITHUB_REF: options.ref ?? 'refs/heads/main',
    GITHUB_WORKSPACE: context.workspace,
    AI_REVIEW_DISPATCH_REPOSITORY: options.target ?? 'private/destination',
    AI_REVIEW_DISPATCH_REF: options.dispatchRef ?? '',
    GH_TOKEN: options.dispatchToken ?? 'service-secret',
    GH_READ_TOKEN: 'repository-read-secret',
    FAKE_LOG: context.logPath,
  }
}

function fakeEnvironment(options, pullRequest) {
  return {
    FAKE_MODE: options.ghMode ?? 'success',
    FAKE_PERMISSION: options.permissionResponse ?? JSON.stringify({ permission: options.permission ?? 'write' }),
    FAKE_AUTHOR_PERMISSION:
      options.authorPermissionResponse ?? JSON.stringify({ permission: options.authorPermission ?? 'write' }),
    FAKE_PR: options.prResponse ?? JSON.stringify({ ...pullRequest, ...options.currentPullRequest }),
  }
}

async function readCalls(logPath) {
  try {
    return (await readFile(logPath, 'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return []
  }
}

function assertRedacted(result) {
  for (const secret of [
    'service-secret',
    'repository-read-secret',
    'private/destination',
    'raw auth',
    'raw dispatch',
  ]) {
    assert.equal(`${result.stdout}${result.stderr}`.includes(secret), false, `output exposed ${secret}`)
  }
}

export async function fixture(t, options = {}) {
  const context = await createWorkspace(t)
  const pullRequest = createPullRequest(options)
  await writeFile(context.eventPath, JSON.stringify(createEvent(options, pullRequest)))
  await writeGuidance(options, context.workspace)
  await createGh(context.bin)
  const result = spawnSync(process.execPath, [script], {
    cwd: context.root,
    encoding: 'utf8',
    env: { ...process.env, ...requestEnvironment(options, context), ...fakeEnvironment(options, pullRequest) },
  })
  const calls = await readCalls(context.logPath)
  assertRedacted(result)
  return { result, calls }
}

function dispatchArguments(dispatchRef) {
  return [
    'workflow',
    'run',
    'hybrid-agent-pipeline.yml',
    '--repo',
    'private/destination',
    '--ref',
    dispatchRef,
    '-f',
    'pr_url=https://github.com/example/consumer/pull/42',
    '-f',
    'profile=review-gh-pr',
    '-f',
    'workflow_config={"version":1}',
    '-f',
    'post_comments=true',
  ]
}

export function assertDispatched({ result, calls }, { permissionChecks = 2, dispatchRef = 'main' } = {}) {
  assert.equal(result.status, 0, result.stderr)
  assert.deepEqual(
    calls.map(({ token }) => token),
    [...Array(permissionChecks).fill('repository-read-secret'), 'service-secret']
  )
  assert.deepEqual(calls[0].args, ['api', 'repos/example/consumer/collaborators/maintainer/permission'])
  assert.deepEqual(calls[1].args, ['api', 'repos/example/consumer/pulls/42'])
  if (permissionChecks === 3) {
    assert.deepEqual(calls[2].args, ['api', 'repos/example/consumer/collaborators/contributor/permission'])
  }
  assert.deepEqual(calls.at(-1).args, dispatchArguments(dispatchRef))
}
