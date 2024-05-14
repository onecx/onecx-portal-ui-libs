import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { AppStateService, ConfigurationService, UserService, InitializeModuleGuard as _InitializeModuleGuard } from '@onecx/angular-integration-interface'
/**
 * @deprecated
 * Please import from @onecx/angular-integration-interface, because in edge cases permission errors occur,
 * when @onecx/angular-integration-interface is not shared and the version from portal-integration-angular is used.
 */

@Injectable({ providedIn: 'any' })
export class InitializeModuleGuard extends _InitializeModuleGuard {
  constructor(
    translateService: TranslateService,
    configService: ConfigurationService,
    appStateService: AppStateService,
    userService: UserService
  ) {
    super(translateService, configService, appStateService, userService)
  }
}
