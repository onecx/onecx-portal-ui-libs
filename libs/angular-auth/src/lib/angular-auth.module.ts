import { APP_INITIALIZER, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { TokenInterceptor } from './token.interceptor'
import { AuthService } from './auth.service'
import { AuthServiceWrapper } from './auth-service-wrapper'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import { AuthProxyService } from './auth-proxy.service'
import { KeycloakService } from 'keycloak-angular'
import { DisabledAuthService } from './auth_services/disabled-auth.service'


function appInitializer(configService: ConfigurationService, authService: AuthService) {
  return async () => {
    await configService.isInitialized
    await authService.init()
  }
}

function provideAuthServices() {
  return [AuthServiceWrapper, KeycloakAuthService, KeycloakService, DisabledAuthService]
}

export function provideAuthService() {
  return [
    provideAuthServices(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [ConfigurationService, AuthServiceWrapper],
      multi: true,
    },
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
