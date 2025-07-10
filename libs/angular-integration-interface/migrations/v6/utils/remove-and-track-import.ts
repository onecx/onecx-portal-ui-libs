import { Tree } from "@nx/devkit";
import { removeImportSpecifierFromImport } from "libs/nx-migration-utils/src/lib/utils/modification/remove-import-specifier.utils";
import { isImportSpecifierInContent } from "libs/nx-migration-utils/src/lib/utils/validation/is-import-in-file-content.utils";

export function removeAndTrackImport(tree: Tree, filePath: string, fileContent: string, importPaths: string[], importName: string, affectedSet: Set<string>) {
  for (const importPath of importPaths) {
    if (isImportSpecifierInContent(fileContent, importPath, importName)) {
      removeImportSpecifierFromImport(tree, filePath, importPath, importName);
      affectedSet.add(filePath);
    }
  }
}