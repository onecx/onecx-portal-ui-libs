import { Network, StartedNetwork } from 'testcontainers'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { CONTAINER } from '../model/container.enum'
import { PlatformConfig } from '../model/platform-config.interface'
import { DEFAULT_PLATFORM_CONFIG } from '../config/platform-config'
import { ImageResolver } from './image-resolver'
import { HealthChecker, HealthCheckResult } from './health-checker'
import { ContainerStarter } from './container-starter'
import { DataImporter } from './data-importer'
import type { AllowedContainerTypes } from '../model/allowed-container.types'

export class PlatformManager {
  private startedContainers: Map<CONTAINER, AllowedContainerTypes> = new Map()
  private network?: StartedNetwork
  private imageResolver?: ImageResolver
  private containerStarter?: ContainerStarter
  private dataImporter?: DataImporter
  private healthChecker: HealthChecker = new HealthChecker()

  async startServices(config: PlatformConfig = DEFAULT_PLATFORM_CONFIG) {
    this.imageResolver = new ImageResolver(config)
    this.dataImporter = new DataImporter(this.imageResolver)
    this.network = await new Network().start()
    this.containerStarter = new ContainerStarter(this.imageResolver, this.network, this.addContainer.bind(this))

    // Always start core services first
    const postgres = await this.containerStarter.startCoreServices()
    const keycloak = this.startedContainers.get(CONTAINER.KEYCLOAK) as StartedOnecxKeycloakContainer

    // Start backend services based on configuration
    await this.containerStarter.startBackendServices(config, postgres, keycloak, this.getContainer.bind(this))

    // Start BFF services based on configuration
    await this.containerStarter.startBffServices(config, keycloak)

    // Start UI services based on configuration
    await this.containerStarter.startUiServices(config, keycloak, this.getContainer.bind(this))

    // Import data if configured
    if (config.importData && this.network && this.dataImporter) {
      await this.dataImporter.importDefaultData(this.network, this.startedContainers)
    }
  }

  /**
   * Get a list of currently running services
   */
  getRunningServices(): CONTAINER[] {
    return Array.from(this.startedContainers.keys())
  }

  /**
   * Check if a specific service is running
   */
  isServiceRunning(service: CONTAINER): boolean {
    return this.startedContainers.has(service)
  }

  /**
   * Get a started container by type
   */
  getContainer<T extends AllowedContainerTypes>(service: CONTAINER): T | undefined {
    return this.startedContainers.get(service) as T | undefined
  }

  /**
   * Add container to the Map
   */
  private addContainer<T extends AllowedContainerTypes>(key: CONTAINER, container: T): void {
    this.startedContainers.set(key, container)
  }

  /**
   * Check the health of all running containers
   */
  async checkAllHealthy(): Promise<HealthCheckResult[]> {
    return await this.healthChecker.checkAllHealthy(this.startedContainers)
  }

  /**
   * Stop all running services and cleanup resources
   */
  async stopAllServices() {
    // Since all services depend on Postgres and Keycloak, it's best to stop these last.
    // The same applies to the Shell, as the UI depends on the BFF.
    // Since the startup order is important, the containers can be stopped in the reverse order.
    const containers = Array.from(this.startedContainers.values()).reverse()
    for (const container of containers) {
      try {
        await container.stop()
      } catch (e) {
        console.error(`Error stopping container: ${e}`)
      }
    }
    this.startedContainers.clear()

    if (this.network) {
      await this.network.stop()
      this.network = undefined
    }
  }
}
