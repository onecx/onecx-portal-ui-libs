import { Tree, visitNotIgnoredFiles } from '@nx/devkit'

/**
 * Retrieves the paths of the files that contain a pattern.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param matcher - string or RegExp to match
 * @returns {string[]} list of file paths containing the pattern
 */
export function findPatternInFiles(tree: Tree, rootDir: string, matcher: string | RegExp): string[] {
  const matchingFiles: string[] = []

  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (content) {
      const contentWithoutLineBreaks = content.replace(/\s+/g, ' ')
      if (typeof matcher === 'string' && contentWithoutLineBreaks.includes(matcher)) {
        matchingFiles.push(file)
      } else if (matcher instanceof RegExp && matcher.test(contentWithoutLineBreaks)) {
        matchingFiles.push(file)
      }
    }
  })

  return matchingFiles
}
