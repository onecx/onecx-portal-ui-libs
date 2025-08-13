import { StartedNetwork } from 'testcontainers'
import { ImportManagerContainer, StartedImportManagerContainer } from '../containers/svc/import-container'
import { ImageResolver } from './image-resolver'
import { CONTAINER } from '../model/container.enum'
import type { AllowedContainerTypes } from '../model/allowed-container.types'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import * as fs from 'fs'
import * as path from 'path'
import { StartedShellUiContainer } from '../containers/ui/onecx-shell-ui'
import { ContainerInfo } from '../../imports/import-manager'
import { PlatformConfig } from '../model/platform-config.interface'
import { loggingEnabled } from '../utils/logging-config.util'

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
    console.log('Starting ImportManagerContainer with direct import execution')

    try {
      // Create container info file before starting the import container
      const containerInfoPath = this.createContainerInfo(startedContainers)

      const importImage = await this.imageResolver.getNodeImage(config)
      const importer = await new ImportManagerContainer(importImage, containerInfoPath)
        .withNetwork(network)
        .enableLogging(loggingEnabled(config))
        .start()

      console.log('Import container started, monitoring import process...')

      // Monitor the import process by executing commands in the container
      await new Promise<void>((resolve, reject) => {
        const checkInterval = setInterval(async () => {
          try {
            const isStillRunning = await this.checkImportStatus(importer)

            if (!isStillRunning) {
              clearInterval(checkInterval)
              console.log('Import process completed')
              resolve()
            } else {
              console.log('Import process still running...')
            }
          } catch (error) {
            clearInterval(checkInterval)
            console.log('Import process completed (error checking status)')
            resolve()
          }
        }, 2000)

        setTimeout(
          () => {
            clearInterval(checkInterval)
            reject(new Error('Import timeout after 2 minutes'))
          },
          2 * 60 * 1000
        )
      })

      console.log('Import completed successfully')
      this.cleanupContainerInfo(containerInfoPath)
    } catch (error) {
      console.error('Import failed:', error)
      throw error
    }
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

  /**
   * Clean up temporary container info file
   */
  private cleanupContainerInfo(containerInfoPath: string): void {
    if (fs.existsSync(containerInfoPath)) {
      fs.unlinkSync(containerInfoPath)
      console.log('Container info file cleaned up')
    }
  }

  /**
   * Create container info JSON file with container details
   * @param startedContainers Map of started containers
   * @returns Path to the created container info file
   */
  createContainerInfo(startedContainers: Map<string, AllowedContainerTypes>): string {
    const keycloakContainer = startedContainers.get(CONTAINER.KEYCLOAK)
    if (!keycloakContainer || !this.isKeycloakContainer(keycloakContainer)) {
      throw new Error('Keycloak container not found or invalid type in started containers')
    }

    const shellUiContainer = startedContainers.get(CONTAINER.SHELL_UI)
    if (!shellUiContainer || !this.isShellUiContainer(shellUiContainer)) {
      throw new Error('Keycloak container not found or invalid type in started containers')
    }

    const containerInfo: ContainerInfo = {
      tokenValues: {
        username: keycloakContainer.getRealm(),
        password: keycloakContainer.getRealm(),
        realm: keycloakContainer.getRealm(),
        alias: keycloakContainer.getNetworkAliases()[0],
        port: keycloakContainer.getPort(),
        clientId: shellUiContainer.getClientUserId(),
      },
      services: {} as Record<string, { alias: string; port: number }>,
    }

    const importServices = [
      CONTAINER.WORKSPACE_SVC,
      CONTAINER.THEME_SVC,
      CONTAINER.TENANT_SVC,
      CONTAINER.PRODUCT_STORE_SVC,
      CONTAINER.PERMISSION_SVC,
    ]

    for (const [name, container] of startedContainers.entries()) {
      if (importServices.includes(name as CONTAINER)) {
        containerInfo.services[name] = {
          alias: container.getNetworkAliases()[0],
          port: container.getPort(),
        }
      }
    }

    const containerInfoPath = path.resolve('libs/integration-tests/src/imports/container-info.json')

    // Ensure the directory exists
    const dir = path.dirname(containerInfoPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(containerInfoPath, JSON.stringify(containerInfo, null, 2))
    console.log('Container info file created at:', containerInfoPath)

    return containerInfoPath
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
}
