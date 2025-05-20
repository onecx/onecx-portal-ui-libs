import { Tree } from '@nx/devkit'
import { parse } from 'node-html-parser'
import { isFilePath } from './typescript-files.utils'

/**
 * Modifies all occurrences of a specific tag name in an HTML string.
 * @param html - The HTML content as a string.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 * @returns The modified HTML string.
 */
export function replaceTagInHtml(tree: Tree, html: string, oldTagName: string, newTagName: string): string {
  try {
    if (!hasHtmlTag(tree, html, oldTagName)) return html

    const root = parse(html)
    const elements = root.querySelectorAll(oldTagName)

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
 * Checks if a specific tag exists in HTML content or an HTML file using Nx Tree.
 * Automatically detects if the input is a HTML file path.
 * @param tree - The Nx Tree (virtual file system).
 * @param input - HTML string or file path.
 * @param tagName - The tag name to search for.
 * @returns True if the tag is found, false otherwise.
 */
export function hasHtmlTag(tree: Tree, input: string, tagName: string): boolean {
  try {
    const isHtmlFile = isFilePath(input) && input.endsWith('.html')
    const html = isHtmlFile ? tree.read(input, 'utf-8') : input

    if (!html) {
      return false
    }

    const root = parse(html)
    
    return root.querySelectorAll(tagName).length > 0
  } catch (error) {
    console.error(`Error checking for tag "${tagName}": `, error)
    return false
  }
}
