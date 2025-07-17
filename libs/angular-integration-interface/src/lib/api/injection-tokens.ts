import { InjectionToken } from '@angular/core'

export interface LibConfig {
  appId: string
  portalId: string
  /**
   * If true, the tkit-module will not try to load remote env values from server(GET /assets/env.json)
   */
  skipRemoteConfigLoad: boolean
  /**
   * URL from which the remote config will be loaded, default: '/assets/env.json'
   */
  remoteConfigURL: string
}
export const APP_CONFIG = new InjectionToken<LibConfig>('APP_CONFIG')

export const SANITY_CHECK = new InjectionToken<string>('OCXSANITY_CHECK')

export const APPLICATION_NAME = new InjectionToken<string>('APPLICATION_NAME')
