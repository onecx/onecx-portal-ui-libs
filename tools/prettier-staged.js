const { execFileSync } = require('node:child_process')
const { stagedFiles: stagedFilesList } = require('./staged-files.js')

async function checkStagedFiles() {
  const stagedFiles = stagedFilesList().filter((file) => !isTakenUnchangedFromMerge(file))

  if (stagedFiles.length === 0) {
    return
  }

  const prettier = require('prettier')
  let failed = false

  for (const file of stagedFiles) {
    const fileInfo = await prettier.getFileInfo(file, { ignorePath: '.prettierignore' })
    if (fileInfo.ignored || !fileInfo.inferredParser) {
      continue
    }

    const content = execFileSync('git', ['show', `:${file}`], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    })
    const config = await prettier.resolveConfig(file)
    if (!(await prettier.check(content, { ...config, filepath: file }))) {
      console.error(`Formatting check failed for staged file: ${file}`)
      failed = true
    }
  }

  process.exitCode = failed ? 1 : 0
}

function objectId(revision) {
  try {
    return execFileSync('git', ['rev-parse', '--quiet', '--verify', revision], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return undefined
  }
}

// During a merge, files that are staged exactly as on the merged branch were checked there. Only the files changed or
// resolved in the merge itself are checked.
function isTakenUnchangedFromMerge(file) {
  const mergedVersion = objectId(`MERGE_HEAD:${file}`)
  return mergedVersion !== undefined && mergedVersion === objectId(`:${file}`)
}

checkStagedFiles().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
