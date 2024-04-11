export interface AngularAuthService {
  logout(): void

  init(): Promise<boolean>

  getHeaderValues(): Record<string, string>

  hasRole(_role: string): boolean

  getUserRoles(): string[]
}
