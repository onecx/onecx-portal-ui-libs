/**
 * Creates new import statement with given import specifiers.
 * @param fileContent - the content of the file to modify
 * @param importPath - import path to create
 * @param importSpecifiers - import specifiers to add, e.g. "myFunctionName"
 * @returns {string} new file content after modification
 */
export function addNewImport(fileContent: string, importPath: string, importSpecifiers: string[]) {
  return `import {${importSpecifiers.join(',')}} from "${importPath}";\n${fileContent}`
}
