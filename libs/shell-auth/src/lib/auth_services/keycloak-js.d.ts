// keycloak-js ships its type declarations only through a package.json "exports" map, which the spec tsconfig's
// node module resolution cannot read, so the members the auth service uses are declared here for the test program.
declare module 'keycloak-js' {
  export interface KeycloakServerConfig {
    url: string
    clientId?: string
    realm?: string
  }
  export interface KeycloakTokenParsed {
    exp?: number
  }
  export interface KeycloakInitOptions {
    onLoad?: 'login-required' | 'check-sso'
    checkLoginIframe?: boolean
    silentCheckSsoRedirectUri?: string
    idToken?: string
    refreshToken?: string
    token?: string
    timeSkew?: number
  }
  class Keycloak {
    constructor(config: KeycloakServerConfig | string)
    token?: string
    idToken?: string
    refreshToken?: string
    tokenParsed?: KeycloakTokenParsed
    authenticated?: boolean
    init(options?: KeycloakInitOptions): Promise<boolean>
    login(options?: Record<string, unknown>): Promise<void>
    updateToken(minValidity?: number): Promise<boolean>
    logout(): void
    onAuthError(errorData: unknown): void
    onAuthLogout(): void
    onAuthRefreshSuccess(): void
    onAuthRefreshError(): void
    onAuthSuccess(): void
    onTokenExpired(): void
    onActionUpdate(state: unknown): void
    onReady(authenticated: boolean): void
  }
  export default Keycloak
}
