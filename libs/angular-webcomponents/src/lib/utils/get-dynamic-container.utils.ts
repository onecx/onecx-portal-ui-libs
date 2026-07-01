import { InjectionToken } from '@angular/core'

interface ShellDocument extends Document {
  createOnecxDynamicContainer: (tagName: string, elementName: string) => HTMLElement
}

export interface DynamicContainerProxy {
  getDynamicContainerCallback: () => HTMLElement
  removeDynamicContainer: () => void
}

export const DYNAMIC_CONTAINER_PROXY = new InjectionToken<DynamicContainerProxy>('DYNAMIC_CONTAINER_PROXY')

export function getDynamicContainer(containerTag: string, appElementName: string): HTMLElement {
  const containerElement = document.querySelector<HTMLElement>(containerTag)
  if (containerElement) return containerElement

  return (document as ShellDocument).createOnecxDynamicContainer(containerTag, appElementName)
}

export function removeDynamicContainer(containerTag: string) {
  const containerElement = document.querySelector<HTMLElement>(containerTag)
  if (containerElement) {
    containerElement.remove()
  }
}
