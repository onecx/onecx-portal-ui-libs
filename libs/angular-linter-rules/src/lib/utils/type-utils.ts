import type ts from 'typescript'

export function isTranslateServiceType(typeChecker: ts.TypeChecker, type: ts.Type): boolean {
  const symbol = type.getSymbol() ?? type.aliasSymbol
  if (!symbol) return false

  const name = symbol.getName()
  if (name !== 'TranslateService') return false

  const declarations = symbol.getDeclarations() ?? []
  return declarations.some((decl) => {
    const sourceFileName = decl.getSourceFile().fileName
    return sourceFileName.includes('/@ngx-translate/core/') || sourceFileName.includes('\\@ngx-translate\\core\\')
  })
}
