import { filter } from 'rxjs/internal/operators/filter'
import { AuthService, AuthServiceFactory } from './auth.service'
import { EventsTopic } from '@onecx/integration-interface'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Injectable, Injector } from '@angular/core'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
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
    let factory
    switch (serviceTypeConfig) {
      case 'keycloak':
        this.authService = this.injector.get(KeycloakAuthService)
        break

      case 'custom':
        //customUrl = 'http://my-auth-provider-app/xyz.mjs'
        // wenn customUrl leer ist, dann exception schmeißen
        customUrl = 'http://172.24.65.220:9000/libs/my-custom-auth/src/index.js'
        factory = (await import(customUrl)).default as AuthServiceFactory
        this.authService = factory({ configService: this.configService })
        break
      // TODO: Extend the other cases in the future (e.g. identity server)
      default:
        throw new Error('Configured AuthService not found')
    }
  }
}
