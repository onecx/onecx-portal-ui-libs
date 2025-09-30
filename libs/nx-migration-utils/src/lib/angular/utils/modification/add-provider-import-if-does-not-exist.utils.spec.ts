import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { addProviderImportIfDoesNotExist } from './add-provider-import-if-does-not-exist.utils'
import { Provider } from '../../model/provider.model'

describe('addProviderImportIfDoesNotExist', () => {
  let tree: Tree
  const mockProvider: Provider = {
    name: 'TestProvider',
    importPath: '@test/provider',
  }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should handle existing file with provider import', () => {
    const fileContent = 'import {TestProvider} from "@test/provider";\nconst test = "test";'
    tree.write('test.ts', fileContent)

    addProviderImportIfDoesNotExist(tree, 'test.ts', mockProvider)

    // File should remain unchanged since provider already exists
    const result = tree.read('test.ts', 'utf-8')
    expect(result).toBe(fileContent)
  })

  it('should handle existing file without provider import', () => {
    const fileContent = 'const test = "test";'
    tree.write('test.ts', fileContent)

    addProviderImportIfDoesNotExist(tree, 'test.ts', mockProvider)

    // File should be updated with provider import
    const result = tree.read('test.ts', 'utf-8')
    expect(result).toContain('import {TestProvider}')
    expect(result).toContain('@test/provider')
  })

  it('should handle non-existent file gracefully', () => {
    addProviderImportIfDoesNotExist(tree, 'non-existent.ts', mockProvider)

    // Function should not crash and file should not be created
    expect(tree.exists('non-existent.ts')).toBe(false)
  })

  it('should not write file when no changes are needed', () => {
    const fileContent = 'import {TestProvider} from "@test/provider";\nconst test = "test";'
    tree.write('test.ts', fileContent)

    const writeSpy = jest.spyOn(tree, 'write')

    addProviderImportIfDoesNotExist(tree, 'test.ts', mockProvider)

    // tree.write should not be called since content is unchanged
    expect(writeSpy).not.toHaveBeenCalledWith('test.ts', expect.anything())

    writeSpy.mockRestore()
  })
})
