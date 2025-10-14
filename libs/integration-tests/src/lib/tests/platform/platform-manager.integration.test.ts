import { PlatformManager } from '../../platform/platform-manager'
import { PlatformConfig } from '../../models/platform-config.interface'
import { CONTAINER } from '../../models/container.enum'

xdescribe('PlatformManager - Integration Test', () => {
  let platformManager: PlatformManager

  beforeEach(() => {
    platformManager = new PlatformManager()
  })

  afterEach(async () => {
    // Clean up any started containers
    try {
      await platformManager.stopAllContainers()
    } catch (error) {
      // Ignore cleanup errors in tests
    }
  }, 30000)

  xdescribe('startContainers - Real Integration', () => {
    it('should start containers with default configuration', async () => {
      const config: PlatformConfig = {
        enableLogging: false, // Disable logging to reduce test noise
      }

      // This will actually start the containers
      await platformManager.startContainers(config)

      // Verify containers are running
      expect(platformManager.hasContainer(CONTAINER.POSTGRES)).toBe(true)
      expect(platformManager.hasContainer(CONTAINER.KEYCLOAK)).toBe(true)

      // Check that we can get specific containers
      const postgres = platformManager.getContainer(CONTAINER.POSTGRES)
      const keycloak = platformManager.getContainer(CONTAINER.KEYCLOAK)

      expect(postgres).toBeDefined()
      expect(keycloak).toBeDefined()
    }, 180000) // 3 minute timeout for actual container startup

    it('should start containers with deault platform and custom containers', async () => {
      const config: PlatformConfig = {
        enableLogging: true,
        startDefaultSetup: true,
        container: {
          service: {
            image: 'ghcr.io/onecx/onecx-help-svc:main-native', // Use a simple image for testing
            networkAlias: 'onecx-help-svc',
            svcDetails: {
              databaseUsername: 'help_svc',
              databasePassword: 'help_svc',
            },
          },
          bff: {
            image: 'ghcr.io/onecx/onecx-help-bff:main-native',
            networkAlias: 'onecx-help-bff',
            bffDetails: {
              permissionsProductName: 'help-bff',
            },
          },
          ui: {
            image: 'ghcr.io/onecx/onecx-help-ui:main',
            networkAlias: 'onecx-help-ui',
            uiDetails: {
              appBaseHref: 'help-ui',
              appId: 'help-ui',
              productName: 'help-ui',
            },
          },
        },
      }

      await platformManager.startContainers(config)

      // Should not have default containers
      expect(platformManager.hasContainer(CONTAINER.POSTGRES)).toBe(true)
      expect(platformManager.hasContainer(CONTAINER.KEYCLOAK)).toBe(true)

      // Should have custom container
      expect(platformManager.hasContainer('onecx-help-svc')).toBe(true)
    }, 280000)

    it('should handle complex configuration with multiple custom containers of one kind', async () => {
      const config: PlatformConfig = {
        enableLogging: ['test-svc-1', '!test-svc-2'],
        container: {
          service: [
            {
              image: 'ghcr.io/onecx/onecx-help-svc:main-native',
              networkAlias: 'onecx-help-svc',
              svcDetails: {
                databaseUsername: 'help_svc',
                databasePassword: 'help_svc',
              },
            },
            {
              image: 'ghcr.io/onecx/onecx-bookmark-svc:main-native',
              networkAlias: 'onecx-bookmark-svc',
              svcDetails: {
                databaseUsername: 'bookmark_svc',
                databasePassword: 'bookmark_svc',
              },
            },
          ],
        },
      }

      await platformManager.startContainers(config)

      // Verify default containers
      expect(platformManager.hasContainer(CONTAINER.POSTGRES)).toBe(true)
      expect(platformManager.hasContainer(CONTAINER.KEYCLOAK)).toBe(true)

      // Verify custom containers
      expect(platformManager.hasContainer('onecx-help-svc')).toBe(true)
      expect(platformManager.hasContainer('onecx-bookmark-svc')).toBe(true)

      // Get all containers
      const allContainers = platformManager.getAllContainers()
      expect(allContainers.size).toBeGreaterThanOrEqual(4) // At least postgres, keycloak, and 2 custom
    }, 210000)
  })
})
