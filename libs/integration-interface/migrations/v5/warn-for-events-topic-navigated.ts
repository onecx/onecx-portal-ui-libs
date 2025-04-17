import { Tree } from '@nx/devkit'
import { detectMethodCallsInFiles, printWarnings } from '@onecx/nx-migration-utils'
import { CallExpression } from 'typescript'
import { ast, query } from '@phenomnomnominal/tsquery'

function argsContainFilterForTypeNavigated(callExpression: CallExpression): boolean {
  const callExpressionAst = ast(callExpression.getText())
  const filterCallsSelector = `CallExpression:has(Identifier[name="filter"]):has(ArrowFunction:has(BinaryExpression:has(PropertyAccessExpression:has(Identifier):has(Identifier[name="type"])):has(StringLiteral[value="navigated"])))`
  const filterCalls = query(callExpressionAst, filterCallsSelector)
  return filterCalls.length > 0
}

export default async function warnForEventsTopicNavigated(tree: Tree) {
  const warningForPotentialMatches =
    '⚠️ EventsTopic usages were detected. Please double-check if EventsTopic is used for subscribing to navigation events and switch to CurrentLocationTopic/appStateService.currentLocation$ if so.'

  const warningForExactMatches =
    '⚠️ You are using EventsTopic to publish navigation events. Please switch to using CurrentLocationTopic/appStateService.currentLocation$.'

  const potentialMatches = detectMethodCallsInFiles(tree, './src', 'pipe', 'EventsTopic')

  const exactMatches = new Map<string, CallExpression[]>()
  const remainingPotentialMatches = new Map<string, CallExpression[]>()

  potentialMatches.forEach((calls, file) => {
    const filteredCalls = calls.filter((call) => argsContainFilterForTypeNavigated(call))
    if (filteredCalls.length > 0) {
      exactMatches.set(file, filteredCalls)
    } else {
      remainingPotentialMatches.set(file, calls)
    }
  })

  if (exactMatches.size > 0) {
    printWarnings(warningForExactMatches, Array.from(exactMatches.keys()))
  }
  if (remainingPotentialMatches.size > 0) {
    printWarnings(warningForPotentialMatches, Array.from(remainingPotentialMatches.keys()))
  }
}
