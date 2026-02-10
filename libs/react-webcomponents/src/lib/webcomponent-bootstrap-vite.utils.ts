import r2wc from '@r2wc/react-to-web-component'

/**
 * Wraps a React component as a custom element for Vite-based builds and
 * initializes portal-related dataset flags on connection.
 */
function createViteAppWebComponent(component: React.ComponentType, elementName: string) {
  const AppWebComponent = r2wc(component, {
    props: {},
  })

  const originalConnectedCallback = AppWebComponent.prototype.connectedCallback

  AppWebComponent.prototype.connectedCallback = function () {
    this.dataset.mfeElement = ''
    this.dataset.noPortalLayoutStyles = ''
    originalConnectedCallback.call(this)
  }

  customElements.define(elementName, AppWebComponent)
}

export { createViteAppWebComponent }
