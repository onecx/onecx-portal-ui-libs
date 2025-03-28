import { Tree } from '@nx/devkit'
import { findPatternInFiles } from './shared/utils/find-pattern-in-files'
import { MatchPattern } from './shared/interfaces/match-pattern'

export default async function warnForEventsTopicNavigated(tree: Tree) {
  const pattern: MatchPattern = {
    warning:
      '⚠️ You might be using EventsTopic to detect navigations. Please switch to using CurrentLocationTopic or appStateService.currentLocation$.',
    pattern: /filter\(\s*\(e\)\s*=>\s*e\.type\s*===\s*['"]navigated['"]\s*\)/,
  }

  const rootDir = tree.root

  const results = findPatternInFiles(rootDir, pattern)

  if (results.length > 0) {
    console.warn(pattern.warning)
    console.warn(`Found in:`)
    results.forEach((result) => {
      console.warn(`  - ${result}`)
    })
  }
}
