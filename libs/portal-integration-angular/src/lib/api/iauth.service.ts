import { BehaviorSubject } from 'rxjs'
import { UserProfile } from '../model/user-profile.model'

export interface IAuthService {
  /**
   * Get current user profile
   */
  getCurrentUser(): UserProfile | null

  /**
   * Current user as observable.
   */
  currentUser$: BehaviorSubject<UserProfile | undefined>

  logout(): void
  /**
   * Checks, whether user has the permission that is passed as param.
   * @param permissionKey permission key to check in form of RESOURCE#ACTION
   */
  hasPermission(permissionKey: string): boolean

  /**
   * Unique name of this auth provider: e.g. mockAuthProvider, KeycloakProvider..
   */
  getAuthProviderName(): string
  /**
   * Checks, whether the current user has to role assigned. If role[] is passed, then the method returns true, if uses has ANY of the roles.
   * @param role role or roles to check
   */
  hasRole(role: string | string[]): boolean
  /**
   * Initialization method of the Auth service. Once resolved, all user data MUST be available.
   */
  init(): Promise<boolean>

  getUserRoles(): string[]
}
