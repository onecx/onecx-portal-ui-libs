/**
 * Centralized logging messages
 */
export const LogMessages = {
  // Container operations
  STOPPED_CONTAINER: 'Error stopping container',
  FAILED_CREATE_CONTAINER: 'Container failed to start',
  SUCCESS_CREATE_CONTAINER: 'Container started successfully',
  CONTAINER_STARTING: 'Starting container',
  CONTAINER_STARTED: 'Container started successfully',
  CONTAINER_STOPPING: 'Stopping container',
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
  HEALTH_CHECK_SERVICE: 'Checking service health',
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

  // Service discovery
  SERVICE_DISCOVERED: 'Service discovered',
  SERVICE_AVAILABLE: 'Service is available',
  SERVICE_UNAVAILABLE: 'Service is unavailable',
  SERVICES_FOUND: 'Services found',

  // Import Manager
  IMPORT_MANAGER_INIT: 'Initializing Import Manager',
  IMPORT_MANAGER_START: 'Starting import process',
  CONFIG_FILE_NOT_FOUND: 'Configuration file not found',
  CONFIG_LOADED: 'Configuration loaded successfully',
  CONTAINER_DISCOVERED: 'Container discovered',
  REQUESTING_TOKEN: 'Requesting authentication token',
  TOKEN_SUCCESS: 'Token retrieved successfully',
  TOKEN_ERROR: 'Failed to retrieve token',
  IMPORT_COMPLETE: 'Import process completed successfully',
} as const

export type LogMessageKey = keyof typeof LogMessages

/**
 * Structured logger with timestamp, class and context information
 */
export class Logger {
  private className: string

  constructor(className: string) {
    this.className = className
  }

  private formatTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(level: string, messageKey: LogMessageKey, context?: string): string {
    const timestamp = this.formatTimestamp()
    const message = LogMessages[messageKey]
    const contextPart = context ? `(${context})` : ''
    return `${this.className}: ${timestamp} [${level}] ${this.className} ${message} - ${contextPart}`
  }

  /**
   * Log info message
   */
  info(messageKey: LogMessageKey, context?: string): void {
    console.log(this.formatMessage('INFO', messageKey, context))
  }

  /**
   * Log success message
   */
  success(messageKey: LogMessageKey, context?: string): void {
    console.log(`\x1b[32m${this.formatMessage('SUCCESS', messageKey, context)}\x1b[0m`)
  }

  /**
   * Log error message
   */
  error(messageKey: LogMessageKey, context?: string, error?: any): void {
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
    const durationSec = (durationMs / 1000).toFixed(1)
    this.success(messageKey, `${context} - Duration: ${durationSec}s`)
  }

  /**
   * Log warning message
   */
  warn(messageKey: LogMessageKey, context?: string): void {
    console.warn(`\x1b[33m${this.formatMessage('WARN', messageKey, context)}\x1b[0m`)
  }
}
