declare global {
    interface Window {
      onecxAngularAuth?: {
        authServiceProxy?: {
            v1?: {
                getHeaderValues: () => Record<string, string>,
                updateTokenIfNeeded: () => Promise<boolean>
            }
        }
      }
    }
}

export default globalThis