import { parse } from 'node-html-parser'

/**
 * Modifies all occurrences of a specific tag name in an HTML string.
 *
 * @param html - The HTML content as a string.
 * @param oldTagName - The tag name to replace.
 * @param newTagName - The new tag name to use.
 * @returns The modified HTML string.
 */
export function replaceTagInHtml(html: string, oldTagName: string, newTagName: string): string {
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
