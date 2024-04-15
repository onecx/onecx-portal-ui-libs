import { APP_INITIALIZER, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AUTH_SERVICE, ConfigurationService } from '@onecx/angular-integration-interface'
import { TokenInterceptor } from './token.interceptor'
import { AuthService } from './auth.service'
import { AuthServiceWrapper } from './auth-service-wrapper'
import { KeycloakAuthService } from './auth_services/keycloak-auth.service'
import { KeycloakService } from 'keycloak-angular'

function appInitializer(configService: ConfigurationService, authService: AuthService) {
  return async () => {
    await configService.isInitialized
    await authService.init()
  }
}

@NgModule({
  imports: [CommonModule],
  providers: [
    AuthServiceWrapper,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      deps: [ConfigurationService, AuthServiceWrapper],
      multi: true,
    },
    KeycloakAuthService,
    KeycloakService,
  ],
})
export class AngularAuthModule {}
