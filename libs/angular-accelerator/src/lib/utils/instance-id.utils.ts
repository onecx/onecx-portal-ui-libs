import { DestroyRef, inject } from '@angular/core'

const occupiedSlots = new Map<string, Set<number>>()

/**
 * Returns a suffix that makes the static element ids of a component unique per live instance, so that
 * `for`, `aria-labelledby`, `aria-describedby` and `aria-controls` of two instances on one page never
 * point at each other's elements.
 *
 * The first live instance of a scope gets an empty suffix and therefore keeps the legacy ids
 * (e.g. `searchButton`) that consumer e2e tests and harnesses rely on. Every further live instance gets
 * `-1`, `-2`, ... (e.g. `searchButton-1`). A slot is released when its instance is destroyed and then reused.
 *
 * Must be called in an injection context (e.g. a field initializer).
 *
 * @param scope name that groups the instances, usually the component selector
 * @returns `''` for the first live instance, `-<n>` otherwise
 */
export function injectInstanceIdSuffix(scope: string): string {
  let slots = occupiedSlots.get(scope)
  if (!slots) {
    slots = new Set<number>()
    occupiedSlots.set(scope, slots)
  }
  let slot = 0
  while (slots.has(slot)) {
    slot++
  }
  slots.add(slot)
  const scopeSlots = slots
  inject(DestroyRef).onDestroy(() => scopeSlots.delete(slot))
  return slot === 0 ? '' : `-${slot}`
}
