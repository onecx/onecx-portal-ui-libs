declare global {
  interface Window {
    onecxAuth?: {
      authServiceProxy?: {
        v1?: {
          getHeaderValues: () => Record<string, string>
          updateTokenIfNeeded: () => Promise<boolean>
        }
      }
    }
    // Shell defines these properties to support older library versions
    onecxAngularAuth?: {
      authServiceProxy?: {
        v1?: {
          getHeaderValues: () => Record<string, string>
          updateTokenIfNeeded: () => Promise<boolean>
        }
      }
    }
  }
}

export default globalThis
