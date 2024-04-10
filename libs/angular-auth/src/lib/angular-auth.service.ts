export interface AngularAuthService {
  logout(): void

  init(): Promise<boolean>

  auth_header_values(): string[]

  additional_header_values(): string[]

  hasRole(_role: string): boolean

  getUserRoles(): string[]
}
