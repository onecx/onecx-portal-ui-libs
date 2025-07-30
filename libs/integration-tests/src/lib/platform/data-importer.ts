import { StartedNetwork } from 'testcontainers'
import { ImportManagerContainer, StartedImportManagerContainer } from '../containers/svc/import-container'
import { ImageResolver } from './image-resolver'
import { CONTAINER } from '../model/container.enum'
import type { AllowedContainerTypes } from '../model/allowed-container.types'
import * as fs from 'fs'
import * as path from 'path'

export class DataImporter {
  constructor(private imageResolver: ImageResolver) {}

  /**
   * Import default data using the ImportManagerContainer
   */
  async importDefaultData(
    network: StartedNetwork,
    startedContainers: Map<CONTAINER, AllowedContainerTypes>
  ): Promise<void> {
    console.log('Starting ImportManagerContainer with direct import execution')

    try {
      const importer = await new ImportManagerContainer(this.imageResolver.getNodeImage(), startedContainers)
        .withNetwork(network)
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
      this.cleanupContainerInfo()
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
  private cleanupContainerInfo(): void {
    const containerInfoPath = path.resolve(__dirname, '../../imports/container-info.json')
    if (fs.existsSync(containerInfoPath)) {
      fs.unlinkSync(containerInfoPath)
      console.log('Container info file cleaned up')
    }
  }
}
