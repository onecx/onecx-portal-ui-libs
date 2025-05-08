import { Provider } from '../model/provider-info.model'

// Provider patterns

/**
 * Creates a pattern to look for Angular provider import declaration
 * @param provider - provider to look for
 * @returns {string} ast query pattern
 */
export function providerImportPattern(provider: Provider): string {
  return `ImportDeclaration:has(StringLiteral[value=${provider.importPath}]):has(ImportSpecifier:has(Identifier[name=${provider.name}]))`
}

// Module patterns

/**
 * Creates a pattern to look for an identifier in the imports list of the Angular module
 * @param identifierName
 * @returns {string} ast query pattern
 */
export function moduleImportIdentifierPattern(identifierName: string): string {
  return `ClassDeclaration:has(Decorator > CallExpression:has(Identifier[name=NgModule])  PropertyAssignment:has(Identifier[name=imports]) Identifier[name=${identifierName}])`
}

/**
 * Creates a pattern to look for an identifier in the providers list of the Angular module
 * @param moduleName
 * @param identifierName
 * @returns {string} ast query pattern
 */
export function moduleProviderIdentifierPattern(moduleName: string, identifierName: string): string {
  return `ClassDeclaration:has(Identifier[name=${moduleName}]):has(Decorator > CallExpression:has(Identifier[name=NgModule]) PropertyAssignment:has(Identifier[name=providers]) Identifier[name=${identifierName}])`
}

/**
 * Creates a pattern to look for the providers list of the Angular module
 * @param moduleName
 * @returns {string} ast query pattern
 */
export function moduleProvidersArrayPattern(moduleName: string): string {
  return `ClassDeclaration:has(Identifier[name=${moduleName}]) Decorator > CallExpression:has(Identifier[name=NgModule]) PropertyAssignment:has(Identifier[name=providers]) > ArrayLiteralExpression`
}
