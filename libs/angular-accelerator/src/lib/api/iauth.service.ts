export interface IAuthService {
  logout(): void

  /**
   * Unique name of this auth provider: e.g. mockAuthProvider, KeycloakProvider..
   */
  getAuthProviderName(): string

  /**
   * Initialization method of the Auth service. Once resolved, all user data MUST be available.
   */
  init(): Promise<boolean>

  getIdToken(): string | null

  hasRole(_role: string): boolean

  getUserRoles(): string[]
}
