import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { ClassDeclaration } from 'typescript'

/**
 * Detects all Angular modules and components in the given directory.
 * @param tree - The file tree to search in.
 * @param rootDir - The directory to start searching from.
 * @returns {Array<{ filePath: string; ast: ClassDeclaration }>} A list of file paths and their ASTs containing Angular modules or components.
 */
export function detectModulesAndComponents(
  tree: Tree,
  rootDir: string
): Array<{ filePath: string; ast: ClassDeclaration }> {
  const modulesAndComponents: Array<{ filePath: string; ast: ClassDeclaration }> = []

  visitNotIgnoredFiles(tree, rootDir, (filePath) => {
    if (!filePath.endsWith('.ts')) return

    const fileContent = tree.read(filePath)?.toString()
    if (!fileContent) return

    const contentAst = ast(fileContent)

    // Query for classes with @NgModule or @Component decorators
    const classDeclarations = query<ClassDeclaration>(
      contentAst,
      'ClassDeclaration:has(Decorator > CallExpression > Identifier[name="NgModule"]), ClassDeclaration:has(Decorator > CallExpression > Identifier[name="Component"])'
    )

    classDeclarations.forEach((classDeclaration) => {
      modulesAndComponents.push({ filePath, ast: classDeclaration })
    })
  })

  return modulesAndComponents
}
