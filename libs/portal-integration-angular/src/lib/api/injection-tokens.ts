import { InjectionToken } from '@angular/core'
import { MfeInfo } from '../model/mfe-info.model'
import { IAuthService } from './iauth.service'

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

export const AUTH_SERVICE = new InjectionToken<IAuthService>('AUTH_SERVICE')

// export const MFE_NAME = new InjectionToken<string>('OCX_MFE_NAME')

export const MFE_INFO_FN = new InjectionToken<mfeInfoProducer>('OCX_MFE_INFO_FN')

export const MFE_INFO = new InjectionToken<MfeInfo>('OCX_MFE_INFO')

export type mfeInfoProducer = () => MfeInfo
