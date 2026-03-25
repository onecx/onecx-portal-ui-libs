import './declarations'
import { ensureProperty } from '@onecx/accelerator'
import { createLogger } from './utils/logger.utils'

export const MISSING_PROXY_ERROR =
  'No authServiceWrapper provided. Please update to the latest shell version to use the new auth mechanism.'

type AuthServiceProxyV1 = {
  getHeaderValues: () => Record<string, string>
  updateTokenIfNeeded: () => Promise<boolean>
}

type AuthServiceProxyGlobal = typeof globalThis & {
  onecxAuth: {
    authServiceProxy: {
      v1: AuthServiceProxyV1
    }
  }
}

export class AuthServiceProxy {
  private readonly logger = createLogger('AuthServiceProxy')

  getHeaderValues(): Record<string, string> {
    const global = ensureProperty(
      globalThis,
      ['onecxAuth', 'authServiceProxy', 'v1', 'getHeaderValues'],
      () => ({})
    ) as AuthServiceProxyGlobal
    return global.onecxAuth.authServiceProxy.v1.getHeaderValues()
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    const global = ensureProperty(
      globalThis,
      ['onecxAuth', 'authServiceProxy', 'v1', 'updateTokenIfNeeded'],
      (): Promise<boolean> => Promise.reject(new Error(MISSING_PROXY_ERROR))
    ) as AuthServiceProxyGlobal
    return global.onecxAuth.authServiceProxy.v1.updateTokenIfNeeded().catch((error: unknown) => {
      this.logger.error('Error updating token:', error)
      throw error
    })
  }
}

export const authServiceProxy = new AuthServiceProxy()
