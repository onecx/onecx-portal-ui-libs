import axios from 'axios'
import { CONTAINER } from '../model/container.enum'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import type { AllowedContainerTypes } from '../model/allowed-container.types'
import { Logger } from '../utils/logger'

const logger = new Logger('HealthChecker')

export interface HealthCheckResult {
  name: string
  healthy: boolean
}

export class HealthChecker {
  constructor() {
    // Platform config will be set globally by PlatformManager
    // No need to set it here to avoid race conditions
  }
  /**
   * Check the health of all containers
   */
  async checkAllHealthy(startedContainers: Map<string, AllowedContainerTypes>): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = []

    for (const [name, container] of startedContainers.entries()) {
      let healthy = true

      if (this.shouldSkipHealthCheck(name)) {
        logger.info('HEALTH_CHECK_SKIP', name)
      } else if (name === CONTAINER.KEYCLOAK) {
        healthy = await this.checkKeycloakHealth(container as StartedOnecxKeycloakContainer)
      } else {
        healthy = await this.checkContainerHealth(container, name)
      }
      results.push({ name, healthy })
    }

    return results
  }

  /**
   * Check the health of one contianer
   */
  async checkHealthy(
    startedContainers: Map<string, AllowedContainerTypes>,
    name: string
  ): Promise<HealthCheckResult[]> {
    const results: HealthCheckResult[] = []

    const container = startedContainers.get(name)
    if (!container) {
      results.push({ name, healthy: false })
      return results
    }

    let healthy = true

    if (this.shouldSkipHealthCheck(name)) {
      logger.info('HEALTH_CHECK_SKIP', name)
    } else if (name === CONTAINER.KEYCLOAK) {
      healthy = await this.checkKeycloakHealth(container as StartedOnecxKeycloakContainer)
    } else {
      healthy = await this.checkContainerHealth(container, name)
    }

    results.push({ name, healthy })
    return results
  }

  /**
   * Check if health check should be skipped for a container
   */
  private shouldSkipHealthCheck(containerName: string): boolean {
    return containerName === CONTAINER.POSTGRES || containerName === CONTAINER.SHELL_UI
  }

  /**
   * Check health of a Keycloak container
   */
  private async checkKeycloakHealth(keycloakContainer: StartedOnecxKeycloakContainer): Promise<boolean> {
    const realm = keycloakContainer.getRealm()
    const url = this.buildHealthCheckUrl(keycloakContainer, `/realms/${realm}/.well-known/openid-configuration`)
    logger.info('HEALTH_CHECK_KEYCLOAK', url)
    return await this.sendHttpRequest(url)
  }

  /**
   * Check health of a service container
   */
  private async checkContainerHealth(container: AllowedContainerTypes, name: string): Promise<boolean> {
    const url = this.buildHealthCheckUrl(container, '/q/health')
    logger.info('HEALTH_CHECK_CONTAINER', `${name} at ${url}`)
    return await this.sendHttpRequest(url)
  }

  /**
   * Make HTTP request to check container health
   */
  private async sendHttpRequest(url: string): Promise<boolean> {
    try {
      const response = await axios.get(url)
      return response.status === 200
    } catch {
      return false
    }
  }

  /**
   * Build health check URL for a container
   */
  private buildHealthCheckUrl(container: AllowedContainerTypes, healthPath: string): string {
    const port = container.getMappedPort(container.getPort())
    return `http://localhost:${port}${healthPath}`
  }
}
