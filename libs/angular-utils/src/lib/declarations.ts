declare global {
  interface Window {
    '@onecx/angular-utils': {
      guards?: {
        debug?: boolean
      }
    }
  }
}

export default globalThis
