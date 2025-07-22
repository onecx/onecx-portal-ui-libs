import { Tree } from "@nx/devkit";
import { removeImportSpecifierFromImport } from "@onecx/nx-migration-utils";
import { addProviderImportInFile } from "@onecx/nx-migration-utils/angular";

export function updateTranslationPathImports(tree: Tree, filePath: string, fileContent: string) {
    // Remove old import specifiers from @onecx/angular-utils
    const specifiers = ['TRANSLATION_PATH', 'remoteComponentTranslationPathFactory', 'translationPathFactory']
    for (const specifier of specifiers) {
      removeImportSpecifierFromImport(tree, filePath, '@onecx/angular-utils', specifier);
      fileContent = tree.read(filePath, 'utf-8') ?? '';
    }

    // Add provideTranslationPathFromMeta to imports if not present
    // if (fileContent) {
    //   fileContent = addProviderImportInFile(fileContent, { name: 'provideTranslationPathFromMeta', importPath: '@onecx/angular-utils' });
    // }

    return fileContent;
}