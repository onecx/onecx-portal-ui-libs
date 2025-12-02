declare global {
  interface Window {
    onecxTriggerElement: EventTarget | null;
  }
}

export function getOnecxTriggerElement() {
  return window.onecxTriggerElement;
}
