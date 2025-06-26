import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { ClassDeclaration } from 'typescript'
import { MatchingModule } from '../../model/matching-module.model'
import { Module } from '../../model/module.model'
import { moduleImportIdentifierPattern } from '../patterns.utils'

/**
 * Detects Angular module definitions that import given module.
 * @param tree - the file tree to search in
 * @param rootDir - the directory to start searching from
 * @param module - the module to search for
 * @param variablesIncludingModule - the list of variable names containing the module to search for
 * @returns {MatchingModule[]} a list of found modules that import the module via direct declaration or variable
 */
export function detectModulesImportingModule(
  tree: Tree,
  rootDir: string,
  module: Module,
  variablesIncludingModule: string[]
): MatchingModule[] {
  const matchingModules: MatchingModule[] = []
  // Query for import in module directly
  const directImportPattern = moduleImportIdentifierPattern(module.name)
  // Query for import via a variable
  const importViaVariablePatterns = variablesIncludingModule.map((name) => moduleImportIdentifierPattern(name))

  visitNotIgnoredFiles(tree, rootDir, (file) => {
    const content = tree.read(file, 'utf-8')
    if (!content) return

    const contentAst = ast(content)

    const allPatterns = [...importViaVariablePatterns, directImportPattern].join(', ')
    const moduleNamesInFile: MatchingModule[] = query<ClassDeclaration>(contentAst, allPatterns)
      .map((classDeclaration) => classDeclaration.name?.text)
      .filter((className): className is string => !!className)
      .map((className) => {
        return {
          name: className,
          filePath: file,
        }
      })
    matchingModules.push(...moduleNamesInFile)
  })

  return matchingModules
}
