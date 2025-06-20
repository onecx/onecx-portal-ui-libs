import { Tree } from '@nx/devkit'
import { parse } from 'node-html-parser'
import { isFilePath } from '../typescript-files.utils'

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
