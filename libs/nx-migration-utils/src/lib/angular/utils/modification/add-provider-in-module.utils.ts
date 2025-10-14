import { replace } from '@phenomnomnominal/tsquery'
import { ArrayLiteralExpression, ScriptKind } from 'typescript'
import { MatchingModule } from '../../model/matching-module.model'
import { Provider } from '../../model/provider.model'
import { moduleProvidersArrayPattern } from '../patterns.utils'

/**
 * Add the provider to the providers list of the module.
 * @param fileContent - the content of the file the module is used in
 * @param module - the module to modify
 * @param provider - the provider to add
 * @returns {string} modified content of the file with provider included in the module
 */
export function addProviderInModule(fileContent: string, module: MatchingModule, provider: Provider): string {
  const newContent = replace(
    fileContent,
    moduleProvidersArrayPattern(module.name),
    (node) => {
      // Prepare provider call expression
      const providerExpressionString = `${provider.name}()`

      // Prepare new providers array
      const aleNode = node as ArrayLiteralExpression
      const newExpressionArray: string[] = [
        ...aleNode.elements.map((expresion) => expresion.getText()),
        providerExpressionString,
      ]
      // Return text for new providers array
      return `[${newExpressionArray.join(',')}]`
    },
    ScriptKind.TS
  )

  return newContent
}
