import { Tree } from '@nx/devkit'
import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { ArrayLiteralExpression, ObjectLiteralExpression, ScriptKind } from 'typescript'
import { addImportIfDoesNotExist } from '../../../utils/modification/add-import-if-does-not-exist.utils'

interface ProviderModificationOptions {
  /**
   * The name of the class to validate within the file.
   */
  className?: string

  /**
   * Optional array of imports to add if they do not exist.
   * This can be used to ensure that necessary imports are present in the file.
   */
  importsToAdd?: Array<{ specifier: string; path: string }>
}

/**
 * Adds a provider to a module or component.
 * If the providers array exists, it appends the provider; otherwise, it creates a new providers array.
 *
 * @param tree - The Nx virtual file system tree.
 * @param filePath - The path to the file containing the module or component.
 * @param provider - The provider to add (as a string representation).
 * @param options - Optional parameters for targeting a specific class.
 */
export function addProviderToModuleOrComponent(
  tree: Tree,
  filePath: string,
  provider: string,
  options?: ProviderModificationOptions
): void {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  const moduleOrComponentConfig = `ClassDeclaration${options?.className ? `:has(Identifier[name=${options.className}])` : ''} > Decorator CallExpression:has(Identifier[name="NgModule"], Identifier[name="Component"]) > ObjectLiteralExpression`

  let updatedContent = replace(
    fileContent,
    moduleOrComponentConfig,
    (node) => {
      const objectNode = node as ObjectLiteralExpression
      const providersArray = query(node, 'PropertyAssignment[name.name="providers"] ArrayLiteralExpression')
      if (providersArray.length === 0) {
        // If no providers array exists, create one
        return `${objectNode.getText().slice(0, -1)}, providers: [${provider}] }`
      }

      const providersText = (providersArray[0] as ArrayLiteralExpression).elements.map((element) => element.getText())
      const newProvidersArray = `[${[...providersText, provider].join(', ')}]`
      return objectNode.getText().replace(providersArray[0].getText(), newProvidersArray)
    },
    ScriptKind.TS
  )

  for (const importToAdd of options?.importsToAdd || []) {
    updatedContent = addImportIfDoesNotExist(tree, updatedContent, importToAdd.specifier, importToAdd.path)
  }

  if (updatedContent && updatedContent !== fileContent) {
    tree.write(filePath, updatedContent)
    return
  }
}
