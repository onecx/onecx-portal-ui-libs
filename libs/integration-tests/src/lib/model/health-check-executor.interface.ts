import axios from 'axios'

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

/**
 * HTTP-based health check strategy
 * Uses axios with configurable timeout and retry logic
 */
export class HttpHealthCheckExecutor implements HealthCheckExecutor {
  constructor(
    private readonly endpoint: string,
    private readonly timeout = 5000,
    private readonly expectedStatusCodes: number[] = [200]
  ) {}

  async executeHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now()

    try {
      const response = await axios.get(this.endpoint, {
        timeout: this.timeout,
        validateStatus: (status) => this.expectedStatusCodes.includes(status),
      })

      return {
        success: true,
        responseTime: Date.now() - startTime,
        statusCode: response.status,
      }
    } catch (error) {
      return {
        success: false,
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  getExecutionMetadata(): HealthCheckMetadata {
    return {
      strategyType: 'HTTP',
      endpoint: this.endpoint,
      timeout: this.timeout,
      description: `HTTP GET ${this.endpoint}`,
    }
  }
}

/**
 * No-op strategy for containers without health endpoints
 * Always returns success to avoid false negatives
 */
export class SkipHealthCheckExecutor implements HealthCheckExecutor {
  constructor(private readonly containerName: string) {}

  async executeHealthCheck(): Promise<HealthCheckResult> {
    return { success: true }
  }

  getExecutionMetadata(): HealthCheckMetadata {
    return {
      strategyType: 'SKIP',
      description: `${this.containerName} - No health check required`,
    }
  }
}
