import { InjectionToken } from "@angular/core";
import { KeycloakAuthModuleConfig } from './keycloak-auth.module'

export const KEYCLOAK_AUTH_CONFIG: InjectionToken<KeycloakAuthModuleConfig> = new InjectionToken('KEYCLOAK_AUTH_CONFIG')
