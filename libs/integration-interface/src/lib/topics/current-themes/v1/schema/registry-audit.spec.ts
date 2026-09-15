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
// `axis` is optional (absent for structural pass-throughs); when present it must be one of the
// recognized values. `none` is no longer a valid value.
const VALID_AXIS = /axis:\s*'(variant|state|severity|child|setting)'/

// Scanned once at module load so an invalid `axis` value fails the whole suite.
const violations: { file: string; snippet: string }[] = []
for (const file of listSchemaFiles(join(__dirname))) {
  const content = readFileSync(file, 'utf-8')
  const matches = content.match(REGISTER_CALL)
  if (!matches) {
    continue
  }
  for (const snippet of matches) {
    if (snippet.includes('axis:') && !VALID_AXIS.test(snippet)) {
      violations.push({ file, snippet })
    }
  }
}

describe('themeSchemaRegistry axis marker coverage', () => {
  it('every registered schema node either omits axis or declares a valid axis value', () => {
    expect(violations).toEqual([])
  })
})
