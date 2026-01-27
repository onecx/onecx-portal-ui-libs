import { Injectable } from '@angular/core'
import './declarations'

@Injectable()
export class AuthProxyService {
  getHeaderValues(): Record<string, string> {
    return window.onecxAuth?.authServiceProxy?.v1?.getHeaderValues() ?? {}
  }

  async updateTokenIfNeeded(): Promise<boolean> {
    if (!window.onecxAuth?.authServiceProxy?.v1?.updateTokenIfNeeded) {
      throw new Error('Please update to the latest shell version to use the new auth mechanism.')
    }
    return (
      window.onecxAuth?.authServiceProxy?.v1?.updateTokenIfNeeded() ??
      Promise.reject('No authServiceWrapper provided.')
    )
  }
}
