import { filter } from 'rxjs/internal/operators/filter'
import { AuthService } from './angular-auth.service'
import { EventsTopic } from '@onecx/integration-interface'
import { AppStateService, CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Injectable, Injector } from '@angular/core'
@Injectable()
export class AuthServiceWrapper {
  private eventsTopic$ = new EventsTopic()
  private authService: AuthService | undefined

  constructor(
    private configService: ConfigurationService,
    private injector: Injector,
    private appStateService: AppStateService
  ) {
    this.eventsTopic$
      .pipe(filter((e) => e.type === 'authentication#logoutButtonClicked'))
      .subscribe(() => this.authService?.logout())
  }
  async init(): Promise<boolean | undefined> {
    await this.configService.isInitialized
    const serviceTypeConfig = this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE) ?? 'keycloak'
    let initResult = this.getInitResult(serviceTypeConfig)
    return initResult
  }
  async getInitResult(serviceTypeConfig: string): Promise<boolean | undefined> {
    let initResult
    switch (serviceTypeConfig) {
      case 'keycloak':
        initResult = await this.authService?.init()
        break
      // TODO: Extend the other cases in the future
      default:
        break
    }
    if (initResult) {
      this.appStateService.isAuthenticated$.publish()
    }
    return initResult
  }
  getHeaderValues(): Record<string, string> {
    return this.authService?.getHeaderValues() ?? {}
  }
}
