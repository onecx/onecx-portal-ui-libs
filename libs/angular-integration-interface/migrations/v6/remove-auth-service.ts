import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '@onecx/nx-migration-utils'
import { isImportInContent } from '@onecx/nx-migration-utils'
import { deleteImportSpecifierFromImport } from '@onecx/nx-migration-utils'

const INTERFACE_NAME = 'IAuthService';
const AUTH_SERVICE_NAME = 'AUTH_SERVICE';
const IMPORT_PATHS = [
  '@onecx/angular-integration-interface',
  '@onecx/portal-integration-angular',
];

export default async function removeAuthService(tree: Tree) {
  const affectedFiles: string[] = [];
  const affectedAuthServiceFiles: string[] = [];

  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    let fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

    for (const importPath of IMPORT_PATHS) {
      if (isImportInContent(fileContent, importPath) && fileContent.includes(INTERFACE_NAME)) {
        deleteImportSpecifierFromImport(tree, filePath, importPath, INTERFACE_NAME);
        if (!affectedFiles.includes(filePath)) affectedFiles.push(filePath);
      }
    }
   
    for (const importPath of IMPORT_PATHS) {
      if (isImportInContent(fileContent, importPath) && fileContent.includes(AUTH_SERVICE_NAME)) {
        deleteImportSpecifierFromImport(tree, filePath, importPath, AUTH_SERVICE_NAME);
        if (!affectedAuthServiceFiles.includes(filePath)) affectedAuthServiceFiles.push(filePath);
      }
    }
  });

  printWarnings(
    `IAuthService is no longer available. Please adapt the usages accordingly and use permission service or user service instead.`,
    affectedFiles
  );

  printWarnings(
    `AUTH_SERVICE is no longer available. Please adapt the usages accordingly.`,
    affectedAuthServiceFiles
  );
}