import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { printWarnings } from '@onecx/nx-migration-utils'
import { removeAndTrackImport } from './utils/remove-and-track-import'

const INTERFACE_NAME = 'IAuthService';
const AUTH_SERVICE_NAME = 'AUTH_SERVICE';
const IMPORT_PATHS = [
  '@onecx/angular-integration-interface',
  '@onecx/portal-integration-angular',
];

export default async function removeAuthService(tree: Tree) {
  const affectedFiles = new Set<string>()
  const affectedAuthServiceFiles = new Set<string>()

  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    const fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

    removeAndTrackImport(tree, filePath, fileContent, IMPORT_PATHS, INTERFACE_NAME, affectedFiles);
    removeAndTrackImport(tree, filePath, fileContent, IMPORT_PATHS, AUTH_SERVICE_NAME, affectedAuthServiceFiles);
  });

  printWarnings(
    `IAuthService is no longer available. Please adapt the usages accordingly.`,
    Array.from(affectedFiles)
  );

  printWarnings(
    `AUTH_SERVICE is no longer available. Please adapt the usages accordingly and use permission service or user service instead.`,
    Array.from(affectedAuthServiceFiles)
  );
}