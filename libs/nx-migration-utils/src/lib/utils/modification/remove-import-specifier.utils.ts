import { Tree } from "@nx/devkit";
import { ast, query, replace, ScriptKind } from "@phenomnomnominal/tsquery";
import { ImportDeclaration, isNamedImports } from "typescript";

/**
 * Removes a named import from a specific file and module, and deletes the import statement if it becomes empty (AST-based).
 * @param tree - The Nx virtual file system tree.
 * @param filePath - Path to the TypeScript file to update.
 * @param importPath - The module from which to remove the import.
 * @param specifier - The named import to remove.
 */
export function removeImportSpecifierFromImport(tree: Tree, filePath: string, importPath: string, specifier: string) {
  const fileContent = tree.read(filePath, 'utf-8');
  if (!fileContent) return;

  // Remove only the ImportSpecifier for the given specifier from the given importPath
  let updated = replace(
    fileContent,
    `ImportDeclaration:has(StringLiteral[value="${importPath}"]) ImportSpecifier:has(Identifier[name="${specifier}"])`,
    () => '',
    ScriptKind.TS
  );

  // AST: Remove the entire import if it is now empty
  const astSource = ast(updated);
  const importDecls = query(astSource, `ImportDeclaration:has(StringLiteral[value="${importPath}"])`);
  for (const decl of importDecls) {
  const importDecl = decl as ImportDeclaration;
  const namedBindings = importDecl.importClause?.namedBindings;
  if (namedBindings && isNamedImports(namedBindings) && namedBindings.elements.length === 0) {
    updated = replace(
      updated,
      `ImportDeclaration:has(StringLiteral[value="${importPath}"])`,
      () => '',
      ScriptKind.TS
    );
  }
}

  if (updated !== fileContent) {
    tree.write(filePath, updated);
  }
}