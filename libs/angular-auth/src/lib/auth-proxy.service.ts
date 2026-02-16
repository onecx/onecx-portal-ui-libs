import { Injectable } from '@angular/core'
import './declarations'
import { createLogger } from './utils/logger.utils'

@Injectable()
export class AuthProxyService {
  private readonly logger = createLogger('AuthProxyService')

  getHeaderValues(): Record<string, string> {
    return window.onecxAuth?.authServiceProxy?.v1?.getHeaderValues() ?? {}
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    if (!window.onecxAuth?.authServiceProxy?.v1?.updateTokenIfNeeded) {
      this.logger.error('Please update to the latest shell version to use the new auth mechanism.')
    }
    return (
      window.onecxAuth?.authServiceProxy?.v1?.updateTokenIfNeeded() ??
      Promise.reject('No authServiceWrapper provided.')
    )
  }
}
