import { Tree } from '@nx/devkit'
import { findPatternInFiles } from '../utils/find-pattern-in-files'
import printWarnings from '../utils/print-warnings'

export default async function warnForEventsTopicNavigated(tree: Tree) {
  const warning =
    '⚠️ You might be using EventsTopic to detect navigations. Please switch to using CurrentLocationTopic or appStateService.currentLocation$.'
  const pattern = /filter\(\s*\(e\)\s*=>\s*e\.type\s*===\s*['"]navigated['"]\s*\)/
  console.log("WarnForEventsTopicNavigated")
  
  const results = findPatternInFiles(tree, './src', pattern)

  console.log("Results", results)
  printWarnings(warning, results)
}
