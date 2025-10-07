import { HealthCheckExecutor } from './health-check-executor.interface'

/**
 * Interface for containers that can provide health check strategies
 * Implements the Strategy pattern's context interface
 */
export interface HealthCheckableContainer {
  /**
   * Factory method to create appropriate health check strategy
   * @returns HealthCheckExecutor - Strategy instance for this container type
   */
  getHealthCheckExecutor(): HealthCheckExecutor
}
