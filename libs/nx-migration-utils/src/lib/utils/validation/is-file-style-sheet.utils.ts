/**
 * Determines whether a given file path points to a stylesheet file.
 * Supports `.css` and `.scss` extensions.
 *
 * @param filePath - The file path to check.
 * @returns True if the file is a stylesheet, false otherwise.
 */
export function isStyleSheet(filePath: string) {
  return filePath.endsWith('.css') || filePath.endsWith('.scss')
}
