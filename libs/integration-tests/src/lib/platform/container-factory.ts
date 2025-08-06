import { StartedNetwork } from 'testcontainers'
import { PlatformConfig } from '../model/platform-config.interface'
import { SvcContainerInterface } from '../model/svc.interface'
import { BffContainerInterface } from '../model/bff.interface'
import { UiContainerInterface } from '../model/ui.interface'
import { SvcContainer, StartedSvcContainer } from '../containers/abstract/onecx-svc'
import { BffContainer, StartedBffContainer } from '../containers/abstract/onecx-bff'
import { UiContainer, StartedUiContainer } from '../containers/abstract/onecx-ui'
import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { AllowedContainerTypes } from '../model/allowed-container.types'
import { shouldEnableLogging } from '../utils/logging-config.util'
import { ImageResolver } from './image-resolver'

/**
 * Factory class for creating different types of containers based on configuration
 */
export class ContainerFactory {
  constructor(
    private network: StartedNetwork,
    private imageResolver: ImageResolver,
    private postgres?: StartedOnecxPostgresContainer,
    private keycloak?: StartedOnecxKeycloakContainer
  ) {}

  /**
   * Create containers based on the platform configuration
   * @param config Platform configuration containing container definitions
   * @returns Map of created and started containers
   */
  async createContainers(config: PlatformConfig): Promise<Map<string, AllowedContainerTypes>> {
    const containers = new Map<string, AllowedContainerTypes>()

    if (!config.container) {
      return containers
    }

    const enableLogging = shouldEnableLogging(config)

    // Create service containers (single or multiple)
    if (config.container.service) {
      const serviceConfigs = Array.isArray(config.container.service)
        ? config.container.service
        : [config.container.service]

      for (const serviceConfig of serviceConfigs) {
        const svcContainer = await this.createSvcContainer(serviceConfig, enableLogging)
        containers.set(serviceConfig.networkAlias, svcContainer)
      }
    }

    // Create BFF containers (single or multiple)
    if (config.container.bff) {
      const bffConfigs = Array.isArray(config.container.bff) ? config.container.bff : [config.container.bff]

      for (const bffConfig of bffConfigs) {
        const bffContainer = await this.createBffContainer(bffConfig, enableLogging)
        containers.set(bffConfig.networkAlias, bffContainer)
      }
    }

    // Create UI containers (single or multiple)
    if (config.container.ui) {
      const uiConfigs = Array.isArray(config.container.ui) ? config.container.ui : [config.container.ui]

      for (const uiConfig of uiConfigs) {
        const uiContainer = await this.createUiContainer(uiConfig, enableLogging)
        containers.set(uiConfig.networkAlias, uiContainer)
      }
    }

    return containers
  }

  /**
   * Create a service container from the configuration
   */
  private async createSvcContainer(
    svcConfig: SvcContainerInterface,
    enableLogging: boolean
  ): Promise<StartedSvcContainer> {
    if (!this.postgres || !this.keycloak) {
      throw new Error('Postgres and Keycloak containers are required for service containers')
    }

    // Resolve the image through the ImageResolver
    const resolvedImage = await this.imageResolver.getCustomImage(svcConfig.image)

    const factory = this

    // Create a custom service container class that extends SvcContainer
    class CustomSvcContainer extends SvcContainer {
      constructor(
        image: string,
        databaseContainer: StartedOnecxPostgresContainer,
        keycloakContainer: StartedOnecxKeycloakContainer,
        private config: SvcContainerInterface
      ) {
        super(image, { databaseContainer, keycloakContainer })

        // Configure the container based on the provided configuration
        this.withNetworkAliases(config.networkAlias)

        if (config.svcDetails.databaseUsername && config.svcDetails.databasePassword) {
          this.withDatabaseUsername(config.svcDetails.databaseUsername).withDatabasePassword(
            config.svcDetails.databasePassword
          )
        }

        // Apply custom environment variables if provided
        factory.applyEnvironmentVariables(this, config.environments)

        // Enable logging if configured
        this.enableLogging(enableLogging)
      }
    }

    const container = new CustomSvcContainer(resolvedImage, this.postgres, this.keycloak, svcConfig)

    return await container.withNetwork(this.network).start()
  }

  /**
   * Create a BFF container from the configuration
   */
  private async createBffContainer(
    bffConfig: BffContainerInterface,
    enableLogging: boolean
  ): Promise<StartedBffContainer> {
    if (!this.keycloak) {
      throw new Error('Keycloak container is required for BFF containers')
    }

    // Resolve the image through the ImageResolver
    const resolvedImage = await this.imageResolver.getCustomImage(bffConfig.image)

    const factory = this

    // Create a custom BFF container class that extends BffContainer
    class CustomBffContainer extends BffContainer {
      constructor(
        image: string,
        keycloakContainer: StartedOnecxKeycloakContainer,
        private config: BffContainerInterface
      ) {
        super(image, keycloakContainer)

        // Configure the container based on the provided configuration
        this.withNetworkAliases(config.networkAlias)

        if (config.bffDetails.permissionsProductName) {
          this.withPermissionsProductName(config.bffDetails.permissionsProductName)
        }

        // Apply custom environment variables if provided
        factory.applyEnvironmentVariables(this, config.environments)

        // Enable logging if configured
        this.enableLogging(enableLogging)
      }
    }

    const container = new CustomBffContainer(resolvedImage, this.keycloak, bffConfig)

    return await container.withNetwork(this.network).start()
  }

  /**
   * Create a UI container from the configuration
   */
  private async createUiContainer(uiConfig: UiContainerInterface, enableLogging: boolean): Promise<StartedUiContainer> {
    // Resolve the image through the ImageResolver
    const resolvedImage = await this.imageResolver.getCustomImage(uiConfig.image)

    const factory = this

    // Create a custom UI container class that extends UiContainer
    class CustomUiContainer extends UiContainer {
      constructor(
        image: string,
        private config: UiContainerInterface
      ) {
        super(image)

        // Configure the container based on the provided configuration
        this.withNetworkAliases(config.networkAlias)

        if (config.uiDetails.appBaseHref) {
          this.withAppBaseHref(config.uiDetails.appBaseHref)
        }

        if (config.uiDetails.appId) {
          this.withAppId(config.uiDetails.appId)
        }

        if (config.uiDetails.productName) {
          this.withProductName(config.uiDetails.productName)
        }

        factory.applyEnvironmentVariables(this, config.environments)

        // Enable logging if configured
        this.enableLogging(enableLogging)
      }
    }

    const container = new CustomUiContainer(resolvedImage, uiConfig)

    return await container.withNetwork(this.network).start()
  }

  /**
   * Apply environment variables to a container
   */
  private applyEnvironmentVariables(
    target: { withEnvironment: (env: Record<string, string>) => void },
    environments?: string[]
  ): void {
    if (environments && environments.length > 0) {
      const environmentVariables: Record<string, string> = {}
      environments.forEach((env) => {
        const [key, value] = env.split('=')
        if (key && value) {
          environmentVariables[key] = value
        }
      })
      target.withEnvironment(environmentVariables)
    }
  }
}
