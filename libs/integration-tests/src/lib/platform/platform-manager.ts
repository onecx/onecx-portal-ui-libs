import { Network, StartedNetwork } from 'testcontainers'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { CONTAINER } from '../model/container.enum'
import { PlatformConfig } from '../model/platform-config.interface'
import { DEFAULT_PLATFORM_CONFIG } from '../config/default-platform-config'
import { ImageResolver } from './image-resolver'
import { HealthChecker } from './health-checker'
import { CoreContainerStarter } from './core-container-starter'
import { UserDefinedContainerStarter } from './user-defined-container-starter'
import { DataImporter } from './data-importer'
import type { AllowedContainerTypes } from '../model/allowed-container.types'
import { HealthCheckResult } from '../model/health-checker.interface'
import { Logger } from '../utils/logger'
import { JsonValidator } from './json-validator'
import { StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'

const logger = new Logger('PlatformManager')

export class PlatformManager {
  /**
   * Unified map for all containers (core and user-defined containers)
   */
  private containers: Map<string, AllowedContainerTypes> = new Map()

  /**
   * Needed classes for startContainers
   */
  private network?: StartedNetwork
  private imageResolver?: ImageResolver
  private CoreContainerStarter?: CoreContainerStarter
  private UserDefinedContainerStarter?: UserDefinedContainerStarter
  private dataImporter?: DataImporter
  private healthChecker?: HealthChecker
  private jsonValidator: JsonValidator
  private validatedConfig?: PlatformConfig

  constructor(configFilePath?: string) {
    this.jsonValidator = new JsonValidator()

    // Validate configuration file if it exists
    const validationResult = this.jsonValidator.validateConfigFile(configFilePath)

    if (validationResult.isValid && validationResult.config) {
      this.validatedConfig = validationResult.config
      logger.success('CONFIG_FOUND', 'Configuration loaded and validated successfully')
    } else if (validationResult.errors && validationResult.errors.length > 0) {
      logger.warn('CONFIG_VALIDATION_WARN', `Configuration validation failed: ${validationResult.errors.join(', ')}`)
      logger.info('CONFIG_NOT_FOUND', 'Using default configuration')
    } else {
      logger.info('CONFIG_NOT_FOUND', 'No configuration file found, using default configuration')
    }
  }

  /**
   * Orchestrates the startup of the default services and the creation of user-defined containers.
   * @param config Optional config override. If not provided, uses validated config from constructor or default config
   */
  async startContainers(config?: PlatformConfig) {
    // Use validated config from constructor if available, otherwise use provided config or default
    const finalConfig = config || this.validatedConfig || DEFAULT_PLATFORM_CONFIG

    // Configure logger based on platform config
    logger.setPlatformConfig(finalConfig)

    logger.info('PLATFORM_MANAGER_INIT')
    this.healthChecker = new HealthChecker()

    // Configure heartbeat from platform config
    this.healthChecker.configureHeartbeat(finalConfig.hearthbeat)

    this.imageResolver = new ImageResolver()
    this.dataImporter = new DataImporter(this.imageResolver)

    logger.info('NETWORK_CREATE')
    this.network = await new Network().start()
    logger.success('NETWORK_CREATED')

    this.CoreContainerStarter = new CoreContainerStarter(
      this.imageResolver,
      this.network,
      this.addContainer.bind(this),
      finalConfig
    )

    logger.info('PLATFORM_START')
    // Always start core services first
    await this.startContainers()
    const postgres = this.containers.get(CONTAINER.POSTGRES) as StartedOnecxPostgresContainer
    const keycloak = this.containers.get(CONTAINER.KEYCLOAK) as StartedOnecxKeycloakContainer

    await this.CoreContainerStarter.startServiceContainers(postgres, keycloak, this.getContainer.bind(this))

    // Start BFF containers based on configuration
    await this.CoreContainerStarter.startBffContainers(keycloak)

    // Start UI containers based on configuration
    await this.CoreContainerStarter.startUiContainers(keycloak, this.getContainer.bind(this))
    // Create user-defined containers if defined in configuration
    if (finalConfig.container) {
      // Initialize container factory with core services
      this.UserDefinedContainerStarter = new UserDefinedContainerStarter(
        this.network,
        this.imageResolver,
        postgres,
        keycloak
      )
      await this.createContainers(finalConfig)
    }

    // Import data if configured
    if (finalConfig.importData && this.network && this.dataImporter) {
      this.dataImporter.createContainerInfo(this.containers)
      await this.dataImporter.importDefaultData(this.network, this.containers, finalConfig)
    }

    logger.success('PLATFORM_READY')

    // Start heartbeat monitoring if configured
    if (this.healthChecker) {
      this.healthChecker.startHeartbeat(this.containers)
    }
  }

  /**
   * Create user-defined containers using the UserDefinedContainerStarter
   */
  private async createContainers(config: PlatformConfig): Promise<void> {
    if (!this.UserDefinedContainerStarter) {
      throw new Error('UserDefinedContainerStarter not initialized. Core services must be started first.')
    }

    try {
      const customContainers = await this.UserDefinedContainerStarter.createAndStartContainers(config)

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
   * Get the validated configuration
   */
  getValidatedConfig(): PlatformConfig | undefined {
    return this.validatedConfig
  }

  /**
   * Check if a valid configuration file was found and loaded
   */
  hasValidatedConfig(): boolean {
    return this.validatedConfig !== undefined
  }

  /**
   * Get the JSON validator instance
   */
  getJsonValidator(): JsonValidator {
    return this.jsonValidator
  }

  /**
   * Check the health of all running containers
   */
  async checkAllHealthy(): Promise<HealthCheckResult[]> {
    if (!this.healthChecker) {
      throw new Error('HealthChecker not initialized. Call startContainers first.')
    }
    return await this.healthChecker.checkAllHealthy(this.containers)
  }

  /**
   * Check the health of one runnting contianer
   * @param containerName
   * @returns
   */
  async checkHealthy(containerName: string): Promise<HealthCheckResult[]> {
    if (!this.healthChecker) {
      throw new Error('HealthChecker not initialized. Call startContainers first.')
    }
    return await this.healthChecker.checkHealthy(this.containers, containerName)
  }

  /**
   * Check if heartbeat monitoring is currently running
   */
  isHeartbeatRunning(): boolean {
    return this.healthChecker?.isHeartbeatRunning() || false
  }

  /**
   * Get the current heartbeat configuration
   */
  getHeartbeatConfig() {
    return this.healthChecker?.getHeartbeatConfig()
  }

  /**
   * Start heartbeat monitoring manually
   */
  startHeartbeat(): void {
    if (!this.healthChecker) {
      throw new Error('HealthChecker not initialized. Call startContainers first.')
    }
    this.healthChecker.startHeartbeat(this.containers)
  }

  /**
   * Stop heartbeat monitoring manually
   */
  stopHeartbeat(): void {
    if (this.healthChecker) {
      this.healthChecker.stopHeartbeat()
    }
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
  private async stopContainer(key: string | CONTAINER) {
    const container = this.getContainer(key)
    const containerKey = typeof key === 'string' ? key : String(key)
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

    // Stop heartbeat monitoring first
    if (this.healthChecker) {
      this.healthChecker.stopHeartbeat()
    }

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
