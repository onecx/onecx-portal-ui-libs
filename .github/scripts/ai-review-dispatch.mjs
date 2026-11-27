import { readFile } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const allowedActions = new Set(['opened', 'synchronize', 'ready_for_review'])
const allowedAssociations = new Set(['OWNER', 'MEMBER', 'COLLABORATOR'])
const allowedPermissions = new Set(['write', 'maintain', 'admin'])
const maxGuidanceLength = 4000

function validationError() {
  throw new Error('validation')
}

function validatePullRequest(pullRequest, sourceRepository, number) {
  if (
    pullRequest?.state !== 'open' ||
    pullRequest?.draft !== false ||
    pullRequest?.user?.type !== 'User' ||
    !/^[A-Za-z0-9-]+$/.test(pullRequest?.user?.login ?? '') ||
    pullRequest?.base?.repo?.full_name?.toLowerCase() !== sourceRepository.toLowerCase() ||
    !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(pullRequest?.head?.repo?.full_name ?? '') ||
    pullRequest?.number !== number
  ) {
    validationError()
  }
  const parsedUrl = new URL(pullRequest.html_url)
  if (
    parsedUrl.origin !== 'https://github.com' ||
    parsedUrl.username !== '' ||
    parsedUrl.password !== '' ||
    parsedUrl.search !== '' ||
    parsedUrl.hash !== '' ||
    parsedUrl.pathname.toLowerCase() !== `/${sourceRepository}/pull/${number}`.toLowerCase()
  ) {
    validationError()
  }
  return parsedUrl.href
}

function validateEnvironment(env) {
  const required = [
    'GITHUB_EVENT_NAME',
    'GITHUB_EVENT_PATH',
    'GITHUB_ACTOR',
    'GITHUB_REPOSITORY',
    'GITHUB_WORKSPACE',
    'AI_REVIEW_DISPATCH_REPOSITORY',
    'GH_TOKEN',
    'GH_READ_TOKEN',
  ]
  if (required.some((key) => !env[key])) validationError()
}

async function loadRequest(env) {
  validateEnvironment(env)
  const sourceRepository = env.GITHUB_REPOSITORY
  const targetRepository = env.AI_REVIEW_DISPATCH_REPOSITORY
  const actor = env.GITHUB_ACTOR
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(sourceRepository)) validationError()
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(targetRepository)) validationError()
  if (!/^[A-Za-z0-9-]+$/.test(actor) || actor.endsWith('[bot]')) validationError()

  const event = JSON.parse(await readFile(env.GITHUB_EVENT_PATH, 'utf8'))
  if (
    event?.repository?.full_name?.toLowerCase() !== sourceRepository.toLowerCase() ||
    event?.sender?.type !== 'User' ||
    event?.sender?.login?.toLowerCase() !== actor.toLowerCase() ||
    !['pull_request_target', 'issue_comment', 'workflow_dispatch'].includes(env.GITHUB_EVENT_NAME)
  ) {
    validationError()
  }

  let number
  if (env.GITHUB_EVENT_NAME === 'pull_request_target') {
    if (!allowedActions.has(event.action)) validationError()
    number = event.pull_request?.number
    validatePullRequest(event.pull_request, sourceRepository, number)
  } else if (env.GITHUB_EVENT_NAME === 'issue_comment') {
    if (
      event.action !== 'created' ||
      !event.issue?.pull_request ||
      event.comment?.body !== '@ai-review' ||
      event.comment?.user?.type !== 'User' ||
      event.comment?.user?.login?.toLowerCase() !== actor.toLowerCase()
    ) {
      validationError()
    }
    number = event.issue.number
  } else {
    if (
      typeof event.repository.default_branch !== 'string' ||
      env.GITHUB_REF !== `refs/heads/${event.repository.default_branch}` ||
      typeof event.inputs?.pr_number !== 'string' ||
      !/^[1-9][0-9]*$/.test(event.inputs.pr_number)
    ) {
      validationError()
    }
    number = Number(event.inputs.pr_number)
  }
  if (!Number.isSafeInteger(number) || number < 1) validationError()

  let additionalContext
  const guidancePath = path.join(env.GITHUB_WORKSPACE, '.github', 'ai-review.md')
  try {
    additionalContext = (await readFile(guidancePath, 'utf8')).trim()
  } catch (error) {
    if (error?.code !== 'ENOENT') validationError()
  }
  if (additionalContext) {
    // Match the downstream JavaScript string.length limit (UTF-16 code units).
    if (additionalContext.length > maxGuidanceLength) validationError()
  } else {
    additionalContext = undefined
  }

  return {
    actor,
    sourceRepository,
    targetRepository,
    number,
    additionalContext,
  }
}

function runGh(args, env, token) {
  const ghEnv = { ...env, GH_TOKEN: token }
  delete ghEnv.AI_REVIEW_DISPATCH_REPOSITORY
  delete ghEnv.GH_READ_TOKEN
  return spawnSync('gh', args, {
    encoding: 'utf8',
    env: {
      ...ghEnv,
      GH_PROMPT_DISABLED: '1',
      GH_NO_UPDATE_NOTIFIER: '1',
    },
    maxBuffer: 1024 * 1024,
    timeout: 60000,
    windowsHide: true,
  })
}

function failed(result) {
  return !result || Boolean(result.error) || result.status !== 0 || result.signal !== null
}

function assertWritePermission(result) {
  if (failed(result) || !allowedPermissions.has(JSON.parse(result.stdout).permission)) {
    throw new Error('authorization')
  }
}

function safelyRunGh(args, env, token) {
  try {
    return runGh(args, env, token)
  } catch {
    return undefined
  }
}

export async function dispatchReview(env = process.env) {
  let request
  try {
    request = await loadRequest(env)
  } catch {
    process.stderr.write('Review dispatch validation failed.\n')
    return 1
  }

  const authorization = safelyRunGh(
    ['api', `repos/${request.sourceRepository}/collaborators/${request.actor}/permission`],
    env,
    env.GH_READ_TOKEN
  )
  try {
    assertWritePermission(authorization)
  } catch {
    process.stderr.write('Review dispatch authorization failed.\n')
    return 1
  }

  const lookup = safelyRunGh(
    ['api', `repos/${request.sourceRepository}/pulls/${request.number}`],
    env,
    env.GH_READ_TOKEN
  )
  let pullRequest
  try {
    if (failed(lookup)) throw new Error('lookup')
    pullRequest = JSON.parse(lookup.stdout)
  } catch {
    process.stderr.write('Review dispatch pull request lookup failed.\n')
    return 1
  }
  let pullRequestUrl
  try {
    pullRequestUrl = validatePullRequest(pullRequest, request.sourceRepository, request.number)
  } catch {
    process.stderr.write('Review dispatch validation failed.\n')
    return 1
  }
  if (
    !allowedAssociations.has(pullRequest.author_association) &&
    pullRequest.user.login.toLowerCase() !== request.actor.toLowerCase()
  ) {
    const authorAuthorization = safelyRunGh(
      ['api', `repos/${request.sourceRepository}/collaborators/${pullRequest.user.login}/permission`],
      env,
      env.GH_READ_TOKEN
    )
    try {
      assertWritePermission(authorAuthorization)
    } catch {
      process.stderr.write('Review dispatch author authorization failed.\n')
      return 1
    }
  }
  const args = [
    'workflow',
    'run',
    'hybrid-agent-pipeline.yml',
    '--repo',
    request.targetRepository,
    '--ref',
    env.AI_REVIEW_DISPATCH_REF || 'main',
    '-f',
    `pr_url=${pullRequestUrl}`,
    '-f',
    'profile=review-gh-pr',
    '-f',
    'workflow_config={"version":1}',
    '-f',
    'post_comments=true',
  ]
  if (request.additionalContext !== undefined) {
    args.push('-f', `additional_context=${request.additionalContext}`)
  }

  const dispatched = safelyRunGh(args, env, env.GH_TOKEN)
  if (failed(dispatched)) {
    process.stderr.write('Review dispatch failed.\n')
    return 1
  }
  process.stdout.write('Review dispatch requested.\n')
  return 0
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  dispatchReview().then((status) => {
    process.exitCode = status
  })
}
