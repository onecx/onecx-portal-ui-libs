export interface AngularAuthService {
  init(): Promise<boolean>

  getHeaderValues(): Record<string, string>

  logout(): void
}
