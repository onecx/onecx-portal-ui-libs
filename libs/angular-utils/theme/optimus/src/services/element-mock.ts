// Test double for a DOM <style> element.
//
// @openng/optimus-ui helpers (UseStyle.use -> isElement/setAttributes) only act on a real Element,
// so chain this mock onto Element.prototype. That makes isElement() pass and lets UseStyle.use()
// tag the element with data-optimus-style-id, so a second use() reuses it instead of creating a new one.
// isConnected and textContent are read-only on the DOM prototype, so shadow each with an own writable data property.
export class ElementMock {
  attribute = ''
  isConnected!: boolean
  textContent!: string

  constructor() {
    Object.defineProperty(this, 'isConnected', { value: false, writable: true, configurable: true })
    Object.defineProperty(this, 'textContent', { value: '', writable: true, configurable: true })
  }

  setAttribute(attr: string, value: string) {
    this.attribute = `${attr}="${value}"`
  }
}
Object.setPrototypeOf(ElementMock.prototype, Element.prototype)
