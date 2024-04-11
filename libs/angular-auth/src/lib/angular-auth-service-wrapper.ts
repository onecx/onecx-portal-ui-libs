import { filter } from 'rxjs/internal/operators/filter'
import { AngularAuthService } from './angular-auth.service'
import { EventsTopic } from '@onecx/integration-interface'
import { CONFIG_KEY, ConfigurationService } from '@onecx/angular-integration-interface'
import { Injector } from '@angular/core'
// rename in AuthServiceWrapper
export class AngularAuthServiceWrapper {
  private eventsTopic$ = new EventsTopic()
  private authService: AngularAuthService | undefined
  // TODO: AngularAuthService --> AuthService
  constructor(private configService: ConfigurationService, private injector: Injector) {
    this.eventsTopic$
      .pipe(filter((e) => e.type === 'authentication#logoutButtonClicked'))
      .subscribe(() => this.authService?.logout())
  }
  async init(): Promise<boolean> {
    await this.configService.isInitialized
    const serviceTypeConfig = this.configService.getProperty(CONFIG_KEY.AUTH_SERVICE) ?? 'keycloak'
    // TODO: injector injecten lassen
    // switch case bauen
    // checks which service should be used
    // initResult await authService.init()
    // if(initResult){  --> TODO: appStateService.isAuthenticated --> publish(true), else nicht publish}
    // return initresult
    throw new Error('Method not implemented.')
  }
  getHeaderValues(): Record<string, string> {
    throw new Error('Method not implemented.')
  }
}
