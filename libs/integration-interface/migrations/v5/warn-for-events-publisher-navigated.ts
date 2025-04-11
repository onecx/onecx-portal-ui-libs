import { Tree } from '@nx/devkit'
import printWarnings from '../utils/print-warnings'
import { detectMethodCallsInFiles } from '../utils/detect-method-calls-in-files'
import { CallExpression } from 'typescript'

function argsMatchExpectedPayload(callExpression: CallExpression): boolean {
  return callExpression.arguments.some((arg) => {
    const argText = arg.getText()
    return /type:\s*['"]navigated['"]/.test(argText)
  })
}

export default async function warnForEventsPublisherNavigated(tree: Tree) {
  const warningForPotentialMatches =
    '⚠️ EventsPublisher usages were detected. Please double-check if EventsPublisher is used for publishing navigation events and switch to CurrentLocationPublisher if so.'

  const warningForExactMatches =
    '⚠️ You are using EventsPublisher to publish navigation events. Please switch to using CurrentLocationPublisher.'

  const potentialMatches = detectMethodCallsInFiles(tree, './src', 'publish', 'EventsPublisher')

  const exactMatches = new Map<string, CallExpression[]>()
  const remainingPotentialMatches = new Map<string, CallExpression[]>()
  
  potentialMatches.forEach((calls, file) => {
    const filteredCalls = calls.filter((call) => argsMatchExpectedPayload(call))
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
