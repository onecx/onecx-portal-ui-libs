declare global {
  interface Window {
    onecxTriggerElement: EventTarget | null
  }
}

/**
 * Returns the global trigger element used for dynamic scoping.
 */
export function getOnecxTriggerElement() {
  return window.onecxTriggerElement
}
