/**
 * Result of a health check execution
 */
export interface HealthCheckResult {
  success: boolean
  responseTime?: number
  statusCode?: number
  error?: string
}

/**
 * Metadata about the health check execution strategy
 */
export interface HealthCheckMetadata {
  strategyType: 'HTTP' | 'SKIP'
  endpoint?: string
  timeout?: number
  description: string
}

/**
 * Abstract health check strategy interface
 * Implements the Strategy pattern for container health checking
 */
export interface HealthCheckExecutor {
  /**
   * Execute the health check strategy
   * @returns Promise<HealthCheckResult> - Contains success status and optional metadata
   */
  executeHealthCheck(): Promise<HealthCheckResult>

  /**
   * Get execution metadata for logging/debugging
   * @returns HealthCheckMetadata - Contains strategy type, endpoint, timeout info
   */
  getExecutionMetadata(): HealthCheckMetadata
}
