export interface KeycloakConfig {
	/**
	 * URL to the Keycloak server, for example: http://keycloak-server/auth
	 */
	url?: string;
	/**
	 * Name of the realm, for example: 'myrealm'
	 */
	realm: string;
	/**
	 * Client identifier, example: 'myapp'
	 */
	clientId: string;
}

export interface KeycloakInitOptions {
  onLoad?: 'check-sso' | 'login-required'
  checkLoginIframe?: boolean
  silentCheckSsoRedirectUri?: string
  idToken?: string
  refreshToken?: string
  token?: string
  timeSkew?: number
}

export interface KeycloakLoginOptions {
  [key: string]: unknown
}

export interface KeycloakLogoutOptions {
  redirectUri?: string
  logoutMethod?: 'GET' | 'POST'
}

export interface KeycloakError {
  error: string
  error_description: string
}

export type KeycloakActionStatus = 'success' | 'cancelled' | 'error'

export interface KeycloakInstance {
  authenticated?: boolean
  token?: string
  idToken?: string
  refreshToken?: string
  onAuthError?: (errorData: KeycloakError) => void
  onAuthLogout?: () => void
  onAuthRefreshSuccess?: () => void
  onAuthRefreshError?: () => void
  onAuthSuccess?: () => void
  onTokenExpired?: () => void
  onActionUpdate?: (status: KeycloakActionStatus) => void
  onReady?: (authenticated?: boolean) => void
  init(initOptions: KeycloakInitOptions): Promise<boolean>
  login(options?: KeycloakLoginOptions): Promise<void>
  logout(options?: KeycloakLogoutOptions): Promise<void>
  updateToken(minValidity?: number): Promise<boolean>
}