import { Tree } from '@nx/devkit'
import { detectVariables, updateNode } from '@onecx/nx-migration-utils'
import {
  addProviderToModuleOrComponent,
  detectModulesAndComponents,
  ImportValidationOptions,
  isImportInImportsArray,
} from '@onecx/nx-migration-utils/angular'
import { CallExpression } from 'typescript'

const TRANSLATE_MODULE_WITH_CREATE_TRANSLATE_LOADER = `CallExpression[expression.expression.name=TranslateModule][expression.name.name=forRoot]:has(PropertyAssignment[name.name="loader"] Identifier[name="createTranslateLoader"])`
const TRANSLATE_LOADER_IMPORT_AFTER_PATH_UPDATE =
  'ImportDeclaration:has(StringLiteral[value="@onecx/angular-utils"]) ImportSpecifier:has(Identifier[name="createTranslateLoader"])'

const translateModuleImport: { name: string; options: ImportValidationOptions } = {
  name: 'TranslateModule',
  options: {
    importSource: '@ngx-translate/core',
    importArrayQueries: [TRANSLATE_MODULE_WITH_CREATE_TRANSLATE_LOADER],
    globalQueries: [TRANSLATE_LOADER_IMPORT_AFTER_PATH_UPDATE],
  },
}

export function updateTranslationsForMfe(tree: Tree, dirPath: string) {
  removeAppStateServiceFromDeps(tree, dirPath)
  addTranslationPathWhereTranslateModuleImported(tree, dirPath)
}

/** * Removes the AppStateService from the dependencies of the TranslateModule with createTranslateLoader.
 * This function detects the TranslateModule with createTranslateLoader in the specified directory path,
 * and updates the loader configuration to remove the AppStateService from the dependencies.
 * @param tree - The tree representing the file system.
 * @param dirPath - The directory path to search for the TranslateModule with createTranslateLoader.
 */
function removeAppStateServiceFromDeps(tree: Tree, dirPath: string) {
  updateNode<CallExpression>(
    tree,
    dirPath,
    TRANSLATE_MODULE_WITH_CREATE_TRANSLATE_LOADER,
    (_, __) => {
      return `
      TranslateModule.forRoot({
        isolate: true,
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
        }
      })`
    },
    TRANSLATE_LOADER_IMPORT_AFTER_PATH_UPDATE
  )
}

/** * Adds the translation path provider to the module or component where the TranslateModule is imported.
 * This function detects all modules and components in the specified directory path,
 * checks if the TranslateModule is imported,
 * and adds the translation path provider to the imports array of the module or component.
 * @param tree - The tree representing the file system.
 * @param dirPath - The directory path to search for modules and components.
 */
function addTranslationPathWhereTranslateModuleImported(tree: Tree, dirPath: string) {
  const TRANSLATION_PATH_PROVIDER = `{
    provide: TRANSLATION_PATH,
    useFactory: (appStateService: AppStateService) =>
      translationPathFactory('assets/i18n/')(appStateService),
    multi: true,
    deps: [AppStateService]
  }`

  // All module and components
  let modulesOrComponents = detectModulesAndComponents(tree, dirPath)

  // Start by finding TranslateModule
  let possibleImports: Array<{ name: string; options?: ImportValidationOptions }> = [translateModuleImport]
  while (modulesOrComponents.length > 0 && possibleImports.length > 0) {
    const uncoveredModulesOrComponents = []

    for (const moduleOrComponent of modulesOrComponents) {
      if (isAnyEntryInImportsArray(tree, possibleImports, moduleOrComponent)) {
        addProviderToModuleOrComponent(tree, moduleOrComponent.filePath, TRANSLATION_PATH_PROVIDER, {
          className: moduleOrComponent.ast.name?.text,
          importsToAdd: [
            {
              specifier: 'TRANSLATION_PATH',
              path: '@onecx/angular-utils',
            },
            {
              specifier: 'AppStateService',
              path: '@onecx/angular-integration-interface',
            },
            {
              specifier: 'translationPathFactory',
              path: '@onecx/angular-utils',
            },
          ],
        })
      } else {
        uncoveredModulesOrComponents.push(moduleOrComponent)
      }
      modulesOrComponents = uncoveredModulesOrComponents
      possibleImports = findNewPossibleImports(tree, dirPath, possibleImports)
    }
  }
}

/**
 * Checks if any of the possible imports is present in the imports array of the module or component.
 * This is used to determine if the translation module is imported in the module or component.
 * @param tree - The tree representing the file system.
 * @param possibleImports - An array of possible imports to check.
 * @param moduleOrComponent - The module or component to check against.
 * @returns {boolean} - Returns true if any of the possible imports is found in the imports array of the module or component, otherwise false.
 */
function isAnyEntryInImportsArray(
  tree: Tree,
  possibleImports: Array<{ name: string; options?: ImportValidationOptions }>,
  moduleOrComponent: { filePath: string; ast: any }
) {
  return possibleImports.some((possibleImport) =>
    isImportInImportsArray(tree, moduleOrComponent.filePath, possibleImport.name, {
      ...possibleImport.options,
      className: moduleOrComponent.ast.name?.text,
    })
  )
}

/** * Finds new possible imports based on the previous possible imports.
 * This function detects variables in the specified directory path that match the names of the previous possible imports.
 * It returns an array of new possible imports with their names and options.
 * @param tree - The tree representing the file system.
 * @param dirPath - The directory path to search for imports.
 * @param previousPossibleImports - An array of previous possible imports to check against.
 * @returns {Array<{ name: string; options?: ImportValidationOptions }>} - An array of new possible imports with their names and options.
 */
function findNewPossibleImports(
  tree: Tree,
  dirPath: string,
  previousPossibleImports: Array<{ name: string; options?: ImportValidationOptions }>
): Array<{ name: string; options?: ImportValidationOptions }> {
  return previousPossibleImports.flatMap((possibleImport) => {
    let variables = []
    if (possibleImport.name === 'TranslateModule') {
      variables = findImportsForTranslateModule(tree, dirPath)
    } else {
      variables = findImportsForVariable(tree, dirPath, possibleImport.name)
    }

    return variables.map((variable) => {
      return {
        name: variable.variableDeclaration.name.getText(),
      }
    })
  })
}

/** * Finds imports for the TranslateModule with the createTranslateLoader function.
 * This function detects variables in the specified directory path that match the TranslateModule with createTranslateLoader.
 * It returns an array of detected variables that represent the imports for the TranslateModule.
 * @param tree - The tree representing the file system.
 * @param dirPath - The directory path to search for imports.
 * @return {Array<{ variableDeclaration: any }>} - An array of detected variables that represent the imports for the TranslateModule.
 */
function findImportsForTranslateModule(tree: Tree, dirPath: string) {
  return detectVariables(
    tree,
    dirPath,
    `VariableDeclaration:has(${TRANSLATE_MODULE_WITH_CREATE_TRANSLATE_LOADER})`,
    TRANSLATE_LOADER_IMPORT_AFTER_PATH_UPDATE
  )
}

/** * Finds imports for a specific variable in the specified directory path.
 * This function detects variables in the specified directory path that match the given variable name.
 * It returns an array of detected variables that represent the imports for the specified variable.
 * @param tree - The tree representing the file system.
 * @param dirPath - The directory path to search for imports.
 * @param variableName - The name of the variable to search for.
 * @return {Array<{ variableDeclaration: any }>} - An array of detected variables that represent the imports for the specified variable.
 */
function findImportsForVariable(tree: Tree, dirPath: string, variableName: string) {
  return detectVariables(tree, dirPath, `VariableDeclaration:has(Identifier[name="${variableName}"])`)
}
