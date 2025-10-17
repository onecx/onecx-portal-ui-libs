import type { AllowedContainerTypes } from '../models/allowed-container.types'
import { Logger, LogMessages } from '../utils/logger'
import { HealthCheckResult, HeartbeatConfig } from '../models/health-checker.interface'

const logger = new Logger('HealthChecker')

const DEFAULT_HEARTBEAT_CONFIG: Required<HeartbeatConfig> = {
  enabled: false,
  interval: 10000, // 10 seconds default
  failureThreshold: 3,
}

export class HealthChecker {
  private heartbeatInterval?: NodeJS.Timeout
  private failureCountMap = new Map<string, number>()
  private heartbeatConfig: Required<HeartbeatConfig> = { ...DEFAULT_HEARTBEAT_CONFIG }

  /**
   * Configure heartbeat settings from platform configuration
   */
  configureHeartbeat(config?: HeartbeatConfig): void {
    if (config) {
      this.heartbeatConfig = {
        ...DEFAULT_HEARTBEAT_CONFIG,
        ...config,
      }
      logger.info(
        LogMessages.HEALTH_CHECK_START,
        `Heartbeat configured: enabled=${config.enabled}, interval=${this.heartbeatConfig.interval}ms, threshold=${this.heartbeatConfig.failureThreshold}`
      )
    } else {
      this.heartbeatConfig = { ...DEFAULT_HEARTBEAT_CONFIG }
      logger.info(LogMessages.HEALTH_CHECK_START, 'Heartbeat disabled (no configuration provided)')
    }
  }

  /**
   * Check the health of all containers
   */
  async checkAllHealthy(startedContainers: Map<string, AllowedContainerTypes>): Promise<HealthCheckResult[]> {
    const healthCheckPromises = Array.from(startedContainers.keys()).map(async (name) => {
      const result = await this.checkHealthy(startedContainers, name)
      return result
    })

    return Promise.all(healthCheckPromises)
  }

  /**
   * Check the health of one container using the strategy pattern
   */
  async checkHealthy(startedContainers: Map<string, AllowedContainerTypes>, name: string): Promise<HealthCheckResult> {
    const container = startedContainers.get(name)
    if (!container) {
      throw new Error(`No started container found with name "${name}"`)
    }

    // All containers must implement HealthCheckableContainer interface
    const executor = container.getHealthCheckExecutor()
    const metadata = executor.getExecutionMetadata()

    logger.info(LogMessages.HEALTH_CHECK_CONTAINER, metadata.description)

    try {
      const result = await executor.executeHealthCheck()

      if (result.success) {
        logger.success(
          LogMessages.HEALTH_CHECK_SUCCESS,
          `${name} healthy ${result.responseTime ? `(${result.responseTime}ms)` : ''}`
        )
      } else {
        logger.error(LogMessages.HEALTH_CHECK_FAILED, `${name} unhealthy: ${result.error || 'Unknown error'}`)
      }

      return { name, healthy: result.success }
    } catch (error) {
      logger.error(LogMessages.HEALTH_CHECK_FAILED, `${name} health check threw exception`, error)
      return { name, healthy: false }
    }
  }

  /**
   * Start heartbeat monitoring for containers
   */
  startHeartbeat(startedContainers: Map<string, AllowedContainerTypes>): void {
    if (!this.heartbeatConfig.enabled) {
      logger.info(LogMessages.HEALTH_CHECK_START, 'Heartbeat monitoring is disabled')
      return
    }

    if (this.heartbeatInterval) {
      // Stop any existing heartbeat to prevent multiple intervals running
      this.stopHeartbeat()
    }

    logger.info(
      LogMessages.HEALTH_CHECK_START,
      `Starting heartbeat monitoring (interval: ${this.heartbeatConfig.interval}ms)`
    )

    this.heartbeatInterval = setInterval(async () => {
      try {
        await this.processHeartbeatCheck(startedContainers)
      } catch (error) {
        logger.error(LogMessages.HEALTH_CHECK_FAILED, undefined, error)
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
      this.failureCountMap.clear()
      logger.info(LogMessages.HEALTH_CHECK_START, 'Heartbeat monitoring stopped')
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

  /**
   * Process a single heartbeat check cycle
   */
  private async processHeartbeatCheck(startedContainers: Map<string, AllowedContainerTypes>): Promise<void> {
    const healthStatus = await this.checkAllHealthy(startedContainers)
    logger.success(LogMessages.HEALTH_CHECK_SUCCESS, `Checked ${healthStatus.length} containers`)

    this.processHealthResults(healthStatus)
    this.logHealthSummary(healthStatus)
  }

  /**
   * Process health check results and track failure counts
   */
  private processHealthResults(healthStatus: HealthCheckResult[]): void {
    for (const container of healthStatus) {
      if (container.healthy) {
        // Reset failure count for healthy containers
        this.failureCountMap.delete(container.name)
      } else {
        // Increment failure count
        const currentFailures = this.failureCountMap.get(container.name) || 0
        this.failureCountMap.set(container.name, currentFailures + 1)

        // Log error if threshold exceeded
        const failures = this.failureCountMap.get(container.name) || 0
        if (failures >= this.heartbeatConfig.failureThreshold) {
          logger.error(
            LogMessages.CONTAINER_UNHEALTHY,
            `Container ${container.name} unhealthy (${failures} consecutive failures)`
          )
        } else if (failures === 1) {
          logger.warn(LogMessages.CONTAINER_UNHEALTHY, `Container ${container.name} unhealthy (first failure)`)
        }
      }
    }
  }

  /**
   * Log summary of unhealthy containers
   */
  private logHealthSummary(healthStatus: HealthCheckResult[]): void {
    const unhealthyContainers = healthStatus.filter((c) => !c.healthy)

    if (unhealthyContainers.length > 0) {
      const summary = `${unhealthyContainers.length} containers unhealthy: ${unhealthyContainers.map((c) => c.name).join(', ')}`
      logger.error(LogMessages.CONTAINER_UNHEALTHY, summary)
    }
  }
}
