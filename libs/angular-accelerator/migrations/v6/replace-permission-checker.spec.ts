import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing'
import { Tree } from '@nx/devkit'
import replacePermissionChecker from './replace-permission-checker'

describe('replace-permission-checker', () => {
  let tree: Tree

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace()
  })

  it('should replace permission checker imports', async () => {
    const filePath = 'src/app/main.ts'
    tree.write(
      filePath,
      `
    import { HasPermissionChecker, AngularAcceleratorModule, AlwaysGrantPermissionChecker, HAS_PERMISSION_CHECKER, UserService } from "@onecx/angular-accelerator"

    @NgModule()
    class MyModule { }`
    )
    await replacePermissionChecker(tree)

    const content = tree.read(filePath)?.toString()

    expect(content).toEqualIgnoringWhitespace(`
    import { AngularAcceleratorModule, UserService } from "@onecx/angular-accelerator";
    import { HasPermissionChecker, AlwaysGrantPermissionChecker, HAS_PERMISSION_CHECKER } from "@onecx/angular-utils";

    @NgModule()
    class MyModule { }
    `)
  })
})
