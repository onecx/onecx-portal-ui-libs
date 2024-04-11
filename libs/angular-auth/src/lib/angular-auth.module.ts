import { APP_INITIALIZER, NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AUTH_SERVICE, ConfigurationService } from '@onecx/angular-integration-interface'
import { TokenInterceptor } from './token.interceptor'
import { AngularAuthService } from './angular-auth.service'
import { AngularAuthServiceWrapper } from './angular-auth-service-wrapper'

export interface AngularAuthModuleConfig {
  // TODO: adapt the config entry which should be adapted
  tokenInterceptorWhitelist?: string[]
}

function appInitializer(configService: ConfigurationService, authService: AngularAuthService) {
  return async () => {
    await configService.isInitialized
    await authService.init()
  }
}
// the config entry determines which AUTH_SERVICE I want to use
enum configs {
  AUTH_SERVICE = 'custom',
  AUTH_SERVICE_CUSTOM_URL = 'https:/..../module.js',
}
@NgModule({
  imports: [CommonModule],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AngularAuthServiceWrapper,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: APP_INITIALIZER, useFactory: appInitializer, deps: [ConfigurationService, AUTH_SERVICE], multi: true },
  ],
})
export class AngularAuthModule {}
