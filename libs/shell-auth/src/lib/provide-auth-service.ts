import { inject, provideAppInitializer } from '@angular/core'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { AuthServiceWrapper } from './auth-service-wrapper'
import { DisabledAuthService } from './auth_services/disabled-auth.service'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'

function provideAuthServices() {
  return [AuthServiceWrapper, KeycloakAuthService, DisabledAuthService]
}

export function provideAuthService() {
  return [
    provideAuthServices(),
    provideAppInitializer(async () => {
      const configService = inject(ConfigurationService)
      const authServiceWrapper = inject(AuthServiceWrapper)
      await configService.isInitialized
      await authServiceWrapper.init()
    }),
  ]
}