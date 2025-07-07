import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree, logger } from '@nx/devkit'
import warnForRemovedComponents from './warn-for-removed-components'

describe('warn-for-removed-components', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should warn when DataLoadingErrorComponent is used', async () => {
    const spy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
    tree.write(
      'src/app/main.ts',
      `
      import { DataLoadingErrorComponent, AngularAcceleratorModule } from '@onecx/angular-accelerator'

      @NgModule(
        declarations: [DataLoadingErrorComponent]
      )
      class MyModule {}`
    )
    await warnForRemovedComponents(tree)
    expect(spy).toHaveBeenCalledWith(
      '⚠️ DataLoadingErrorComponent (ocx-data-loading-error) is no longer available. Please adapt the usages with your own implementation. Found in: src/app/main.ts'
    )
  })

  it('should warn when ocx-data-loading-error is used', async () => {
    const spy = jest.spyOn(logger, 'warn').mockImplementation(jest.fn())
    tree.write(
      'src/app/comp.html',
      `
      <h1></h1>
      <ocx-data-loading-error></ocx-data-loading-error>`
    )
    await warnForRemovedComponents(tree)
    expect(spy).toHaveBeenCalledWith(
      '⚠️ DataLoadingErrorComponent (ocx-data-loading-error) is no longer available. Please adapt the usages with your own implementation. Found in: src/app/main.ts'
    )
  })
})
