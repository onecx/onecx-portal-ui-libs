import { logger } from '@nx/devkit'

/**
 * Prints a warning message if there are affected files.
 * @param warning The warning message to print.
 * @param affectedFiles An array of affected file paths.
 */
export function printWarnings(warning: string, affectedFiles: string[]) {
  if (affectedFiles.length > 0) {
    logger.warn(`${warning} Found in: ${affectedFiles.join(',')}`)
  }
} 