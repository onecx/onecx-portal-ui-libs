import { Tree } from '@nx/devkit';
import { replaceInFiles } from '@onecx/nx-migration-utils/angular';

const PROVIDER_NAME = 'provideAppServiceMock';
const PROVIDER_NEW_NAME = 'provideAppStateServiceMock';
const PROVIDER_IMPORT_PATH = '@onecx/angular-integration-interface/mocks';

export default async function replaceProvideAppServiceMock(tree: Tree) {
  const srcDirectoryPath = 'src';

  // Replace all usages of provideAppServiceMock with provideAppStateServiceMock in all files that import provideAppServiceMock from @onecx/angular-integration-interface/mocks
  const filterQuery = `ImportDeclaration:has(StringLiteral[value="${PROVIDER_IMPORT_PATH}"]) ImportSpecifier:has(Identifier[name="${PROVIDER_NAME}"])`;
  replaceInFiles(
    tree,
    srcDirectoryPath,
    `Identifier[name="${PROVIDER_NAME}"]`,
    PROVIDER_NEW_NAME,
    filterQuery
  );
}