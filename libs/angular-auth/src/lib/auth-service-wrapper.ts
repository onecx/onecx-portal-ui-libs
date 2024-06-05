import { filter } from 'rxjs/internal/operators/filter'
import { AuthService, AuthServiceFactory, Injectables } from './auth.service'
import { EventsTopic } from '@onecx/integration-interface'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Injectable, Injector } from '@angular/core'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import { loadRemoteModule } from '@angular-architects/module-federation'
import { Config } from '@onecx/integration-interface'

@Injectable()
export class AuthServiceWrapper {
  private eventsTopic$ = new EventsTopic()
  private authService: AuthService | undefined

  constructor(
    private configService: ConfigurationService,
    private appStateService: AppStateService,
    private injector: Injector
  ) {
    this.eventsTopic$
      .pipe(filter((e) => e.type === 'authentication#logoutButtonClicked'))
      .subscribe(() => this.authService?.logout())
  }
  async init(): Promise<boolean | undefined> {
    await this.configService.isInitialized

    await this.initializeAuthService()
    const initResult = this.getInitResult()
    return initResult
  }
  async getInitResult(): Promise<boolean | undefined> {
    const initResult = await this.authService?.init()

    if (initResult) {
      await this.appStateService.isAuthenticated$.publish()
    }
    return initResult
  }
  getHeaderValues(): Record<string, string> {
    return this.authService?.getHeaderValues() ?? {}
  }

  async initializeAuthService(): Promise<void> {
    const serviceTypeConfig = this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE) ?? 'keycloak'

    switch (serviceTypeConfig) {
      case 'keycloak':
        this.authService = this.injector.get(KeycloakAuthService)
        break
      case 'custom': {
        const factory = await this.getAuthServiceFactory(this.configService)
        this.authService = factory((injectable: Injectables) => {
          return this.retrieveInjectables(injectable)
        })
        break
      }
      default:
        throw new Error('Configured AuthService not found')
    }
  }

  retrieveInjectables(injectable: Injectables): KeycloakAuthService | Config | undefined {
    if (injectable === Injectables.KEYCLOAK_AUTH_SERVICE) {
      return this.injector.get(KeycloakAuthService)
    } else if (injectable === Injectables.CONFIG) {
      return this.configService.getConfig()
    }
    throw new Error('unknown injectable type')
  }

  async getAuthServiceFactory(configService: ConfigurationService): Promise<AuthServiceFactory> {
    if (!configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_URL)) {
      throw new Error('URL of the custom auth service is not defined')
    }
    const module = await loadRemoteModule({
      type: 'module',
      remoteEntry: this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_URL) ?? '',
      exposedModule: this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_MODULE_NAME) ?? './CustomAuth',
    })
    return module.default as AuthServiceFactory
  }
}
