declare global {
  interface Window {
    '@onecx/angular-utils': {
      guards?: {
        debug?: boolean
      }
    }
  }
}

window['@onecx/angular-utils'] ??= {}
window['@onecx/angular-utils'].guards ??= {}

export default globalThis
