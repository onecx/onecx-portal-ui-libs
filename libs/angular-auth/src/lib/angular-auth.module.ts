import { APP_INITIALIZER, NgModule, inject, provideAppInitializer } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { TokenInterceptor } from './token.interceptor'
import { AuthService } from './auth.service'
import { AuthServiceWrapper } from './auth-service-wrapper'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import { AuthProxyService } from './auth-proxy.service'

function provideAuthServices() {
  return [AuthServiceWrapper, KeycloakAuthService]
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

export function provideTokenInterceptor() {
  return [
    AuthProxyService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ]
}

@NgModule({
  imports: [CommonModule],
  providers: [
    provideTokenInterceptor(),
    provideAuthServices(), // Only needed as fallback if shell uses lib version without new auth mechanism
  ],
})
export class AngularAuthModule {}
