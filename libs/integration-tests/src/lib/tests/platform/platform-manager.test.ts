import { PlatformManager, MINIMAL_PLATFORM_CONFIG, CONTAINER } from '../../../index'
import { StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'

describe('PlatformManager', () => {
  let platform: PlatformManager

  beforeEach(() => {
    platform = new PlatformManager()
  })

  afterEach(async () => {
    await platform.stopAllServices()
  })

  describe('Basic Functionality', () => {
    it('should start minimal platform successfully', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      const runningServices = platform.getRunningServices()
      expect(runningServices).toContain(CONTAINER.POSTGRES)
      expect(runningServices).toContain(CONTAINER.KEYCLOAK)
      expect(runningServices).toHaveLength(2)
    }, 120_000)

    it('should check if services are running', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      expect(platform.isServiceRunning(CONTAINER.POSTGRES)).toBe(true)
      expect(platform.isServiceRunning(CONTAINER.KEYCLOAK)).toBe(true)
      expect(platform.isServiceRunning(CONTAINER.WORKSPACE_SVC)).toBe(false)
    }, 120_000)

    it('should get container references', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      const postgres = platform.getContainer(CONTAINER.POSTGRES)
      const keycloak = platform.getContainer(CONTAINER.KEYCLOAK)

      expect(postgres).toBeDefined()
      expect(keycloak).toBeDefined()
      expect(platform.getContainer(CONTAINER.WORKSPACE_SVC)).toBeUndefined()
    }, 120_000)
  })

  describe('Version Override', () => {
    it('should use custom PostgreSQL version', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
        imageVersions: {
          core: {
            postgres: 'postgres:14',
          },
        },
      }

      await platform.startServices(config)

      const postgres = platform.getContainer(CONTAINER.POSTGRES)
      expect(postgres).toBeDefined()
    }, 120_000)

    it('should handle service version overrides', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
        services: {
          workspace: true,
        },
        imageVersions: {
          services: {
            workspace: 'main-native', // Explicit version
          },
        },
      }

      await platform.startServices(config)

      expect(platform.isServiceRunning(CONTAINER.WORKSPACE_SVC)).toBe(true)
    }, 180_000)
  })

  describe('Service Dependencies', () => {
    it('should start services with dependencies', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
        services: {
          tenant: true,
          permission: true, // Depends on tenant
        },
      }

      await platform.startServices(config)

      expect(platform.isServiceRunning(CONTAINER.TENANT_SVC)).toBe(true)
      expect(platform.isServiceRunning(CONTAINER.PERMISSION_SVC)).toBe(true)
    }, 180_000)

    it('should fail when dependency is missing', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
        services: {
          permission: true, // Depends on tenant but tenant is not enabled
        },
      }

      await expect(platform.startServices(config)).rejects.toThrow(
        'Permission service requires Tenant service to be started first'
      )
    }, 120_000)
  })

  describe('Health Checks', () => {
    it('should report healthy services', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      // Give services time to fully start
      await new Promise((resolve) => setTimeout(resolve, 5000))

      const healthStatus = await platform.checkAllHealthy()

      expect(healthStatus).toHaveLength(2)
      expect(healthStatus.every((s) => s.healthy)).toBe(true)

      // Verify structure of health check results
      expect(healthStatus[0]).toHaveProperty('name')
      expect(healthStatus[0]).toHaveProperty('healthy')
      expect(typeof healthStatus[0].healthy).toBe('boolean')
    }, 120_000)

    it('should handle health checks with mixed service types', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
        services: {
          workspace: true,
        },
      }

      await platform.startServices(config)

      // Give services time to fully start
      await new Promise((resolve) => setTimeout(resolve, 10000))

      const healthStatus = await platform.checkAllHealthy()

      expect(healthStatus).toHaveLength(3)
      expect(healthStatus.every((s) => s.healthy)).toBe(true)

      // Verify we have the expected services
      const serviceNames = healthStatus.map((s) => s.name)
      expect(serviceNames).toContain(CONTAINER.POSTGRES)
      expect(serviceNames).toContain(CONTAINER.KEYCLOAK)
      expect(serviceNames).toContain(CONTAINER.WORKSPACE_SVC)
    }, 180_000)
  })

  describe('Cleanup', () => {
    it('should stop all services cleanly', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      expect(platform.getRunningServices()).toHaveLength(2)

      await platform.stopAllServices()

      expect(platform.getRunningServices()).toHaveLength(0)
    }, 120_000)

    it('should handle multiple stop calls gracefully', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      // Stop services multiple times
      await platform.stopAllServices()
      await platform.stopAllServices() // Should not throw

      expect(platform.getRunningServices()).toHaveLength(0)
    }, 120_000)
  })

  describe('Error Handling', () => {
    it('should handle invalid configuration gracefully', async () => {
      const invalidConfig = {
        core: {
          postgres: true,
          keycloak: true,
        },
        services: {
          permission: true, // Missing tenant dependency
        },
      }

      await expect(platform.startServices(invalidConfig)).rejects.toThrow(
        'Permission service requires Tenant service to be started first'
      )
    }, 120_000)

    it('should clean up properly after failed startup', async () => {
      const invalidConfig = {
        core: {
          postgres: true,
          keycloak: true,
        },
        services: {
          permission: true, // Missing tenant dependency
        },
      }

      try {
        await platform.startServices(invalidConfig)
      } catch (error) {
        // Expected to fail
      }

      // Ensure cleanup works after failed startup
      await platform.stopAllServices()
      expect(platform.getRunningServices()).toHaveLength(0)
    }, 120_000)

    it('should return empty results for health checks with no services', async () => {
      const healthStatus = await platform.checkAllHealthy()
      expect(healthStatus).toHaveLength(0)
    })
  })

  describe('Container Management', () => {
    it('should return correct container types', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      const postgres = platform.getContainer<StartedOnecxPostgresContainer>(CONTAINER.POSTGRES)
      const keycloak = platform.getContainer<StartedOnecxKeycloakContainer>(CONTAINER.KEYCLOAK)

      expect(postgres).toBeDefined()
      expect(keycloak).toBeDefined()

      // Verify container methods exist
      expect(typeof postgres?.getMappedPort).toBe('function')
      expect(typeof keycloak?.getMappedPort).toBe('function')
      expect(typeof keycloak?.getRealm).toBe('function')

      // Test type-specific methods
      if (postgres && keycloak) {
        const postgresPort = postgres.getMappedPort(5432)
        const keycloakPort = keycloak.getMappedPort(8080)
        const realm = keycloak.getRealm()

        expect(typeof postgresPort).toBe('number')
        expect(typeof keycloakPort).toBe('number')
        expect(typeof realm).toBe('string')
        expect(realm).toBe('onecx') // Default realm
      }
    }, 120_000)

    it('should track service states correctly', async () => {
      expect(platform.getRunningServices()).toHaveLength(0)
      expect(platform.isServiceRunning(CONTAINER.POSTGRES)).toBe(false)

      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      expect(platform.getRunningServices()).toHaveLength(2)
      expect(platform.isServiceRunning(CONTAINER.POSTGRES)).toBe(true)
      expect(platform.isServiceRunning(CONTAINER.KEYCLOAK)).toBe(true)
      expect(platform.isServiceRunning(CONTAINER.WORKSPACE_SVC)).toBe(false)
    }, 120_000)

    it('should provide proper type safety for container access', async () => {
      await platform.startServices(MINIMAL_PLATFORM_CONFIG)

      // Generic access (returns AllowedContainerTypes)
      const genericPostgres = platform.getContainer(CONTAINER.POSTGRES)
      const genericKeycloak = platform.getContainer(CONTAINER.KEYCLOAK)

      expect(genericPostgres).toBeDefined()
      expect(genericKeycloak).toBeDefined()

      // Type-safe access with generics
      const typedPostgres = platform.getContainer<StartedOnecxPostgresContainer>(CONTAINER.POSTGRES)
      const typedKeycloak = platform.getContainer<StartedOnecxKeycloakContainer>(CONTAINER.KEYCLOAK)

      // Now we can safely call type-specific methods
      if (typedPostgres && typedKeycloak) {
        // PostgreSQL specific methods
        const canCreateDb = await typedPostgres.doesDatabaseExist('test_db')
        expect(canCreateDb).toBeUndefined()

        // Keycloak specific methods
        const realm = typedKeycloak.getRealm()
        expect(realm).toBe('onecx')
      }

      // Verify wrong type returns undefined
      const wrongType = platform.getContainer(CONTAINER.WORKSPACE_SVC)
      expect(wrongType).toBeUndefined()
    }, 120_000)
  })
})
