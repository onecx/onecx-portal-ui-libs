import {
  PlatformManager,
  CONTAINER,
  StartedOnecxKeycloakContainer,
  StartedOnecxPostgresContainer,
  StartedSvcContainer,
  AllowedContainerTypes,
} from '../../../index'

describe('Type-Safe Container Access Examples', () => {
  let platform: PlatformManager

  beforeEach(() => {
    platform = new PlatformManager()
  })

  afterEach(async () => {
    await platform.stopAllServices()
  })

  describe('Core Container Type Safety', () => {
    it('should provide type-safe access to PostgreSQL container', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
      }

      await platform.startServices(config)

      // Type-safe access
      const postgres = platform.getContainer<StartedOnecxPostgresContainer>(CONTAINER.POSTGRES)

      expect(postgres).toBeDefined()

      if (postgres) {
        // PostgreSQL-specific methods are now available
        const port = postgres.getMappedPort(postgres.getPort())
        expect(typeof port).toBe('number')
        expect(port).toBeGreaterThan(0)

        // Test database operations
        const dbExists = await postgres.doesDatabaseExist('test_db')
        expect(typeof dbExists).toBe('void')

        // Create a test database
        await postgres.createDatabase('integration_test_db')

        // Verify it exists
        const newDbExists = await postgres.doesDatabaseExist('integration_test_db')
        expect(newDbExists).toBe(true)
      }
    }, 120_000)

    it('should provide type-safe access to Keycloak container', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
      }

      await platform.startServices(config)

      // Type-safe access
      const keycloak = platform.getContainer<StartedOnecxKeycloakContainer>(CONTAINER.KEYCLOAK)

      expect(keycloak).toBeDefined()

      if (keycloak) {
        // Keycloak-specific methods are now available
        const realm = keycloak.getRealm()
        expect(realm).toBe('onecx')

        const port = keycloak.getMappedPort(keycloak.getPort())
        expect(typeof port).toBe('number')
        expect(port).toBeGreaterThan(0)

        // Build Keycloak URL
        const keycloakUrl = `http://localhost:${port}`
        expect(keycloakUrl).toMatch(/^http:\/\/localhost:\d+$/)
      }
    }, 120_000)
  })

  describe('Service Container Type Safety', () => {
    it('should provide type-safe access to service containers', async () => {
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

      // Generic service container access
      const workspace = platform.getContainer<StartedSvcContainer>(CONTAINER.WORKSPACE_SVC)

      expect(workspace).toBeDefined()

      if (workspace) {
        // Common service methods
        const port = workspace.getMappedPort(workspace.getPort())
        expect(typeof port).toBe('number')
        expect(port).toBeGreaterThan(0)

        // Build service URL
        const serviceUrl = `http://localhost:${port}`
        expect(serviceUrl).toMatch(/^http:\/\/localhost:\d+$/)

        // Test health endpoint construction
        const healthUrl = `${serviceUrl}/q/health`
        expect(healthUrl).toContain('/q/health')
      }
    }, 180_000)
  })

  describe('Container Access Patterns', () => {
    it('should demonstrate different access patterns', async () => {
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

      // Pattern 1: Generic access (less type-safe)
      const genericPostgres = platform.getContainer(CONTAINER.POSTGRES)
      expect(genericPostgres).toBeDefined()

      // Pattern 2: Type-safe access with explicit typing
      const typedPostgres = platform.getContainer<StartedOnecxPostgresContainer>(CONTAINER.POSTGRES)
      const typedKeycloak = platform.getContainer<StartedOnecxKeycloakContainer>(CONTAINER.KEYCLOAK)
      const typedWorkspace = platform.getContainer<StartedSvcContainer>(CONTAINER.WORKSPACE_SVC)

      // Pattern 3: Safe access with null checks
      if (typedPostgres && typedKeycloak && typedWorkspace) {
        // All containers are guaranteed to be defined here
        const postgresPort = typedPostgres.getMappedPort(typedPostgres.getPort())
        const keycloakRealm = typedKeycloak.getRealm()
        const workspacePort = typedWorkspace.getMappedPort(typedWorkspace.getPort())

        expect(postgresPort).toBeGreaterThan(0)
        expect(keycloakRealm).toBe('onecx')
        expect(workspacePort).toBeGreaterThan(0)
      }

      // Pattern 4: Utility function for safe access
      const getTypedContainer = <T extends AllowedContainerTypes>(container: CONTAINER) => {
        return platform.getContainer<T>(container)
      }

      const safePostgres = getTypedContainer<StartedOnecxPostgresContainer>(CONTAINER.POSTGRES)
      expect(safePostgres).toBeDefined()
    }, 180_000)

    it('should handle missing containers gracefully', async () => {
      const config = {
        core: {
          postgres: true,
          keycloak: true,
        },
        // No services enabled
      }

      await platform.startServices(config)

      // Accessing non-existent containers should return undefined
      const missingWorkspace = platform.getContainer<StartedSvcContainer>(CONTAINER.WORKSPACE_SVC)
      const missingTheme = platform.getContainer<StartedSvcContainer>(CONTAINER.THEME_SVC)

      expect(missingWorkspace).toBeUndefined()
      expect(missingTheme).toBeUndefined()

      // Existing containers should work
      const existingPostgres = platform.getContainer<StartedOnecxPostgresContainer>(CONTAINER.POSTGRES)
      expect(existingPostgres).toBeDefined()
    }, 120_000)
  })
})
