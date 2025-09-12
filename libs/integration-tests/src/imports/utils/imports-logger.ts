/**
 * Centralized logging messages
 */
export const LogMessages = {
  // Import section headers
  IMPORT_ASSIGNMENTS_START: 'Starting assignments import',
  IMPORT_WORKSPACES_START: 'Starting workspaces import',
  IMPORT_THEMES_START: 'Starting themes import',
  IMPORT_TENANTS_START: 'Starting tenants import',
  IMPORT_PERMISSIONS_START: 'Starting permissions import',
  IMPORT_PRODUCTS_START: 'Starting products import for product store',
  IMPORT_SLOTS_START: 'Starting slots import for product store',
  IMPORT_MICROSERVICES_START: 'Starting microservices import for product store',
  IMPORT_MICROFRONTENDS_START: 'Starting microfrontends import for product store',
  IMPORT_MANAGER_INIT: 'Initializing Import Manager',
  IMPORT_MANAGER_START: 'Starting import process',

  // Success messages
  UPLOAD_SUCCESS: 'Upload completed successfully',
  TOKEN_SUCCESS: 'Authentication token received successfully',
  CONFIG_LOADED: 'Container configuration loaded successfully',
  IMPORT_COMPLETE: 'Import process completed successfully',

  // Error messages
  UPLOAD_ERROR: 'Upload failed',
  TOKEN_ERROR: 'Failed to obtain authentication token',
  CONFIG_ERROR: 'Failed to load container configuration',
  FILE_READ_ERROR: 'Failed to read file',
  CONFIG_FILE_NOT_FOUND: 'Container info file not found',

  // Info messages
  PROCESSING_FILE: 'Processing file',
  SERVICE_AVAILABLE: 'Service available',
  SERVICE_UNAVAILABLE: 'Service not available, skipping import',
  REQUESTING_TOKEN: 'Requesting authentication token from Keycloak',
  CONTAINER_DISCOVERED: 'Container discovered',
  SERVICES_FOUND: 'Services found in configuration',
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
    const contextPart = context ? ` - (${context})` : ''
    return `${this.className}: ${timestamp} [${level}] ${this.className} ${message}${contextPart}`
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
}
