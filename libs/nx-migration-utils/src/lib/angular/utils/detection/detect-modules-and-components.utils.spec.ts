import { detectModulesAndComponents } from './detect-modules-and-components.utils'
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'

describe('detectModulesAndComponents', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should detect modules and components in the workspace', () => {
    const moduleContent = `
      import { NgModule } from '@angular/core';

      @NgModule({
        imports: [],
        declarations: []
      })
      export class AppModule {}
    `

    const componentContent = `
      import { Component } from '@angular/core';

      @Component({
        selector: 'app-root',
        template: '<h1>Hello World</h1>'
      })
      export class AppComponent {}
    `

    tree.write('apps/app/src/app.module.ts', moduleContent)
    tree.write('apps/app/src/app.component.ts', componentContent)

    const result = detectModulesAndComponents(tree, 'apps/app/src')

    expect(result).toHaveLength(2)
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ filePath: 'apps/app/src/app.module.ts' }),
        expect.objectContaining({ filePath: 'apps/app/src/app.component.ts' }),
      ])
    )
  })

  it('should return an empty array if no modules or components are found', () => {
    tree.write('apps/app/src/empty-file.ts', '')

    const result = detectModulesAndComponents(tree, 'apps/app/src')

    expect(result).toHaveLength(0)
  })
})
