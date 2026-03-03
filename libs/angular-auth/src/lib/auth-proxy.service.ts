import { Injectable } from '@angular/core'
import './declarations'
import { createLogger } from './utils/logger.utils'
import { ensureProperty } from '@onecx/accelerator'

@Injectable()
export class AuthProxyService {
  private readonly logger = createLogger('AuthProxyService')

  getHeaderValues(): Record<string, string> {
    const global = ensureProperty(globalThis, ['onecxAuth', 'authServiceProxy', 'v1', 'getHeaderValues'], () => ({}))
    return global.onecxAuth.authServiceProxy.v1.getHeaderValues()
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    const global = ensureProperty(globalThis, ['onecxAuth', 'authServiceProxy', 'v1', 'updateTokenIfNeeded'], (): Promise<boolean> => Promise.reject(new Error('No authServiceWrapper provided. Please update to the latest shell version to use the new auth mechanism.')))
    return global.onecxAuth.authServiceProxy.v1.updateTokenIfNeeded().catch((error) => {
      this.logger.error('Error updating token:', error)
      throw error
    })
  }
}
