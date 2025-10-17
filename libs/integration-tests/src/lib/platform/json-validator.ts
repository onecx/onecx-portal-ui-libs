import Ajv from 'ajv'
import * as fs from 'fs'
import * as path from 'path'
import { PlatformConfig } from '../models/platform-config.interface'
import { Logger, LogMessages } from '../utils/logger'

const logger = new Logger('PlatformConfigJsonValidator')

export interface ValidationResult {
  isValid: boolean
  config?: PlatformConfig
  errors?: string[]
}

export class PlatformConfigJsonValidator {
  private ajv: Ajv
  private readonly CONFIG_FILE_PATTERN = /integration-tests\.json$/
  private readonly SEARCH_ROOT = path.join(__dirname, '../../../')
  private readonly SCHEMA = 'integration-tests.schema.json'

  constructor() {
    this.ajv = new Ajv({ allErrors: true })
  }

  /**
   * Validates the integration-tests.json file against the schema
   * @param configFilePath Optional path to config file. If not provided, searches in default location
   * @returns ValidationResult with config data if valid
   */
  validateConfigFile(configFilePath?: string): ValidationResult {
    try {
      const configPath = this.resolveConfigPath(configFilePath)

      if (!configPath) {
        return {
          isValid: false,
          errors: [
            `No valid config file found. File must be named 'integration-tests.json' or end with '.integration-tests.json' and be located anywhere in the libs/integration-tests directory.`,
          ],
        }
      }

      logger.info(LogMessages.CONFIG_LOAD_START, configPath)

      // Read and parse config file
      const configContent = this.readConfigFile(configPath)
      const config = this.parseConfigFile(configContent, configPath)

      // Load schema
      const schemaPath = path.join(__dirname, `../models/${this.SCHEMA}`)
      const schemaContent = fs.readFileSync(schemaPath, 'utf8')
      const schema = JSON.parse(schemaContent)

      // Validate against schema
      const validate = this.ajv.compile(schema)
      const isValid = validate(config)

      if (!isValid) {
        const errors = this.formatValidationErrors(validate.errors || [])
        logger.error(LogMessages.CONFIG_LOAD_ERROR, configPath, errors)
        return {
          isValid: false,
          errors,
        }
      }

      logger.success(LogMessages.CONFIG_LOAD_SUCCESS, configPath)
      return {
        isValid: true,
        config: (config as any).platformConfig,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown validation error'
      logger.error(LogMessages.CONFIG_LOAD_ERROR, undefined, error)
      return {
        isValid: false,
        errors: [errorMessage],
      }
    }
  }

  /**
   * Resolves the config file path, checking naming conventions and location
   */
  private resolveConfigPath(configFilePath?: string): string | null {
    if (configFilePath) {
      // Check if provided path meets requirements
      if (!this.CONFIG_FILE_PATTERN.test(configFilePath)) {
        return null
      }

      if (fs.existsSync(configFilePath)) {
        return configFilePath
      }
    }

    // Search recursively in the libs/integration-tests directory
    const foundFiles = this.findConfigFilesRecursively(this.SEARCH_ROOT)

    if (foundFiles.length > 0) {
      // Return the first found file
      return foundFiles[0]
    }

    return null
  }

  /**
   * Recursively search for config files in the given directory
   */
  private findConfigFilesRecursively(dir: string): string[] {
    const configFiles: string[] = []

    if (!fs.existsSync(dir)) {
      return configFiles
    }

    try {
      const items = fs.readdirSync(dir, { withFileTypes: true })

      for (const item of items) {
        const fullPath = path.join(dir, item.name)

        if (item.isDirectory()) {
          // Skip node_modules and other common directories that shouldn't contain config
          if (
            !['node_modules', '.git', 'dist', 'build', '.nx', '.github', '.angular', '.stroybook', 'tmp'].includes(
              item.name
            )
          ) {
            configFiles.push(...this.findConfigFilesRecursively(fullPath))
          }
        } else if (item.isFile() && this.CONFIG_FILE_PATTERN.test(item.name)) {
          logger.info(LogMessages.CONFIG_FOUND, `Found config file: ${fullPath}`)
          configFiles.push(fullPath)
        }
      }
    } catch (error) {
      logger.info(LogMessages.CONFIG_LOAD_START, `Error reading directory ${dir}: ${error}`)
      // Skip directories that can't be read
    }

    return configFiles
  }

  /**
   * Reads the config file content
   */
  private readConfigFile(configPath: string): string {
    try {
      return fs.readFileSync(configPath, 'utf8')
    } catch (error) {
      throw new Error(
        `Failed to read config file at ${configPath}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Parses the config file JSON content
   */
  private parseConfigFile(content: string, configPath: string): any {
    try {
      return JSON.parse(content)
    } catch (error) {
      throw new Error(
        `Invalid JSON in config file ${configPath}: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Formats AJV validation errors into readable messages
   */
  private formatValidationErrors(errors: any[]): string[] {
    return errors.map((error) => {
      const instancePath = error.instancePath || 'root'
      const message = error.message || 'Unknown validation error'
      const allowedValues = error.params?.allowedValues ? ` (allowed: ${error.params.allowedValues.join(', ')})` : ''

      return `${instancePath}: ${message}${allowedValues}`
    })
  }

  /**
   * Checks if a file path follows the naming convention
   */
  isValidConfigFileName(filePath: string): boolean {
    return this.CONFIG_FILE_PATTERN.test(filePath)
  }

  /**
   * Gets the search root directory path
   */
  getDefaultConfigPath(): string {
    return this.SEARCH_ROOT
  }
}
