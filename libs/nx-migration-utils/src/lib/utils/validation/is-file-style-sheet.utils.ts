export function isStyleSheet(filePath: string) {
  return filePath.endsWith('.css') || filePath.endsWith('.scss')
}
