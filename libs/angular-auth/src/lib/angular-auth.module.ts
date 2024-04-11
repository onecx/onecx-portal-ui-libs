import { APP_INITIALIZER, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AUTH_SERVICE, ConfigurationService } from '@onecx/angular-integration-interface'
import { TokenInterceptor } from './token.interceptor'
import { AuthService } from './angular-auth.service'
import { AuthServiceWrapper } from './angular-auth-service-wrapper'

function appInitializer(configService: ConfigurationService, authService: AuthService) {
  return async () => {
    await configService.isInitialized
    await authService.init()
  }
}

@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthServiceWrapper,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [ConfigurationService, AUTH_SERVICE], multi: true },
  ],
})
export class AngularAuthModule {}
