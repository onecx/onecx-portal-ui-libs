export interface AuthService {
  init(config?: Record<string, unknown>): Promise<boolean>

  getHeaderValues(): Record<string, string>

  logout(): void
}

export type AuthServiceFactory = (injectorFunction: (injectable: string) => unknown) => AuthService
