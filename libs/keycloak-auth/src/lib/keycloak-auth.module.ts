import { NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { AUTH_SERVICE } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'
import { KeycloakAngularModule } from 'keycloak-angular'
import { TokenInterceptor } from './token.interceptor'
import { KEYCLOAK_AUTH_CONFIG } from './keycloak-injection-token'

export interface KeycloakAuthModuleConfig {
  tokenInterceptorWhitelist?: string[]
}
/**
 * Authentication module for keycloak. Requires @onecx/angular-integration-interfacer and keycloak-js to work.
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
      ],
    }
  }
}
