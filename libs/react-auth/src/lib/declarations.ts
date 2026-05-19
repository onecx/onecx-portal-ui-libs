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
  }
}

export default globalThis
