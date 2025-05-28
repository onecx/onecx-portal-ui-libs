import { Tree } from '@nx/devkit'
import { parse } from 'node-html-parser'
import { hasHtmlTag } from '../validation/has-html-tag.utils'

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
