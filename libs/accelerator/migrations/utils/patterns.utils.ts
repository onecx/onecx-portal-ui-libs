import { ProviderInfo } from '../model/provider-info.model'

// Typescript - general

export function variableContainingIdentifierPattern(identifierName: string) {
  return `VariableDeclaration:has(Identifier[name=${identifierName}])`
}

// Typescript - Imports

export function importNamespacePattern(importPath: string) {
  return `ImportDeclaration:has(StringLiteral[value=${importPath}]):has(NamespaceImport)`
}

export function importPattern(importPath: string) {
  return `ImportDeclaration:has(StringLiteral[value=${importPath}])`
}

export function importNamedImportsPattern(importPath: string) {
  return `${importPattern(importPath)} NamedImports`
}

// Angular - Providers

export function providerImportPattern(providerInfo: ProviderInfo) {
  return `ImportDeclaration:has(StringLiteral[value=${providerInfo.importPath}]):has(ImportSpecifier:has(Identifier[name=${providerInfo.name}]))`
}

// Angular - Modules

export function moduleImportIdentifierPattern(identifierName: string) {
  return `ClassDeclaration:has(Decorator > CallExpression:has(Identifier[name=NgModule])  PropertyAssignment:has(Identifier[name=imports]) Identifier[name=${identifierName}])`
}

export function moduleProviderIdentifierPattern(moduleName: string, identifierName: string) {
  return `ClassDeclaration:has(Identifier[name=${moduleName}]):has(Decorator > CallExpression:has(Identifier[name=NgModule]) PropertyAssignment:has(Identifier[name=providers]) Identifier[name=${identifierName}])`
}

export function moduleProvidersArrayPattern(moduleName: string) {
  return `ClassDeclaration:has(Identifier[name=${moduleName}]) Decorator > CallExpression:has(Identifier[name=NgModule]) PropertyAssignment:has(Identifier[name=providers]) > ArrayLiteralExpression`
}
