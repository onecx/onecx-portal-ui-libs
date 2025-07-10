import { Tree } from "@nx/devkit";
import { removeImportSpecifierFromImport } from "@onecx/nx-migration-utils";
import { isImportSpecifierInContent } from "@onecx/nx-migration-utils";

export function removeAndTrackImport(tree: Tree, filePath: string, fileContent: string, importPaths: string[], importName: string, affectedSet: Set<string>) {
  for (const importPath of importPaths) {
    if (isImportSpecifierInContent(fileContent, importPath, importName)) {
      removeImportSpecifierFromImport(tree, filePath, importPath, importName);
      affectedSet.add(filePath);
    }
  }
}