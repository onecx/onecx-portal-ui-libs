import { Injector } from '@angular/core'
import { ComponentLogger } from '@onecx/accelerator'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { KeycloakAuthService } from './keycloak-auth.service'
import * as loggerUtils from '../utils/logger.utils'

jest.mock('keycloak-js', () => ({ __esModule: true, default: jest.fn() }))

const KeycloakConstructor = (jest.requireMock('keycloak-js') as { default: jest.Mock }).default

interface KeycloakLike {
  authenticated: boolean
  token: string
  tokenParsed: { exp: number }
  init: jest.Mock
  login: jest.Mock
  updateToken: jest.Mock
  onTokenExpired?: () => void
}

interface Deferred {
  promise: Promise<boolean>
  resolve: (value: boolean) => void
}

const configValues: Record<string, string> = {
  KEYCLOAK_CLIENT_ID: 'client',
  KEYCLOAK_REALM: 'realm',
  KEYCLOAK_URL: 'https://keycloak.example',
}

let service: KeycloakAuthService
let keycloak: KeycloakLike
let loggerError: jest.Mock

const createDeferred = (): Deferred => {
  let resolve: (value: boolean) => void = () => undefined
  const promise = new Promise<boolean>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

const flushMicrotasks = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

const makeLogger = (error: jest.Mock): ComponentLogger =>
  ({ debug: jest.fn(), info: jest.fn(), warn: jest.fn(), error }) as unknown as ComponentLogger

const createService = (tokenExpiredConfig?: string): KeycloakAuthService => {
  const configStub = {
    getProperty: jest.fn(async (key: string) => {
      if (key === 'KEYCLOAK_ON_TOKEN_EXPIRED_ENABLED') {
        return tokenExpiredConfig
      }
      return configValues[key]
    }),
  }
  return Injector.create({
    providers: [KeycloakAuthService, { provide: ConfigurationService, useValue: configStub }],
  }).get(KeycloakAuthService)
}

const installKeycloak = (updateToken: jest.Mock): KeycloakLike => {
  keycloak = {
    authenticated: true,
    token: 'token',
    tokenParsed: { exp: 9_999_999_999 },
    init: jest.fn(async () => true),
    login: jest.fn(),
    updateToken,
  }
  KeycloakConstructor.mockImplementation(() => keycloak)
  return keycloak
}

const setupTestDoubles = (): void => {
  loggerError = jest.fn()
  jest.spyOn(loggerUtils, 'createLogger').mockReturnValue(makeLogger(loggerError))
  service = createService('true')
}

const restoreTestDoubles = (): void => {
  jest.restoreAllMocks()
  KeycloakConstructor.mockClear()
}

const expectFailingPersistenceIsHandled = async (): Promise<void> => {
  const listener = jest.fn()
  const originalStorage = window.localStorage
  const throwingStorage = {
    getItem: () => null,
    setItem: () => {
      throw new Error('storage unavailable')
    },
    removeItem: () => undefined,
  } as unknown as Storage
  Object.defineProperty(window, 'localStorage', { value: throwingStorage, configurable: true })
  process.on('unhandledRejection', listener)
  try {
    installKeycloak(jest.fn())
    await service.init()
    keycloak.onTokenExpired?.()
    await flushMicrotasks()
    expect(listener).not.toHaveBeenCalled()
    expect(loggerError).toHaveBeenCalledWith(
      '[KC event] 2.6 onTokenExpired - handler failed',
      expect.objectContaining({ message: 'storage unavailable' })
    )
  } finally {
    process.removeListener('unhandledRejection', listener)
    Object.defineProperty(window, 'localStorage', { value: originalStorage, configurable: true })
  }
}

describe('KeycloakAuthService', () => {
  beforeEach(setupTestDoubles)
  afterEach(restoreTestDoubles)

  describe('given a proactive refresh started by onTokenExpired is still running', () => {
    it('when updateTokenIfNeeded is called, then it calls updateToken only after the running refresh has finished', async () => {
      const deferred = createDeferred()
      installKeycloak(jest.fn(() => deferred.promise))
      await service.init()
      keycloak.onTokenExpired?.()
      await flushMicrotasks()
      const pending = service.updateTokenIfNeeded()
      await flushMicrotasks()
      expect(keycloak.updateToken).toHaveBeenCalledTimes(1)
      deferred.resolve(true)
      await pending
      expect(keycloak.updateToken).toHaveBeenCalledTimes(2)
    })
  })

  describe('given proactive refresh is enabled and updateToken rejects', () => {
    it('when onTokenExpired fires, then the error is logged and a later updateTokenIfNeeded still works', async () => {
      installKeycloak(jest.fn().mockRejectedValueOnce(new Error('refresh failed')).mockResolvedValueOnce(true))
      await service.init()
      keycloak.onTokenExpired?.()
      await flushMicrotasks()
      expect(loggerError).toHaveBeenCalled()
      expect(keycloak.updateToken).toHaveBeenCalledTimes(1)
      await expect(service.updateTokenIfNeeded()).resolves.toBe(true)
      expect(keycloak.updateToken).toHaveBeenCalledTimes(2)
    })
  })

  describe('given proactive refresh is disabled', () => {
    it('when onTokenExpired fires, then updateToken is not called', async () => {
      installKeycloak(jest.fn())
      service = createService(undefined)
      await service.init()
      keycloak.onTokenExpired?.()
      await flushMicrotasks()
      expect(keycloak.updateToken).not.toHaveBeenCalled()
    })
  })

  describe('given the onTokenExpired handler fails while persisting tokens', () => {
    it('when onTokenExpired fires, then the failure is logged and nothing is left unhandled', async () => {
      await expectFailingPersistenceIsHandled()
    })
  })
})
