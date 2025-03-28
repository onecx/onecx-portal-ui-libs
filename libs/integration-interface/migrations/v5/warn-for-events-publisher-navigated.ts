import { Tree } from '@nx/devkit'
import { findPatternInFiles } from './shared/utils/find-pattern-in-files'
import { MatchPattern } from './shared/interfaces/match-pattern'

export default async function warnForEventsPublisherNavigated(tree: Tree) {
  const pattern: MatchPattern = {
    warning:
      '⚠️ You might be using EventsPublisher to publish navigation events. Please switch to using CurrentLocationPublisher.',
    pattern: /\.publish\(\s*{\s*type\s*:\s*['"]navigated['"]/,
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
