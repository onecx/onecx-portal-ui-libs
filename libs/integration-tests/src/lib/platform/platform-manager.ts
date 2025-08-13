import { Network, StartedNetwork } from 'testcontainers'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { CONTAINER } from '../model/container.enum'
import { PlatformConfig } from '../model/platform-config.interface'
import { DEFAULT_PLATFORM_CONFIG } from '../config/platform-config'
import { ImageResolver } from './image-resolver'
import { HealthChecker, HealthCheckResult } from './health-checker'
import { ContainerStarter } from './container-starter'
import { ContainerFactory } from './container-factory'
import { DataImporter } from './data-importer'
import type { AllowedContainerTypes } from '../model/allowed-container.types'
import { Logger } from '../utils/logger'

const logger = new Logger('PlatformManager')

export class PlatformManager {
  /**
   * Unified map for all containers (default and custom)
   */
  private containers: Map<string, AllowedContainerTypes> = new Map()

  /**
   * Needed classes for startService
   */
  private network?: StartedNetwork
  private imageResolver?: ImageResolver
  private containerStarter?: ContainerStarter
  private containerFactory?: ContainerFactory
  private dataImporter?: DataImporter

  private healthChecker: HealthChecker = new HealthChecker()

  // switch to decide if the defaultPlatform should start or not
  private startDefaultPlatform = true

  /**
   * Orchestrates the startup of the default services and the creation of custom containers.
   * @param config
   */
  async startContainers(config: PlatformConfig = DEFAULT_PLATFORM_CONFIG) {
    logger.info('PLATFORM_MANAGER_INIT')
    this.imageResolver = new ImageResolver()
    this.dataImporter = new DataImporter(this.imageResolver)

    logger.info('NETWORK_CREATE')
    this.network = await new Network().start()
    logger.success('NETWORK_CREATED')

    this.containerStarter = new ContainerStarter(this.imageResolver, this.network, this.addContainer.bind(this), config)

    if (config.startDefaultSetup) {
      this.startDefaultPlatform = config.startDefaultSetup.valueOf()
    }

    if (this.startDefaultPlatform) {
      logger.info('PLATFORM_START')
      // Always start core services first
      const postgres = await this.containerStarter.startCoreServices()
      const keycloak = this.containers.get(CONTAINER.KEYCLOAK) as StartedOnecxKeycloakContainer

      await this.containerStarter.startBackendServices(config, postgres, keycloak, this.getContainer.bind(this))

      // Start BFF services based on configuration
      await this.containerStarter.startBffServices(config, keycloak)

      // Start UI services based on configuration
      await this.containerStarter.startUiServices(config, keycloak, this.getContainer.bind(this))
      // Create custom containers if defined in configuration
      if (config.container) {
        // Initialize container factory with core services
        this.containerFactory = new ContainerFactory(this.network, this.imageResolver, postgres, keycloak)
        await this.createCustomContainers(config)
      }
    }

    // Import data if configured
    if (config.importData && this.network && this.dataImporter) {
      logger.info('DATA_IMPORT_START')
      this.dataImporter.createContainerInfo(this.containers)
      await this.dataImporter.importDefaultData(this.network, this.containers, config)
      logger.success('DATA_IMPORT_SUCCESS')
    }

    logger.success('PLATFORM_READY')
  }

  /**
   * Create custom containers using the ContainerFactory
   */
  private async createCustomContainers(config: PlatformConfig): Promise<void> {
    if (!this.containerFactory) {
      throw new Error('ContainerFactory not initialized. Core services must be started first.')
    }

    try {
      const customContainers = await this.containerFactory.createContainers(config)

      // Store custom containers in unified map
      for (const [key, container] of customContainers) {
        this.containers.set(key, container)
        logger.success('CONTAINER_STARTED', key)
      }
    } catch (error) {
      logger.error('CONTAINER_FAILED', undefined, error)
      throw error
    }
  }

  /**
   * Check the health of all running containers
   */
  async checkAllHealthy(): Promise<HealthCheckResult[]> {
    return await this.healthChecker.checkAllHealthy(this.containers)
  }

  /**
   * Add container to the Map
   */
  private addContainer<T extends AllowedContainerTypes>(key: string | CONTAINER, container: T): void {
    this.containers.set(key, container)
  }

  /**
   * Get all containers (standard and custom)
   */
  getAllContainers(): Map<string, AllowedContainerTypes> {
    return new Map(this.containers)
  }

  /**
   * Get a container by key (works for both standard and custom)
   */
  getContainer<T extends AllowedContainerTypes>(key: string | CONTAINER): T | undefined {
    return this.containers.get(key) as T | undefined
  }

  /**
   * Check if a container exists
   */
  hasContainer(key: string | CONTAINER): boolean {
    return this.containers.has(key)
  }

  /**
   * Remove a container
   */
  removeContainer(key: string | CONTAINER): boolean {
    this.stopContainer(key)
    return this.containers.delete(key)
  }

  /**
   * Stop a container
   * @param key
   */
  async stopContainer(key: string | CONTAINER) {
    const container = this.getContainer(key)
    const containerKey = typeof key === 'string' ? key : String(key)
    logger.info('CONTAINER_STOPPING', containerKey)
    try {
      await container?.stop()
      logger.success('CONTAINER_STOPPED', containerKey)
    } catch (error) {
      logger.error('CONTAINER_FAILED', containerKey, error)
      throw error
    }
  }

  /**
   * Stop all running services and cleanup resources
   */
  async stopAllContainers() {
    logger.info('PLATFORM_STOP')
    // Stop standard containers
    // Since all services depend on Postgres and Keycloak, it's best to stop these last.
    // The same applies to the Shell, as the UI depends on the BFF.
    // Since the startup order is important, the containers can be stopped in the reverse order.
    const standardContainers = this.getAllContainers()
    const containers = Array.from(standardContainers.values()).reverse()

    for (const container of containers) {
      try {
        await container.stop()
      } catch (error) {
        logger.error('CONTAINER_FAILED', container.constructor.name, error)
        // Don't throw here, continue stopping other containers
      }
    }

    // Cleanup network
    if (this.network) {
      try {
        logger.info('NETWORK_DESTROY')
        await this.network.stop()
        logger.success('NETWORK_DESTROYED')
        this.network = undefined
      } catch (error) {
        logger.error('NETWORK_DESTROY', 'Network cleanup failed', error)
        // Don't throw here, network might already be destroyed
        this.network = undefined
      }
    }

    logger.success('PLATFORM_SHUTDOWN')

    this.containers.clear()
  }
}
