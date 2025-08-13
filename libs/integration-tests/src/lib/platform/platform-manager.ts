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
  async startServices(config: PlatformConfig = DEFAULT_PLATFORM_CONFIG) {
    this.imageResolver = new ImageResolver()
    this.dataImporter = new DataImporter(this.imageResolver)
    this.network = await new Network().start()
    this.containerStarter = new ContainerStarter(
      this.imageResolver,
      this.network,
      this.addDefaultContainer.bind(this),
      config
    )

    if (config.startDefaultSetup) {
      this.startDefaultPlatform = config.startDefaultSetup.valueOf()
    }

    if (this.startDefaultPlatform) {
      // Always start core services first
      const postgres = await this.containerStarter.startCoreServices()
      const keycloak = this.containers.get(CONTAINER.KEYCLOAK) as StartedOnecxKeycloakContainer

      await this.containerStarter.startBackendServices(config, postgres, keycloak, this.getDefaultContainer.bind(this))

      // Start BFF services based on configuration
      await this.containerStarter.startBffServices(config, keycloak)

      // Start UI services based on configuration
      await this.containerStarter.startUiServices(config, keycloak, this.getDefaultContainer.bind(this))
      // Create custom containers if defined in configuration
      if (config.container) {
        // Initialize container factory with core services
        this.containerFactory = new ContainerFactory(this.network, this.imageResolver, postgres, keycloak)
        await this.createCustomContainers(config)
      }
    }

    // Import data if configured
    if (config.importData && this.network && this.dataImporter) {
      this.dataImporter.createContainerInfo(this.containers)
      await this.dataImporter.importDefaultData(this.network, this.containers, config)
    }
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
        console.log(`Custom container '${key}' started successfully`)
      }
    } catch (error) {
      console.error('Failed to create custom containers:', error)
      throw error
    }
  }

  /**
   * Get a custom container by key
   */
  getCustomContainer<T extends AllowedContainerTypes>(key: string): T | undefined {
    return this.containers.get(key) as T | undefined
  }

  /**
   * Get all custom containers
   */
  getAllCustomContainers(): Map<string, AllowedContainerTypes> {
    const customContainers = new Map<string, AllowedContainerTypes>()

    // Filter out standard containers (CONTAINER enum values)
    this.containers.forEach((container, key) => {
      if (!Object.values(CONTAINER).includes(key as CONTAINER)) {
        customContainers.set(key, container)
      }
    })

    return customContainers
  }

  /**
   * Get a list of currently running services
   */
  getRunningServices(): CONTAINER[] {
    const standardContainers: CONTAINER[] = []

    // Filter only standard container keys (CONTAINER enum values)
    this.containers.forEach((_, key) => {
      if (Object.values(CONTAINER).includes(key as CONTAINER)) {
        standardContainers.push(key as CONTAINER)
      }
    })

    return standardContainers
  }

  /**
   * Check if a specific service is running
   */
  isServiceRunning(service: CONTAINER): boolean {
    return this.containers.has(service)
  }

  /**
   * Get a started container by type
   */
  getDefaultContainer<T extends AllowedContainerTypes>(service: CONTAINER): T | undefined {
    return this.containers.get(service) as T | undefined
  }

  /**
   * Add container to the Map
   */
  private addDefaultContainer<T extends AllowedContainerTypes>(key: CONTAINER, container: T): void {
    this.containers.set(key, container)
  }

  /**
   * Check the health of all running containers
   */
  async checkAllHealthy(): Promise<HealthCheckResult[]> {
    return await this.healthChecker.checkAllHealthy(this.containers)
  }

  /**
   * Get all standard containers
   */
  getAllStandardContainers(): Map<CONTAINER, AllowedContainerTypes> {
    const standardContainers = new Map<CONTAINER, AllowedContainerTypes>()

    Object.values(CONTAINER).forEach((containerType) => {
      const container = this.containers.get(containerType)
      if (container) {
        standardContainers.set(containerType, container)
      }
    })

    return standardContainers
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
    return this.containers.delete(key)
  }

  /**
   * Stop all running services and cleanup resources
   */
  async stopAllServices() {
    // Stop custom containers first
    const customContainers = this.getAllCustomContainers()
    const customContainerValues = Array.from(customContainers.values()).reverse()

    for (const container of customContainerValues) {
      try {
        await container.stop()
        console.log('Custom container stopped successfully')
      } catch (e) {
        console.error(`Error stopping custom container: ${e}`)
      }
    }

    // Stop standard containers
    // Since all services depend on Postgres and Keycloak, it's best to stop these last.
    // The same applies to the Shell, as the UI depends on the BFF.
    // Since the startup order is important, the containers can be stopped in the reverse order.
    const standardContainers = this.getAllStandardContainers()
    const containers = Array.from(standardContainers.values()).reverse()

    for (const container of containers) {
      try {
        await container.stop()
      } catch (e) {
        console.error(`Error stopping container: ${e}`)
      }
    }

    this.containers.clear()

    if (this.network) {
      await this.network.stop()
      this.network = undefined
    }
  }
}
