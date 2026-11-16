const { execFileSync } = require('node:child_process')

async function checkStagedFiles() {
  const stagedFiles = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR', '-z'], {
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)

  if (stagedFiles.length === 0) {
    return
  }

  const prettier = require('prettier')
  let failed = false

  for (const file of stagedFiles) {
    const fileInfo = await prettier.getFileInfo(file)
    if (fileInfo.ignored || !fileInfo.inferredParser) {
      continue
    }

    const content = execFileSync('git', ['show', `:${file}`], { encoding: 'utf8' })
    const config = await prettier.resolveConfig(file)
    if (!(await prettier.check(content, { ...config, filepath: file }))) {
      console.error(`Formatting check failed for staged file: ${file}`)
      failed = true
    }
  }

  process.exitCode = failed ? 1 : 0
}

checkStagedFiles().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
