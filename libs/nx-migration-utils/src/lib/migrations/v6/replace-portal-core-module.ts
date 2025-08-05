import { Tree } from "@nx/devkit";
import { replaceImportValuesAndModule } from '../../utils/import-statements.utils';
import { replaceInFiles } from '../../angular/replacement-in-files.utils';

export default async function replacePortalCoreModule(tree: Tree, srcDirectoryPath: string) {

  replaceImportValuesAndModule(tree, srcDirectoryPath, [
    {
      oldModuleSpecifier: '@onecx/portal-integration-angular',
      newModuleSpecifier: '@onecx/angular-accelerator',
      valueReplacements: [
        {
          oldValue: 'PortalCoreModule',
          newValue: 'AngularAcceleratorModule',
        },
      ]
    }
  ]);

  replaceInFiles(
    tree,
    srcDirectoryPath,
    'ArrayLiteralExpression > CallExpression:has(PropertyAccessExpression[expression.name="PortalCoreModule"]), ArrayLiteralExpression > Identifier[name=PortalCoreModule]',
    'AngularAcceleratorModule'
  );
}