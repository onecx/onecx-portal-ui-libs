import axios from 'axios'
import { CONTAINER } from '../model/container.enum'
import { StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import type { AllowedContainerTypes } from '../model/allowed-container.types'
import { Logger } from '../utils/logger'
import { HealthCheckResult, HeartbeatConfig } from '../model/health-checker.interface'

const logger = new Logger('HealthChecker')

export class HealthChecker {
  private heartbeatInterval?: NodeJS.Timeout
  private failureCount = new Map<string, number>()
  private heartbeatConfig: Required<HeartbeatConfig> = {
    enabled: false,
    interval: 10000, // 10 seconds default
    failureThreshold: 3,
  }

  constructor() {
    // Platform config will be set globally by PlatformManager
    // No need to set it here to avoid race conditions
  }

  /**
   * Configure heartbeat settings from platform configuration
   */
  configureHeartbeat(config?: HeartbeatConfig): void {
    if (config) {
      this.heartbeatConfig = {
        enabled: config.enabled,
        interval: config.interval ?? 10000,
        failureThreshold: config.failureThreshold ?? 3,
      }
      logger.info(
        'HEALTH_CHECK_START',
        `Heartbeat configured: enabled=${config.enabled}, interval=${this.heartbeatConfig.interval}ms, threshold=${this.heartbeatConfig.failureThreshold}`
      )
    } else {
      this.heartbeatConfig = {
        enabled: false,
        interval: 10000,
        failureThreshold: 3,
      }
      logger.info('HEALTH_CHECK_START', 'Heartbeat disabled (no configuration provided)')
    }
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

  /**
   * Start heartbeat monitoring for containers
   */
  startHeartbeat(startedContainers: Map<string, AllowedContainerTypes>): void {
    if (!this.heartbeatConfig.enabled) {
      logger.info('HEALTH_CHECK_START', 'Heartbeat monitoring is disabled')
      return
    }

    if (this.heartbeatInterval) {
      this.stopHeartbeat()
    }

    logger.info('HEALTH_CHECK_START', `Starting heartbeat monitoring (interval: ${this.heartbeatConfig.interval}ms)`)

    this.heartbeatInterval = setInterval(async () => {
      try {
        const healthStatus = await this.checkAllHealthy(startedContainers)
        logger.success('HEALTH_CHECK_SUCCESS', `Checked ${healthStatus.length} containers`)

        // Process health results and track failures
        const unhealthyContainers = healthStatus.filter((c) => !c.healthy)

        for (const container of healthStatus) {
          if (container.healthy) {
            // Reset failure count for healthy containers
            this.failureCount.delete(container.name)
          } else {
            // Increment failure count
            const currentFailures = this.failureCount.get(container.name) || 0
            this.failureCount.set(container.name, currentFailures + 1)

            // Log error if threshold exceeded
            const failures = this.failureCount.get(container.name) || 0
            if (failures >= this.heartbeatConfig.failureThreshold) {
              logger.error(
                'CONTAINER_UNHEALTHY',
                `Container ${container.name} unhealthy (${failures} consecutive failures)`
              )
            } else if (failures === 1) {
              logger.warn('CONTAINER_UNHEALTHY', `Container ${container.name} unhealthy (first failure)`)
            }
          }
        }

        if (unhealthyContainers.length > 0) {
          const summary = `${unhealthyContainers.length} containers unhealthy: ${unhealthyContainers.map((c) => c.name).join(', ')}`
          logger.error('CONTAINER_UNHEALTHY', summary)
        }
      } catch (error) {
        logger.error('HEALTH_CHECK_FAILED', undefined, error)
      }
    }, this.heartbeatConfig.interval)
  }

  /**
   * Stop heartbeat monitoring
   */
  stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = undefined
      this.failureCount.clear()
      logger.info('HEALTH_CHECK_START', 'Heartbeat monitoring stopped')
    }
  }

  /**
   * Check if heartbeat is currently running
   */
  isHeartbeatRunning(): boolean {
    return this.heartbeatInterval !== undefined
  }

  /**
   * Get current heartbeat configuration
   */
  getHeartbeatConfig(): HeartbeatConfig {
    return { ...this.heartbeatConfig }
  }
}
