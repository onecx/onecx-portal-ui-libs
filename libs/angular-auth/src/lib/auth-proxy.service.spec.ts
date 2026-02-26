import { TestBed } from '@angular/core/testing'
import { AuthProxyService } from './auth-proxy.service'

describe('AuthProxyService', () => {
  let service: AuthProxyService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthProxyService],
    })
    service = TestBed.inject(AuthProxyService)
  })

  afterEach(() => {
    delete window.onecxAuth
  })

  describe('getHeaderValues', () => {
    it('should return header values from window.onecxAuth proxy', () => {
      const headers = { Authorization: 'Bearer token', 'apm-principal-token': 'id-token' }
      window.onecxAuth = {
        authServiceProxy: {
          v1: {
            getHeaderValues: () => headers,
            updateTokenIfNeeded: () => Promise.resolve(true),
          },
        },
      }

      expect(service.getHeaderValues()).toEqual(headers)
    })

    it('should return empty object when onecxAuth is undefined', () => {
      delete window.onecxAuth

      expect(service.getHeaderValues()).toEqual({})
    })

    it('should return empty object when authServiceProxy is undefined', () => {
      window.onecxAuth = {}

      expect(service.getHeaderValues()).toEqual({})
    })

    it('should return empty object when v1 is undefined', () => {
      window.onecxAuth = { authServiceProxy: {} }

      expect(service.getHeaderValues()).toEqual({})
    })
  })

  describe('updateTokenIfNeeded', () => {
    it('should delegate to the proxy and resolve with true', async () => {
      window.onecxAuth = {
        authServiceProxy: {
          v1: {
            getHeaderValues: () => ({}),
            updateTokenIfNeeded: () => Promise.resolve(true),
          },
        },
      }

      await expect(service.updateTokenIfNeeded()).resolves.toBe(true)
    })

    it('should reject when onecxAuth is undefined', async () => {
      delete window.onecxAuth

      await expect(service.updateTokenIfNeeded()).rejects.toThrow(new Error('No authServiceWrapper provided. Please update to the latest shell version to use the new auth mechanism.'))
    })

    it('should reject when authServiceProxy is undefined', async () => {
      window.onecxAuth = {}

      await expect(service.updateTokenIfNeeded()).rejects.toThrow(new Error('No authServiceWrapper provided. Please update to the latest shell version to use the new auth mechanism.'))
    })

    it('should reject when v1 is undefined', async () => {
      window.onecxAuth = { authServiceProxy: {} }

      await expect(service.updateTokenIfNeeded()).rejects.toThrow(new Error('No authServiceWrapper provided. Please update to the latest shell version to use the new auth mechanism.'))
    })
  })
})
