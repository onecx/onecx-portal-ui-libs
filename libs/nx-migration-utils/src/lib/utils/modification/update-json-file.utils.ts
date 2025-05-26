import { Tree } from '@nx/devkit'

export function updateJsonFile(tree: Tree, filePath: string, updater: (json: any) => string) {
  if (filePath.endsWith('.json')) {
    const content = tree.read(filePath, 'utf-8')
    if (!content) return

    try {
      const json = JSON.parse(content)
      const updatedJson = updater(json)

      if (JSON.stringify(json) !== JSON.stringify(updatedJson)) {
        tree.write(filePath, JSON.stringify(updatedJson, null, 2))
      }
    } catch (e) {
      console.warn(`Skipping invalid JSON file: ${filePath}`)
    }
  }
}
