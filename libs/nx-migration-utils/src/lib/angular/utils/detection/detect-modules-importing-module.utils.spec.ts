import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import { detectModulesImportingModule } from './detect-modules-importing-module.utils'
import { Module } from '../../model/module.model'

describe('detectModulesImportingModule', () => {
  let tree: Tree
  const mockModule: Module = {
    name: 'TestModule',
  }

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should detect modules importing the given module', () => {
    tree.write(
      'src/test.ts',
      `
      @NgModule({
        imports: [TestModule]
      })
      export class MyModule {}
    `
    )

    const result = detectModulesImportingModule(tree, 'src', mockModule, [])

    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('MyModule')
  })

  it('handles null content gracefully', () => {
    jest.spyOn(tree, 'read').mockReturnValue(null as any)

    const result = detectModulesImportingModule(tree, 'src', mockModule, [])

    expect(result).toEqual([])
  })
})
