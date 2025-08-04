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

  // TODO: fix for forRoot() and forMicroFrontend() usage
  // Additionally replace all usages of PortalCoreModule with AngularAcceleratorModule in code
  // Replace all usages of provideAppServiceMock with provideAppStateServiceMock in all files that import provideAppServiceMock from @onecx/angular-integration-interface/mocks
  // const filterQuery = `ImportDeclaration:has(StringLiteral[value="${PROVIDER_IMPORT_PATH}"]) ImportSpecifier:has(Identifier[name="${PROVIDER_NAME}"])`;
  replaceInFiles(
    tree,
    srcDirectoryPath,
    'ArrayLiteralExpression > CallExpression:has(PropertyAccessExpression[expression.name="PortalCoreModule"]), ArrayLiteralExpression > Identifier[name=PortalCoreModule]',
    'AngularAcceleratorModule'
  );
}