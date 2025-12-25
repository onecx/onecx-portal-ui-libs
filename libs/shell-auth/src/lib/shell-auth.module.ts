import { CommonModule } from '@angular/common'
import { NgModule, inject, provideAppInitializer } from '@angular/core'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { AuthServiceWrapper } from './auth-service-wrapper'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import { DisabledAuthService } from './auth_services/disabled-auth.service'

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

@NgModule({
  imports: [CommonModule],
  providers: [
    provideAuthServices(), // Only needed as fallback if shell uses lib version without new auth mechanism
  ],
})
export class ShellAuthModule {}
