import {
  DEFAULT_PLATFORM_CONFIG,
  MINIMAL_PLATFORM_CONFIG,
  BACKEND_ONLY_CONFIG,
  PlatformManager,
  CONTAINER,
} from '../../../index'

describe('Platform Configurations', () => {
  let platform: PlatformManager

  beforeEach(() => {
    platform = new PlatformManager()
  })

  afterEach(async () => {
    await platform.stopAllServices()
  })

  describe('DEFAULT_PLATFORM_CONFIG', () => {
    it('should enable all services including data import', () => {
      expect(DEFAULT_PLATFORM_CONFIG.core.postgres).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.core.keycloak).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.services?.iamKc).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.services?.workspace).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.services?.userProfile).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.services?.theme).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.services?.tenant).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.services?.productStore).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.services?.permission).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.bff?.shell).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.ui?.shell).toBe(true)
      expect(DEFAULT_PLATFORM_CONFIG.importData).toBe(true)
    })
  })

  describe('MINIMAL_PLATFORM_CONFIG', () => {
    it('should only enable core services', () => {
      expect(MINIMAL_PLATFORM_CONFIG.core.postgres).toBe(true)
      expect(MINIMAL_PLATFORM_CONFIG.core.keycloak).toBe(true)
      expect(MINIMAL_PLATFORM_CONFIG.services).toBeUndefined()
      expect(MINIMAL_PLATFORM_CONFIG.bff).toBeUndefined()
      expect(MINIMAL_PLATFORM_CONFIG.ui).toBeUndefined()
      expect(MINIMAL_PLATFORM_CONFIG.importData).toBe(false)
    })

    it('should start only core services', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      const runningServices = platform.getRunningServices()
      expect(runningServices).toHaveLength(2)
      expect(runningServices).toContain(CONTAINER.POSTGRES)
      expect(runningServices).toContain(CONTAINER.KEYCLOAK)
    }, 120_000)
  })

  describe('BACKEND_ONLY_CONFIG', () => {
    it('should enable all backend services but no UI/BFF', () => {
      expect(BACKEND_ONLY_CONFIG.services?.iamKc).toBe(true)
      expect(BACKEND_ONLY_CONFIG.services?.workspace).toBe(true)
      expect(BACKEND_ONLY_CONFIG.services?.userProfile).toBe(true)
      expect(BACKEND_ONLY_CONFIG.services?.theme).toBe(true)
      expect(BACKEND_ONLY_CONFIG.services?.tenant).toBe(true)
      expect(BACKEND_ONLY_CONFIG.services?.productStore).toBe(true)
      expect(BACKEND_ONLY_CONFIG.services?.permission).toBe(true)
      expect(BACKEND_ONLY_CONFIG.bff).toBeUndefined()
      expect(BACKEND_ONLY_CONFIG.ui).toBeUndefined()
      expect(BACKEND_ONLY_CONFIG.importData).toBe(true)
    })
  })
})
