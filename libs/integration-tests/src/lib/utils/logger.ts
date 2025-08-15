import { loggingEnabled } from './logging-enable'
import { PlatformConfig } from '../model/platform-config.interface'

/**
 * Centralized logging messages
 */
export const LogMessages = {
  // Container operations
  CONTAINER_STARTED: 'Container started successfully',
  CONTAINER_STOPPED: 'Container stopped successfully',
  CONTAINER_FAILED: 'Container operation failed',

  // Platform operations
  PLATFORM_MANAGER_INIT: 'Initializing Platform Manager',
  PLATFORM_START: 'Starting platform containers',
  PLATFORM_STOP: 'Stopping all containers',
  PLATFORM_READY: 'Platform is ready',
  PLATFORM_SHUTDOWN: 'Platform shutdown completed',

  // Health checks
  HEALTH_CHECK_START: 'Starting health check',
  HEALTH_CHECK_SUCCESS: 'Health check passed',
  HEALTH_CHECK_FAILED: 'Health check failed',
  HEALTH_CHECK_SKIP: 'Skipping health check - no endpoint available',
  HEALTH_CHECK_KEYCLOAK: 'Checking Keycloak health',
  HEALTH_CHECK_CONTAINER: 'Checking service health',
  CONTAINER_HEALTHY: 'Container is healthy',
  CONTAINER_UNHEALTHY: 'Container is unhealthy',

  // Startup process
  STARTUP_TIMEOUT: 'Container startup timed out',
  STARTUP_SUCCESS: 'All containers started successfully',
  STARTUP_FAILED: 'Container startup failed',

  // Data import
  DATA_IMPORT_START: 'Starting data import',
  DATA_IMPORT_SUCCESS: 'Data import completed successfully',
  DATA_IMPORT_FAILED: 'Data import failed',
  DATA_IMPORT_PROCESS_COMPLETE: 'Import process completed',
  DATA_IMPORT_PROCESS_RUNNING: 'Import process still running',
  DATA_IMPORT_PROCESS_ERROR: 'Import process completed with error',
  DATA_IMPORT_CLEANUP: 'Container info file cleaned up',
  DATA_IMPORT_FILE_CREATED: 'Container info file created',

  // Network operations
  NETWORK_CREATE: 'Creating network',
  NETWORK_CREATED: 'Network created successfully',
  NETWORK_DESTROY: 'Destroying network',
  NETWORK_DESTROYED: 'Network destroyed successfully',

  // Image operations
  IMAGE_VERIFY_FAILED: 'Image verification failed, falling back to default',
  IMAGE_VERIFY_SUCCESS: 'Image verification successful',
  IMAGE_PULL_START: 'Starting image pull verification',
  IMAGE_PULL_SUCCESS: 'Image pulled successfully',
  IMAGE_PULL_FAILED: 'Image pull failed',
} as const

export type LogMessageKey = keyof typeof LogMessages

/**
 * Structured logger with timestamp, class and context information
 */
export class Logger {
  private static loggingEnabled: boolean = true
  private static platformConfig: PlatformConfig | undefined = undefined
  private className: string

  constructor(className: string) {
    this.className = className
  }

  /**
   * Set the platform configuration for logging decisions
   */
  setPlatformConfig(config: PlatformConfig): void {
    Logger.platformConfig = config
  }

  /**
   * Get the current platform configuration
   */
  static getPlatformConfig(): PlatformConfig | undefined {
    return Logger.platformConfig
  }

  /**
   * Check if logging should be enabled for this logger instance
   * Uses the existing loggingEnabled function with className as networkAlias
   */
  private loggingEnabled(): boolean {
    // If global logging is disabled, nothing logs
    if (!Logger.loggingEnabled) {
      return false
    }

    // If no platform config is set, use global default
    if (!Logger.platformConfig) {
      return Logger.loggingEnabled
    }

    // Use the existing loggingEnabled function, treating className as networkAlias
    return loggingEnabled(Logger.platformConfig, [this.className])
  }

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(level: string, messageKey: LogMessageKey, context?: string): string {
    const timestamp = this.formatTimestamp()
    const message = LogMessages[messageKey]
    const contextPart = context ? ` - (${context})` : ''
    return `${this.className}: ${timestamp} [${level}] ${this.className} ${message}${contextPart}`
  }

  /**
   * Log info message
   */
  info(messageKey: LogMessageKey, context?: string): void {
    if (!this.loggingEnabled()) return
    console.log(this.formatMessage('INFO', messageKey, context))
  }

  /**
   * Log success message
   */
  success(messageKey: LogMessageKey, context?: string): void {
    if (!this.loggingEnabled()) return
    console.log(`\x1b[32m${this.formatMessage('SUCCESS', messageKey, context)}\x1b[0m`)
  }

  /**
   * Log error message
   */
  error(messageKey: LogMessageKey, context?: string, error?: any): void {
    if (!this.loggingEnabled()) return
    const message = this.formatMessage('ERROR', messageKey, context)
    if (error) {
      console.error(`\x1b[31m${message}\x1b[0m`, error)
    } else {
      console.error(`\x1b[31m${message}\x1b[0m`)
    }
  }

  /**
   * Log based on HTTP status code
   */
  status(messageKey: LogMessageKey, statusCode: number, context?: string): void {
    if (!this.loggingEnabled()) return
    if ([200, 201].includes(statusCode)) {
      this.success(messageKey, `${context} - Status: ${statusCode}`)
    } else {
      this.error(messageKey, `${context} - Status: ${statusCode}`)
    }
  }

  /**
   * Log duration of an operation
   */
  logDuration(messageKey: LogMessageKey, durationMs: number, context?: string): void {
    if (!this.loggingEnabled()) return
    const durationSec = (durationMs / 1000).toFixed(1)
    this.success(messageKey, `${context} - Duration: ${durationSec}s`)
  }

  /**
   * Log warning message
   */
  warn(messageKey: LogMessageKey, context?: string): void {
    if (!this.loggingEnabled()) return
    console.warn(`\x1b[33m${this.formatMessage('WARN', messageKey, context)}\x1b[0m`)
  }
}
