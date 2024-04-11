import { InjectionToken } from '@angular/core'
import { AngularAuthModuleConfig } from './angular-auth.module'

export const ANGULAR_AUTH_CONFIG: InjectionToken<AngularAuthModuleConfig> = new InjectionToken('ANGULAR_AUTH_CONFIG')
