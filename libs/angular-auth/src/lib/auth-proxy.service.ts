import { Injectable, inject } from '@angular/core'
import './declarations'
import { AuthServiceWrapper } from './auth-service-wrapper'
import { createLogger } from './utils/logger.utils'

@Injectable()
export class AuthProxyService {
  private readonly logger = createLogger('AuthProxyService')
  authServiceWrapper?: AuthServiceWrapper | null

  getHeaderValues(): Record<string, string> {
    return (
      window.onecxAngularAuth?.authServiceProxy?.v1?.getHeaderValues() ??
      this.authServiceWrapper?.getHeaderValues() ??
      {}
    )
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    if (!window.onecxAngularAuth?.authServiceProxy?.v1?.updateTokenIfNeeded) {
      this.logger.info('AuthProxyService uses injected fallback.')
      this.authServiceWrapper = inject(AuthServiceWrapper, { optional: true })
      await this.authServiceWrapper?.init()
    }
    return (
      window.onecxAngularAuth?.authServiceProxy?.v1?.updateTokenIfNeeded() ??
      this.authServiceWrapper?.updateTokenIfNeeded() ??
      Promise.reject('No authServiceWrapper provided.')
    )
  }
}
