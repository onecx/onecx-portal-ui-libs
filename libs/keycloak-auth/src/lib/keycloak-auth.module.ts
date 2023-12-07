import { InjectionToken, NgModule, ModuleWithProviders } from '@angular/core'
import { CommonModule } from '@angular/common'
import { AUTH_SERVICE } from '@onecx/portal-integration-angular'
import { KeycloakAuthService } from './keycloak-auth.service'
import { KeycloakAngularModule } from 'keycloak-angular'
import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { TokenInterceptor } from './token.interceptor'
import { IsAuthenticatedTopic } from '@onecx/integration-interface'

export interface KeycloakAuthModuleConfig {
  tokenInterceptorWhitelist?: string[]
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
    IsAuthenticatedTopic,
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

export const KEYCLOAK_AUTH_CONFIG: InjectionToken<KeycloakAuthModuleConfig> = new InjectionToken('KEYCLOAK_AUTH_CONFIG')
