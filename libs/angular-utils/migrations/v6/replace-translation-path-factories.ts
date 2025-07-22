import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { removeImportSpecifierFromImport } from '@onecx/nx-migration-utils'
import { addProviderImportInFile } from '@onecx/nx-migration-utils/angular'
import { ast, query, replace, ScriptKind } from '@phenomnomnominal/tsquery'
import { ObjectLiteralExpression, PropertyAssignment, isObjectLiteralExpression, isPropertyAssignment, isStringLiteral, isCallExpression } from 'typescript'

export default async function replaceTranslationPathFactories(tree: Tree) {
  visitNotIgnoredFiles(tree, 'src', (filePath) => {
    if (!filePath.endsWith('.ts')) return;
    let fileContent = tree.read(filePath, 'utf-8');
    if (!fileContent) return;

    // // Remove old import specifiers from @onecx/angular-utils
    const specifiers = ['TRANSLATION_PATH', 'remoteComponentTranslationPathFactory', 'translationPathFactory']
    for (const specifier of specifiers) {
      removeImportSpecifierFromImport(tree, filePath, '@onecx/angular-utils', specifier);
      fileContent = tree.read(filePath, 'utf-8');
    }

    // Add provideTranslationPathFromMeta to imports if not present
    if (fileContent) {
      fileContent = addProviderImportInFile(fileContent, { name: 'provideTranslationPathFromMeta', importPath: '@onecx/angular-utils' });
    }

    if (!fileContent) return;
    // // AST-based replacement of provider usages
    // // Replace object providers
    let path;
    const astSource = ast(fileContent);
    const stringLiterals = query(
        astSource,
        'CallExpression[expression.name="remoteComponentTranslationPathFactory"] > StringLiteral'
        );
    if (stringLiterals.length > 0) {
        path = stringLiterals[0].getText();
    } else {
        const stringLiterals = query(
        astSource,
        'CallExpression[expression.name="translationPathFactory"] > StringLiteral'
        );
        if (stringLiterals.length > 0) {
        path = stringLiterals[0].getText();
        } else return
    }

    // Remove provider with provide: TRANSLATION_PATH
    fileContent = replace(
      fileContent,
      'ObjectLiteralExpression:has(PropertyAssignment:has(Identifier[name="provide"]) > Identifier[name="TRANSLATION_PATH"])',
      () => `provideTranslationPathFromMeta(import.meta.url, ${path})`,
      ScriptKind.TS
    );

    // Remove trailing commas in providers arrays
    if (fileContent) {
      fileContent = fileContent.replace(/,\s*([\]\)])/g, '$1');
    }

    // Write back the result
    if (fileContent) {
      tree.write(filePath, fileContent);
    }
  });
}