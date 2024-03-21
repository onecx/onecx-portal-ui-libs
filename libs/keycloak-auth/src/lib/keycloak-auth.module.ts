import { NgModule, ModuleWithProviders, APP_INITIALIZER } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AUTH_SERVICE, ConfigurationService } from '@onecx/portal-integration-angular'
import { KeycloakAuthService } from './keycloak-auth.service'
import { KeycloakAngularModule } from 'keycloak-angular'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { TokenInterceptor } from './token.interceptor'
import { KEYCLOAK_AUTH_CONFIG } from './keycloak-injection-token'

export interface KeycloakAuthModuleConfig {
  tokenInterceptorWhitelist?: string[]
}

function appInitializer(configService: ConfigurationService, authService: KeycloakAuthService) {
  return async () => {
    await configService.isInitialized
    await authService.init()
  }
} 

/**
 * Authentication module for keycloak. Requires @onecx/portal-integration-angular and keycloak-js to work.
 */
@NgModule({
  imports: [CommonModule, KeycloakAngularModule],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: KeycloakAuthService,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  ],
})
export class KeycloakAuthModule {
  static withConfig(config: KeycloakAuthModuleConfig): ModuleWithProviders<KeycloakAuthModule> {
    return {
      ngModule: KeycloakAuthModule,
      providers: [
        {
          provide: AUTH_SERVICE,
          useClass: KeycloakAuthService,
        },
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
        { provide: KEYCLOAK_AUTH_CONFIG, useValue: config },
        { provide: APP_INITIALIZER, useFactory: appInitializer },
      ],
    }
  }
}
