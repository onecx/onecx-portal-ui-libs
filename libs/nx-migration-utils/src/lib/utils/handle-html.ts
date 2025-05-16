import { Tree, visitNotIgnoredFiles } from '@nx/devkit'
import { ast, query, replace } from '@phenomnomnominal/tsquery'
import { readFileSync, writeFileSync } from 'fs'
import { parse } from 'node-html-parser'
import * as path from 'path'
import { isStringLiteral, Node, ScriptKind } from 'typescript'

/**
 * Changes all occurrences of a specific HTML tag name in Angular component templates.
 *
 * @param tree - The Nx Tree representing the file system.
 * @param dirPath - Directory path to search for files.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
export function changeTagName(tree: Tree, dirPath: string, oldTagName: string, newTagName: string) {
  visitNotIgnoredFiles(tree, dirPath, (file) => {
    if (file.endsWith('.ts')) {
      processFile(tree, file, oldTagName, newTagName)
    }
  })
}

/**
 * Modifies all occurrences of a specific tag name in an HTML string.
 *
 * @param html - The HTML content as a string.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 * @returns The modified HTML string.
 */
function modifyTagName(html: string, oldTagName: string, newTagName: string): string {
  try {
    const root = parse(html)
    const elements = root.querySelectorAll(oldTagName)

    if (!elements.length) return html

    elements.forEach((element) => {
      element.tagName = newTagName
    })
    return root.toString()
  } catch (error) {
    console.error('Error modifying tag name in HTML: ', error)
    return html
  }
}

/**
 * Processes inline Angular templates in a TypeScript file and replaces tag names.
 *
 * @param tree - The Nx Tree.
 * @param filePath - Path to the TypeScript file.
 * @param node - AST node representing the inline template.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
function processInlineTemplate(tree: Tree, filePath: string, node: Node, oldTagName: string, newTagName: string) {
  try {
    const nodeText = node.getText()
    const updatedHtml = modifyTagName(nodeText, oldTagName, newTagName)
    const fileContent = tree.read(filePath, 'utf-8')
    const inlineTemplatesQuery = 'PropertyAssignment:has(Identifier[name="template"]) > NoSubstitutionTemplateLiteral'

    if (fileContent) {
      const updatedContent = replace(fileContent, inlineTemplatesQuery, () => updatedHtml, ScriptKind.TS)
      tree.write(filePath, updatedContent)
    }
  } catch (error) {
    console.error(`Error processing inline template in ${filePath}: `, error)
  }
}

/**
 * Processes an external HTML template file and replaces tag names.
 *
 * @param filePath - Path to the HTML file.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
function processExternalTemplate(filePath: string, oldTagName: string, newTagName: string) {
  try {
    const html = readFileSync(filePath, 'utf8')
    const modifiedHtml = modifyTagName(html, oldTagName, newTagName)
    writeFileSync(filePath, modifiedHtml)
  } catch (error) {
    console.error(`Failed to process external template at ${filePath}: `, error)
  }
}

/**
 * Processes a TypeScript file to find and update Angular component templates.
 *
 * @param tree - The Nx Tree.
 * @param filePath - Path to the TypeScript file.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 */
function processFile(tree: Tree, filePath: string, oldTagName: string, newTagName: string) {
  try {
    const tsContent = readFileSync(filePath, 'utf8')
    const contentAst = ast(tsContent)

    const inlineTemplates = query(
      contentAst,
      'PropertyAssignment:has(Identifier[name="template"]) > NoSubstitutionTemplateLiteral'
    )
    inlineTemplates.forEach((node) => processInlineTemplate(tree, filePath, node, oldTagName, newTagName))

    const externalTemplates = query(
      contentAst,
      'PropertyAssignment:has(Identifier[name="templateUrl"]) > StringLiteral'
    )
    externalTemplates.forEach((node) => {
      if (isStringLiteral(node)) {
        const templateUrl = node.text
        const templatePath = path.resolve(path.dirname(filePath), templateUrl)

        processExternalTemplate(templatePath, oldTagName, newTagName)
      }
    })
  } catch (error) {
    console.error(`Error processing file ${filePath}: `, error)
  }
}
