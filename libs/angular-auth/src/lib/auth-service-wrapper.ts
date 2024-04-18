import { filter } from 'rxjs/internal/operators/filter'
import { AuthService, AuthServiceFactory } from './auth.service'
import { EventsTopic } from '@onecx/integration-interface'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Injectable, Injector } from '@angular/core'
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

    this.initializeAuthService()
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
    let customUrl

    switch (serviceTypeConfig) {
      case 'keycloak':
        customUrl = 'http://keycloak-app/'
        const factory = (await import(customUrl)).default as AuthServiceFactory
        this.authService = factory({ configService: this.configService })
        //this.authService = this.injector.get(KeycloakAuthService)
        break
      // TODO: Extend the other cases in the future
      default:
        throw new Error('Configured AuthService not found')
    }
  }
}
