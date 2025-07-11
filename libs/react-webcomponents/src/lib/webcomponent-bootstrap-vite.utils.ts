import { ComponentType } from 'react'
import r2wc from '@r2wc/react-to-web-component'

const createViteAppWebComponent = (app: ComponentType, elementName: string) => {
  const AppWebComponent = r2wc(app, {
    props: {},
  })
  customElements.define(elementName, AppWebComponent)
}

export { createViteAppWebComponent }
