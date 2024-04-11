export interface AuthService {
  init(): Promise<boolean>

  getHeaderValues(): Record<string, string>

  logout(): void
}
