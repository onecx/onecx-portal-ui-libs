import { Tree } from '@nx/devkit'

const normalizeLine = (line: string) => line.trim()

/**
 * Adds an entry to .gitignore if it doesn't already exist.
 */
export function addGitignoreEntry(tree: Tree, entry: string) {
  const gitignorePath = '.gitignore'
  const normalizedEntry = normalizeLine(entry)

  if (!tree.exists(gitignorePath)) {
    tree.write(gitignorePath, `${normalizedEntry}\n`)
    return
  }

  const content = tree.read(gitignorePath, 'utf-8')
  if (!content) return

  const lines = content.split('\n').map(normalizeLine)

  if (!lines.includes(normalizedEntry)) {
    const updatedContent = content.trimEnd() + `\n${normalizedEntry}\n`
    tree.write(gitignorePath, updatedContent)
  }
}

/**
 * Removes an entry from .gitignore if it exists.
 */
export function removeGitignoreEntry(tree: Tree, entry: string) {
  const gitignorePath = '.gitignore'
  const normalizedEntry = normalizeLine(entry)

  if (!tree.exists(gitignorePath)) return

  const content = tree.read(gitignorePath, 'utf-8')
  if (!content) return

  const lines = content.split('\n')

  const filteredLines = lines.filter((line) => normalizeLine(line) !== normalizedEntry)

  if (lines.length !== filteredLines.length) {
    tree.write(gitignorePath, filteredLines.join('\n') + '\n')
  }
}
