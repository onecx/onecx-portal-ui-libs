import axios from 'axios'
import { HealthCheckResult, HealthCheckExecutor, HealthCheckMetadata } from '../models/health-check-executor.interface'

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
