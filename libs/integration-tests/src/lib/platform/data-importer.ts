import { StartedNetwork } from 'testcontainers'
import { ImportManagerContainer, StartedImportManagerContainer } from '../containers/import/import-container'
import { ImageResolver } from './image-resolver'
import { CONTAINER } from '../models/container.enum'
import type { AllowedContainerTypes } from '../models/allowed-container.types'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import * as fs from 'fs'
import * as path from 'path'
import { StartedShellUiContainer } from '../containers/ui/onecx-shell-ui'
import { ContainerInfo } from '../../imports/import-manager'
import { PlatformConfig } from '../models/platform-config.interface'
import { loggingEnabled } from '../utils/logging-enable'
import { Logger, LogMessages } from '../utils/logger'

const logger = new Logger('DataImporter')

interface KeycloakInfo {
  username: string
  password: string
  realm: string
  alias: string
  port: number
}

interface ShellUiInfo {
  clientId: string
}

export class DataImporter {
  constructor(private imageResolver: ImageResolver) {}

  /**
   * Import default data using the ImportManagerContainer
   */
  async importDefaultData(
    network: StartedNetwork,
    startedContainers: Map<string, AllowedContainerTypes>,
    config: PlatformConfig
  ): Promise<void> {
    // Platform config is already set globally by PlatformManager

    logger.info(LogMessages.DATA_IMPORT_START)

    try {
      // Create container info file before starting the import container
      const containerInfoPath = this.createContainerInfo(startedContainers)

      const importImage = await this.imageResolver.getImportManagerBaseImage(config)
      const importer = await new ImportManagerContainer(importImage, containerInfoPath)
        .withNetwork(network)
        .enableLogging(loggingEnabled(config, [CONTAINER.IMPORT_MANAGER]))
        .start()

      logger.info(LogMessages.CONTAINER_STARTED, 'Import container - monitoring import process')

      // Monitor the import process by executing commands in the container
      await new Promise<void>((resolve, reject) => {
        const checkInterval = setInterval(async () => {
          try {
            const isStillRunning = await this.checkImportStatus(importer)

            if (!isStillRunning) {
              clearInterval(checkInterval)
              logger.info(LogMessages.DATA_IMPORT_PROCESS_COMPLETE)
              resolve()
            } else {
              logger.info(LogMessages.DATA_IMPORT_PROCESS_RUNNING)
            }
          } catch (error) {
            clearInterval(checkInterval)
            logger.error(LogMessages.DATA_IMPORT_PROCESS_ERROR, undefined, error)
            resolve()
          }
        }, 2000)

        setTimeout(
          () => {
            clearInterval(checkInterval)
            reject(new Error('Import timeout after 1 minutes'))
          },
          1 * 60 * 1000
        )
      })

      logger.success(LogMessages.DATA_IMPORT_SUCCESS)
      this.cleanupContainerInfo(containerInfoPath)
    } catch (error) {
      logger.error(LogMessages.DATA_IMPORT_FAILED, undefined, error)
      throw error
    }
  }

  /**
   * Create container info JSON file with container details
   * @param startedContainers Map of started containers
   * @returns Path to the created container info file
   */
  createContainerInfo(startedContainers: Map<string, AllowedContainerTypes>): string {
    const keycloakContainer = this.extractKeycloakContainer(startedContainers)
    const keycloakInfo = this.buildKeycloakInfo(keycloakContainer)

    const shellUiContainer = this.extractShellUiContainer(startedContainers)
    const shellUiInfo = this.buildShellUiInfo(shellUiContainer)

    const services = this.buildServicesInfo(startedContainers)

    const containerInfo: ContainerInfo = {
      tokenValues: {
        username: keycloakInfo.username,
        password: keycloakInfo.password,
        realm: keycloakInfo.realm,
        alias: keycloakInfo.alias,
        port: keycloakInfo.port,
        clientId: shellUiInfo.clientId,
      },
      services: services,
    }

    return this.writeContainerInfoFile(containerInfo)
  }

  private extractKeycloakContainer(
    startedContainers: Map<string, AllowedContainerTypes>
  ): StartedOnecxKeycloakContainer {
    const keycloakContainer = startedContainers.get(CONTAINER.KEYCLOAK)
    if (!keycloakContainer || !this.isKeycloakContainer(keycloakContainer)) {
      throw new Error('Keycloak container not found or invalid type in started containers')
    }
    return keycloakContainer
  }

  private buildKeycloakInfo(keycloakContainer: StartedOnecxKeycloakContainer): KeycloakInfo {
    return {
      username: keycloakContainer.getRealm(),
      password: keycloakContainer.getRealm(),
      realm: keycloakContainer.getRealm(),
      alias: keycloakContainer.getNetworkAliases()[0],
      port: keycloakContainer.getPort(),
    }
  }

  private extractShellUiContainer(startedContainers: Map<string, AllowedContainerTypes>): StartedShellUiContainer {
    const shellUiContainer = startedContainers.get(CONTAINER.SHELL_UI)
    if (!shellUiContainer || !this.isShellUiContainer(shellUiContainer)) {
      throw new Error('Shell UI container not found or invalid type in started containers')
    }
    return shellUiContainer
  }

  private buildShellUiInfo(shellUiContainer: StartedShellUiContainer): ShellUiInfo {
    return {
      clientId: shellUiContainer.getClientUserId(),
    }
  }

  /**
   * Build services info from all started containers
   * Creates mapping for all containers that can be services
   * @param startedContainers Map of all started containers
   * @returns Record of service names to their connection info
   */
  private buildServicesInfo(
    startedContainers: Map<string, AllowedContainerTypes>
  ): Record<string, { alias: string; port: number }> {
    const services: Record<string, { alias: string; port: number }> = {}

    // Iterate through all started containers and extract service info
    for (const [containerName, container] of startedContainers) {
      const serviceName = this.getServiceNameFromContainer(containerName)

      // Only add containers that have a valid service mapping
      if (serviceName) {
        services[serviceName] = {
          alias: container.getNetworkAliases()[0],
          port: container.getPort(),
        }

        logger.info(
          'SERVICE_MAPPED',
          `${containerName} -> ${serviceName} (${container.getNetworkAliases()[0]}:${container.getPort()})`
        )
      } else {
        // Log containers that don't have service mappings for debugging
        logger.info(
          'SERVICE_SKIPPED',
          `${containerName} - No service mapping defined (likely UI or infrastructure container)`
        )
      }
    }

    logger.info('SERVICES_DISCOVERED', `Total services mapped: ${Object.keys(services).length}`)
    return services
  }

  /**
   * Map container names to service names expected by ImportManager
   * @param containerName The internal container name
   * @returns The service name or null if not a mappable service
   */
  private getServiceNameFromContainer(containerName: string): string | null {
    const containerToServiceMap: Record<string, string> = {
      // Core services
      [CONTAINER.TENANT_SVC]: 'onecx-tenant-svc',
      [CONTAINER.THEME_SVC]: 'onecx-theme-svc',
      [CONTAINER.PRODUCT_STORE_SVC]: 'onecx-product-store-svc',
      [CONTAINER.PERMISSION_SVC]: 'onecx-permission-svc',
      [CONTAINER.WORKSPACE_SVC]: 'onecx-workspace-svc',
    }

    return containerToServiceMap[containerName] || null
  }

  private writeContainerInfoFile(containerInfo: ContainerInfo): string {
    const containerInfoPath = path.resolve('libs/integration-tests/src/imports/container-info.json')

    // Ensure the directory exists
    const dir = path.dirname(containerInfoPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(containerInfoPath, JSON.stringify(containerInfo, null, 2))
    logger.info(LogMessages.DATA_IMPORT_FILE_CREATED, containerInfoPath)

    return containerInfoPath
  }

  /**
   * Clean up temporary container info file
   */
  private cleanupContainerInfo(containerInfoPath: string): void {
    if (fs.existsSync(containerInfoPath)) {
      fs.unlinkSync(containerInfoPath)
      logger.info(LogMessages.DATA_IMPORT_CLEANUP)
    }
  }

  /**
   * Type guard to check if container is a Keycloak container
   */
  private isKeycloakContainer(container: AllowedContainerTypes): container is StartedOnecxKeycloakContainer {
    return container instanceof StartedOnecxKeycloakContainer
  }

  /**
   * Type guard to check if container is a ShellUi container
   */
  private isShellUiContainer(container: AllowedContainerTypes): container is StartedShellUiContainer {
    return container instanceof StartedShellUiContainer
  }

  /**
   * Check if the import process is still running
   */
  private async checkImportStatus(importer: StartedImportManagerContainer): Promise<boolean> {
    try {
      // Check if the import process is still running by looking for the node process
      const processResult = await importer.exec(['pgrep', '-f', 'import-runner.ts'])
      return processResult.exitCode === 0 // true if process is still running
    } catch (error) {
      // If exec fails, assume import is completed
      return false
    }
  }
}
