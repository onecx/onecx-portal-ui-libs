import { Tree } from '@nx/devkit'
import { replaceImportValuesAndModule } from '@onecx/nx-migration-utils'

export default async function replacePermissionChecker(tree: Tree) {
  const srcDirectoryPath = 'src'

  replaceImportValuesAndModule(tree, srcDirectoryPath, [
    {
      oldModuleSpecifier: '@onecx/angular-accelerator',
      newModuleSpecifier: '@onecx/angular-utils',
      valueReplacements: [
        {
          oldValue: 'HasPermissionChecker',
          newValue: 'HasPermissionChecker',
        },
        {
          oldValue: 'AlwaysGrantPermissionChecker',
          newValue: 'AlwaysGrantPermissionChecker',
        },
        {
          oldValue: 'HAS_PERMISSION_CHECKER',
          newValue: 'HAS_PERMISSION_CHECKER',
        },
      ],
    },
  ])
}
