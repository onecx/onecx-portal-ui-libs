import type { GuardResult, MaybePromise } from './guard-types.utils'

/**
 * Log guard-related debug information.
 * @param args - values to log.
 */
export function logGuardsDebug(...args: unknown[]): void {
  if (typeof console !== 'undefined' && console.debug) {
    console.debug('Guards:', ...args)
  }
}

/**
 * Execute router sync guard logic (always true).
 * @returns true.
 */
export function executeRouterSyncGuard(): boolean {
  logGuardsDebug('Was RouterSync, returning true.')
  return true
}

/**
 * Combine guard results into a boolean.
 * @param results - guard results to combine.
 * @returns false if any guard is false, otherwise true.
 */
export function combineToBoolean(results: GuardResult[]): boolean {
  if (results.some((result) => result === false)) {
    return false
  }

  return true
}

/**
 * Normalize sync or async value into a Promise.
 * @param maybePromise - sync or async value.
 * @returns Promise that resolves to the value.
 */
export function resolveToPromise<T>(maybePromise: MaybePromise<T>): Promise<T> {
  return maybePromise instanceof Promise ? maybePromise : Promise.resolve(maybePromise)
}
