import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { updateJsonFiles } from './update-json-files.utils'

// Mock printWarnings to avoid console output during tests
jest.mock('../../utils/print-warnings.utils', () => ({
  printWarnings: jest.fn(),
}))

describe('updateJsonFiles', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('updates all JSON files in directory', () => {
    const dirPath = 'src'
    tree.write('src/config.json', JSON.stringify({ version: '1.0.0' }))
    tree.write('src/package.json', JSON.stringify({ name: 'test' }))
    tree.write('src/readme.txt', 'not json')

    const updater = (json: any) => ({ ...json, updated: true })
    updateJsonFiles(tree, dirPath, updater)

    const configContent = tree.read('src/config.json', 'utf-8')
    const pkgContent = tree.read('src/package.json', 'utf-8')

    expect(configContent).not.toBeNull()
    expect(pkgContent).not.toBeNull()

    const config = JSON.parse(configContent as string)
    const pkg = JSON.parse(pkgContent as string)

    expect(config.updated).toBe(true)
    expect(pkg.updated).toBe(true)
  })

  it('ignores non-JSON files', () => {
    const dirPath = 'src'
    tree.write('src/test.ts', 'export class Test {}')
    tree.write('src/data.json', JSON.stringify({ data: 'test' }))

    const updater = (json: any) => ({ ...json, modified: true })
    updateJsonFiles(tree, dirPath, updater)

    const tsContent = tree.read('src/test.ts', 'utf-8')
    const jsonContentRaw = tree.read('src/data.json', 'utf-8')

    expect(jsonContentRaw).not.toBeNull()
    const jsonContent = JSON.parse(jsonContentRaw as string)

    expect(tsContent).toBe('export class Test {}')
    expect(jsonContent.modified).toBe(true)
  })

  it('handles updater function correctly', () => {
    tree.write('test.json', JSON.stringify({ count: 5, name: 'test' }))

    const updater = (json: any) => ({
      ...json,
      count: json.count * 2,
      newField: 'added',
    })

    updateJsonFiles(tree, '.', updater)

    const resultContent = tree.read('test.json', 'utf-8')
    expect(resultContent).not.toBeNull()

    const result = JSON.parse(resultContent as string)
    expect(result.count).toBe(10)
    expect(result.name).toBe('test')
    expect(result.newField).toBe('added')
  })

  it('processes nested directories', () => {
    tree.write('level1/level2/deep.json', JSON.stringify({ deep: true }))
    tree.write('level1/shallow.json', JSON.stringify({ shallow: true }))

    const updater = (json: any) => ({ ...json, processed: true })
    updateJsonFiles(tree, 'level1', updater)

    const deepContent = tree.read('level1/level2/deep.json', 'utf-8')
    const shallowContent = tree.read('level1/shallow.json', 'utf-8')

    expect(deepContent).not.toBeNull()
    expect(shallowContent).not.toBeNull()

    const deep = JSON.parse(deepContent as string)
    const shallow = JSON.parse(shallowContent as string)

    expect(deep.processed).toBe(true)
    expect(shallow.processed).toBe(true)
  })

  it('handles warning options', () => {
    const { printWarnings } = require('../../utils/print-warnings.utils')

    tree.write('src/special-file.json', JSON.stringify({ test: true }))
    tree.write('src/normal.json', JSON.stringify({ normal: true }))

    const updater = (json: any) => json
    const options = {
      warn: true,
      warning: 'Special files found',
      contentCondition: 'special',
    }

    updateJsonFiles(tree, 'src', updater, options)

    expect(printWarnings).toHaveBeenCalledWith('Special files found', ['src/special-file.json'])
  })
})
