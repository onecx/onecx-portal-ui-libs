import { ConfigurationService } from '@onecx/angular-integration-interface'

export interface AuthService {
  init(): Promise<boolean>

  getHeaderValues(): Record<string, string>

  logout(): void
}

export type AuthServiceFactory = (params: { configService: ConfigurationService }) => AuthService
