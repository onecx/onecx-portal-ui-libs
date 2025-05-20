import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query } from '@phenomnomnominal/tsquery'
import { dirname, join } from 'path'
import { isStringLiteral, Node } from 'typescript'
import { hasHtmlTag, replaceTagInHtml } from '../utils/html-files.utils'

/**
 * Changes all occurrences of a specific HTML tag name in Angular component templates.
 * @param tree - The Nx Tree representing the file system.
 * @param dirPath - Directory path to search for files.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInAngularTemplates(tree: Tree, dirPath: string, oldTagName: string, newTagName: string) {
  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (file.endsWith('.ts')) {
      replaceTagInInlineAndExternalTemplate(tree, file, oldTagName, newTagName)
    }
  })
}

/**
 * Processes a TypeScript file to find and update Angular component templates.
 * @param tree - The Nx Tree.
 * @param filePath - Path to the TypeScript file.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInInlineAndExternalTemplate(
  tree: Tree,
  filePath: string,
  oldTagName: string,
  newTagName: string
) {
  try {
    const tsContent = tree.read(filePath, 'utf8')

    if (!tsContent) return

    const contentAst = ast(tsContent)

    replaceTagInInlineTemplates(tree, filePath, contentAst, oldTagName, newTagName)
    replaceTagInExternalTemplates(tree, filePath, contentAst, oldTagName, newTagName)
  } catch (error) {
    console.error(`Error processing file ${filePath}: `, error)
  }
}

/**
 * Processes inline Angular templates in a TypeScript file and replaces tag names.
 * @param tree - The Nx Tree.
 * @param filePath - Path to the TypeScript file.
 * @param inlineTemplate - AST node representing the inline template.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInInlineTemplates(
  tree: Tree,
  filePath: string,
  contentAst: Node,
  oldTagName: string,
  newTagName: string
) {
  const fileContent = tree.read(filePath, 'utf-8')
  if (!fileContent) return

  let updatedContent = fileContent
  let modified = false
  const inlineTemplates = getInlineTemplateNodes(contentAst)

  inlineTemplates.forEach((node) => {
    const nodeText = node.getText()
    if (!hasHtmlTag(tree, nodeText, oldTagName)) return

    const updatedHtml = replaceTagInHtml(tree, nodeText, oldTagName, newTagName)

    updatedContent = updatedContent.replace(nodeText, updatedHtml)
    modified = true
  })

  if (modified) {
    tree.write(filePath, updatedContent)
  }
}

/**
 * Processes an external HTML template file and replaces tag names.
 * @param filePath - Path to the HTML file.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function replaceTagInExternalTemplates(
  tree: Tree,
  filePath: string,
  contentAst: Node,
  oldTagName: string,
  newTagName: string
) {
  const externalTemplates = getExternalTemplatePaths(contentAst, filePath)

  externalTemplates.forEach((path) => {
    const html = tree.read(path, 'utf-8')
    if (!html || !hasHtmlTag(tree, path, oldTagName)) return

    const modifiedHtml = replaceTagInHtml(tree, html, oldTagName, newTagName)

    tree.write(path, modifiedHtml)
  })
}

/**
 * Extracts inline template nodes from a TypeScript AST.
 * @param ast - The parsed TypeScript AST.
 * @returns An array of inline template nodes.
 */
export function getInlineTemplateNodes(ast: Node): Node[] {
  return query(ast, 'PropertyAssignment:has(Identifier[name="template"]) > NoSubstitutionTemplateLiteral')
}

/**
 * Extracts resolved external template file paths from a TypeScript AST.
 * @param ast - The parsed TypeScript AST.
 * @param filePath - The path to the TypeScript file.
 * @returns An array of resolved external HTML file paths.
 */
export function getExternalTemplatePaths(ast: Node, filePath: string): string[] {
  const nodes = query(ast, 'PropertyAssignment:has(Identifier[name="templateUrl"]) > StringLiteral')

  return nodes.filter(isStringLiteral).map((node) => join(dirname(filePath), node.text))
}
