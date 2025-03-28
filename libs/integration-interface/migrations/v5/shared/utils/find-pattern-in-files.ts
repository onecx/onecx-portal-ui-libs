import { MatchPattern } from '../interfaces/match-pattern'
import * as fs from 'fs'
import * as path from 'path'

export function findPatternInFiles(rootDir: string, pattern: MatchPattern): string[] {
  const matchingFiles: string[] = []

  function checkFilesInDir(dirPath: string) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', 'tmp', 'build'].includes(entry.name)) {
          return checkFilesInDir(fullPath)
        }
      } else {
        const content = fs.readFileSync(fullPath, 'utf-8')
        const normalized = content.replace(/\s+/g, ' ') // flatten whitespace

        if (pattern.pattern.test(normalized)) {
          matchingFiles.push(fullPath)
        }
      }
    }
  }

  checkFilesInDir(rootDir)
  return matchingFiles
}
