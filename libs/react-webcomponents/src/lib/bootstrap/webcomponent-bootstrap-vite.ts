import r2wc from '@r2wc/react-to-web-component'
import type { ComponentType } from 'react'
/**
 * Creates a web component from a React component (Vite build) and sets portal
 * dataset attributes plus optional CSS classes when the element connects.
 *
 * @param component - React component to wrap as a custom element.
 * @param elementName - Custom element tag name, e.g. `my-app`.
 * @param classNames - Additional CSS classes added on element connection.
 */
function createViteAppWebComponent(component: ComponentType, elementName: string, classNames: string[] = []) {
  const AppWebComponent = r2wc(component, {
    props: {},
  })

  const originalConnectedCallback = AppWebComponent.prototype.connectedCallback

  AppWebComponent.prototype.connectedCallback = function () {
    this.dataset.mfeElement = ''
    this.dataset.noPortalLayoutStyles = ''
    if (classNames.length > 0) {
      this.classList.add(...classNames)
    }
    originalConnectedCallback.call(this)
  }

  customElements.define(elementName, AppWebComponent)
}

export { createViteAppWebComponent }
