import { StartedNetwork } from 'testcontainers'
import { PlatformConfig } from '../model/platform-config.interface'
import { CustomSvcContainerInterface } from '../model/svc.interface'
import { CustomBffContainerInterface } from '../model/bff.interface'
import { CustomUiContainerInterface } from '../model/ui.interface'
import { StartedSvcContainer } from '../containers/abstract/onecx-svc'
import { StartedBffContainer } from '../containers/abstract/onecx-bff'
import { StartedUiContainer } from '../containers/abstract/onecx-ui'
import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { AllowedContainerTypes } from '../model/allowed-container.types'
import { loggingEnabled } from '../utils/logging-enable'
import { ImageResolver } from './image-resolver'
import { CustomSvcContainer } from '../containers/svc/custom-svc'
import { CustomBffContainer } from '../containers/bff/custom-bff'
import { CustomUiContainer } from '../containers/ui/custom-ui'
import { Logger } from '../utils/logger'

const logger = new Logger('ContainerFactory')

/**
 * Factory class for creating different types of containers based on configuration
 */
export class ContainerFactory {
  constructor(
    private network: StartedNetwork,
    private imageResolver: ImageResolver,
    private config: PlatformConfig,
    private postgres?: StartedOnecxPostgresContainer,
    private keycloak?: StartedOnecxKeycloakContainer
  ) {
    // Platform config will be set globally by PlatformManager
  }

  /**
   * Create containers based on the platform configuration
   * @param config Platform configuration containing container definitions
   * @returns Map of created and started containers
   */
  async createContainers(config: PlatformConfig): Promise<Map<string, AllowedContainerTypes>> {
    const customContainers = new Map<string, AllowedContainerTypes>()

    if (!config.container) {
      return customContainers
    }

    logger.info('CONTAINER_STARTED', 'Creating custom containers')

    // Create service containers (single or multiple)
    if (config.container.service) {
      const serviceConfigs = Array.isArray(config.container.service)
        ? config.container.service
        : [config.container.service]

      for (const serviceConfig of serviceConfigs) {
        logger.info('CONTAINER_STARTED', `Creating service container: ${serviceConfig.networkAlias}`)
        const svcContainer = await this.createSvcContainer(
          serviceConfig,
          loggingEnabled(this.config, [serviceConfig.networkAlias])
        )
        customContainers.set(serviceConfig.networkAlias, svcContainer)
        logger.success('CONTAINER_STARTED', `Service container created: ${serviceConfig.networkAlias}`)
      }
    }

    // Create BFF containers (single or multiple)
    if (config.container.bff) {
      const bffConfigs = Array.isArray(config.container.bff) ? config.container.bff : [config.container.bff]

      for (const bffConfig of bffConfigs) {
        logger.info('CONTAINER_STARTED', `Creating BFF container: ${bffConfig.networkAlias}`)
        const bffContainer = await this.createBffContainer(
          bffConfig,
          loggingEnabled(this.config, [bffConfig.networkAlias])
        )
        customContainers.set(bffConfig.networkAlias, bffContainer)
        logger.success('CONTAINER_STARTED', `BFF container created: ${bffConfig.networkAlias}`)
      }
    }

    // Create UI containers (single or multiple)
    if (config.container.ui) {
      const uiConfigs = Array.isArray(config.container.ui) ? config.container.ui : [config.container.ui]

      for (const uiConfig of uiConfigs) {
        logger.info('CONTAINER_STARTED', `Creating UI container: ${uiConfig.networkAlias}`)
        const uiContainer = await this.createUiContainer(uiConfig, loggingEnabled(this.config, [uiConfig.networkAlias]))
        customContainers.set(uiConfig.networkAlias, uiContainer)
        logger.success('CONTAINER_STARTED', `UI container created: ${uiConfig.networkAlias}`)
      }
    }

    return customContainers
  }

  /**
   * Create a service container from the configuration
   */
  private async createSvcContainer(
    svcConfig: CustomSvcContainerInterface,
    enableLogging: boolean
  ): Promise<StartedSvcContainer> {
    if (!this.postgres || !this.keycloak) {
      throw new Error('Postgres and Keycloak containers are required for service containers')
    }

    // Resolve the image through the ImageResolver
    const resolvedImage = await this.imageResolver.getCustomImage(svcConfig.image)

    const customSvcContainer = new CustomSvcContainer(resolvedImage, this.postgres, this.keycloak).withNetworkAliases(
      svcConfig.networkAlias
    )
    if (svcConfig.environments) {
      customSvcContainer.withEnvironment(svcConfig.environments)
    }
    if (svcConfig.svcDetails.databaseUsername && svcConfig.svcDetails.databasePassword) {
      customSvcContainer
        .withDatabaseUsername(svcConfig.svcDetails.databaseUsername)
        .withDatabasePassword(svcConfig.svcDetails.databasePassword)
    }
    if (svcConfig.healthCheck) {
      customSvcContainer.withHealthCheck(svcConfig.healthCheck)
    }

    return await customSvcContainer.enableLogging(enableLogging).withNetwork(this.network).start()
  }

  /**
   * Create a BFF container from the configuration
   */
  private async createBffContainer(
    bffConfig: CustomBffContainerInterface,
    enableLogging: boolean
  ): Promise<StartedBffContainer> {
    if (!this.keycloak) {
      throw new Error('Keycloak container is required for BFF containers but was not provided.')
    }

    // Resolve the image through the ImageResolver
    const resolvedImage = await this.imageResolver.getCustomImage(bffConfig.image)

    const customBffContainer = new CustomBffContainer(resolvedImage, this.keycloak).withNetworkAliases(
      bffConfig.networkAlias
    )
    if (bffConfig.bffDetails.permissionsProductName) {
      customBffContainer.withPermissionsProductName(bffConfig.bffDetails.permissionsProductName)
    }
    if (bffConfig.healthCheck) {
      customBffContainer.withHealthCheck(bffConfig.healthCheck)
    }
    if (bffConfig.environments) {
      customBffContainer.withEnvironment(bffConfig.environments)
    }

    return await customBffContainer.enableLogging(enableLogging).withNetwork(this.network).start()
  }

  /**
   * Create a UI container from the configuration
   */
  private async createUiContainer(
    uiConfig: CustomUiContainerInterface,
    enableLogging: boolean
  ): Promise<StartedUiContainer> {
    // Resolve the image through the ImageResolver
    const resolvedImage = await this.imageResolver.getCustomImage(uiConfig.image)

    const customUiContainer = new CustomUiContainer(resolvedImage).withNetworkAliases(uiConfig.networkAlias)

    if (uiConfig.uiDetails.appBaseHref) {
      customUiContainer.withAppBaseHref(uiConfig.uiDetails.appBaseHref)
    }

    if (uiConfig.uiDetails.appId) {
      customUiContainer.withAppId(uiConfig.uiDetails.appId)
    }

    if (uiConfig.uiDetails.productName) {
      customUiContainer.withProductName(uiConfig.uiDetails.productName)
    }

    return await customUiContainer.enableLogging(enableLogging).withNetwork(this.network).start()
  }
}
