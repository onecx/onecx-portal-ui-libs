import { filter } from 'rxjs/internal/operators/filter'
import { AuthService, AuthServiceFactory, Injectables } from './auth.service'
import { EventsTopic } from '@onecx/integration-interface'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Injectable, Injector } from '@angular/core'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import { loadRemoteModule } from '@angular-architects/module-federation'

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
    let factory
    let module
    let customUrl = this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE_CUSTOM_URL)
    switch (serviceTypeConfig) {
      case 'keycloak':
        this.authService = this.injector.get(KeycloakAuthService)
        break
      case 'custom':
        if (!customUrl) {
          throw new Error('URL of the custom auth service is not defined')
        }
        module = await loadRemoteModule({
          type: 'module',
          remoteEntry: customUrl,
          exposedModule: './CustomAuth',
        })
        factory = module.default as AuthServiceFactory
        this.authService = factory((injectable: Injectables) => {
          console.log('injectable', injectable)
          if (injectable === Injectables.KEYCLOAK_AUTH_SERVICE) {
            return this.injector.get(KeycloakAuthService)
          }
          throw new Error('unknown injectable type')
        })
        break
      // TODO: Extend the other cases in the future (e.g. identity server)
      default:
        throw new Error('Configured AuthService not found')
    }
  }
}
