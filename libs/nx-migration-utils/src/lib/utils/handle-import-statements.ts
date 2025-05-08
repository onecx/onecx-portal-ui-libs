import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { replace } from '@phenomnomnominal/tsquery'

export function removeImportStatement(tree: Tree, directoryPath: string, moduleName: string) {
  const importModuleQuery = `ImportDeclaration:has(StringLiteral[value="${moduleName}"]), VariableStatement:has(CallExpression:has(Identifier[name=require]):has(StringLiteral[value="${moduleName}"]))`

  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (filePath.endsWith('.ts')) {
      updateFileContent(tree, filePath, importModuleQuery, '')
    }
  })
}

export function replaceImportModuleName(tree: Tree, directoryPath: string, moduleName: string, newName: string) {
  const importModuleQuery = `ImportDeclaration > StringLiteral[value="${moduleName}"], VariableStatement CallExpression:has(Identifier[name=require]) > StringLiteral[value="${moduleName}"]`

  visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
    if (filePath.endsWith('.ts')) {
      const fileContent = tree.read(filePath, 'utf-8')
      if (fileContent) {
        const updatedContent = replace(fileContent, importModuleQuery, () => `'${newName}'`)
        tree.write(filePath, updatedContent)
      }
    }
  })
}

export function replaceImportValues(
  tree: Tree,
  directoryPath: string,
  moduleName: string,
  oldImportValues: string[],
  newImportValue: string
) {
  //   const importModuleQuery = `ImportDeclaration > StringLiteral[value="${moduleName}"] ImportSpecifier:has(Identifier[name="${oldImportValue}"])`
  //   const importModuleAsQuery = `NamespaceImport:has(Identifier[name="${oldImportValue}"])`
  const importModuleQueries: string[] = []
  oldImportValues.forEach((oiv) => {
    importModuleQueries.push(
      `ImportDeclaration:has(StringLiteral[value="${moduleName}"]) ImportSpecifier:has(Identifier[name="${oiv}"])`
    )
    importModuleQueries.push(
      `ImportDeclaration:has(StringLiteral[value="${moduleName}"]) NamespaceImport:has(Identifier[name="${oiv}"])`
    )
  })
  const stringImportModuleQueries = importModuleQueries.join(', ')
  console.log('STRING IMPORT VALUES ', stringImportModuleQueries)

  //   const importModuleQueries = [importModuleQuery, importModuleAsQuery].join(', ')

  const isFilePath = /\.[^.]*$/g.test(directoryPath)

  if (isFilePath) {
    const fileContent = tree.read(directoryPath, 'utf-8')
    if (fileContent) {
      console.log('REPLACE FILE', fileContent)
      const updatedContent = replace(fileContent, stringImportModuleQueries, () => newImportValue)
      tree.write(directoryPath, updatedContent)
    }
  } else {
    visitNotIgnoredFiles(tree, directoryPath, (filePath) => {
      if (filePath.endsWith('.ts')) {
        const fileContent = tree.read(filePath, 'utf-8')
        if (fileContent) {
          console.log('REPLACE DIRECTORY', fileContent)
          const updatedContent = replace(fileContent, stringImportModuleQueries, () => newImportValue)
          tree.write(filePath, updatedContent)
        }
      }
    })
  }
}

function updateFileContent(tree: Tree, filePath: string, query: string, replacement: string) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (fileContent) {
    const updatedContent = replace(fileContent, query, () => replacement)
    tree.write(filePath, updatedContent)
  }
}
