import globalThis from './declarations'

/**
 * Returns the global trigger element used for dynamic scoping.
 *
 * @returns Trigger element or null if not set.
 */
export function getOnecxTriggerElement() {
  return (globalThis as unknown as Window).onecxTriggerElement
}
