import { logger } from '@nx/devkit'
export function printWarnings(warning: string, affectedFiles: string[]) {
    if (affectedFiles.length > 0) {
        logger.warn(warning)
        logger.warn(`Found in:`)
        affectedFiles.forEach((file) => {
          logger.warn(`  - ${file}`)
        })
      }
} 