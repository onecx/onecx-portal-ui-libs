declare global {
  interface Window {
    onecxTriggerElement: EventTarget | null
  }
}

/**
 * Returns the global trigger element used for dynamic scoping.
 *
 * @returns Trigger element or null if not set.
 */
export function getOnecxTriggerElement() {
  return window.onecxTriggerElement
}
