import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree, logger } from '@nx/devkit'
import warnForRemovedUtils from './warn-for-removed-utils'

describe('warn-for-removed-utils', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should warn when isValidDate is used', async () => {
    const spy = jest.spyOn(logger, 'warn').mockImplementation(() => {})
    tree.write(
      'src/app/main.ts',
      `
    import { isValidDate, AngularAcceleratorModule } from '@onecx/angular-accelerator'

    const date = 'date'

    function testFunction() {
      isValidDate(date)
    }`
    )
    await warnForRemovedUtils(tree)
    expect(spy).toHaveBeenCalledWith(
      '⚠️ isValidDate is no longer available. Please adapt the usages with your own implementation. Found in: src/app/main.ts'
    )
  })
})
