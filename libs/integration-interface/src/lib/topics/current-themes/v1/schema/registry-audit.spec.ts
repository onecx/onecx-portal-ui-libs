import { readFileSync, readdirSync } from 'node:fs'
import { extname, join } from 'node:path'

function listSchemaFiles(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...listSchemaFiles(fullPath))
    } else if (extname(entry.name) === '.ts' && !entry.name.endsWith('.spec.ts')) {
      files.push(fullPath)
    }
  }
  return files
}

const REGISTER_CALL = /register\(themeSchemaRegistry,\s*\{[^}]*\}\)/g
const VALID_AXIS = /axis:\s*'(variant|state|severity|child|none)'/

// Scanned once at module load so a missing `axis` marker fails the whole suite.
const violations: { file: string; snippet: string }[] = []
for (const file of listSchemaFiles(join(__dirname))) {
  const content = readFileSync(file, 'utf-8')
  const matches = content.match(REGISTER_CALL)
  if (!matches) {
    continue
  }
  for (const snippet of matches) {
    if (!VALID_AXIS.test(snippet)) {
      violations.push({ file, snippet })
    }
  }
}

describe('themeSchemaRegistry axis marker coverage', () => {
  it('every registered schema node declares a valid axis marker', () => {
    expect(violations).toEqual([])
  })
})
