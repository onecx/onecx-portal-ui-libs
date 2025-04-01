import { Tree } from '@nx/devkit'
import { findPatternInFiles } from '../utils/find-pattern-in-files'
import printWarnings from '../utils/print-warnings'

export default async function warnForEventsPublisherNavigated(tree: Tree) {
  const warning =
    '⚠️ You might be using EventsPublisher to publish navigation events. Please switch to using CurrentLocationPublisher.'
  const pattern = /\.publish\(\s*{\s*type\s*:\s*['"]navigated['"]/

  const rootDir = tree.root

  const results = findPatternInFiles(tree, rootDir, pattern)

  printWarnings(warning, results)
}
