import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'
import { Logger } from '../utils/imports-logger'

const logger = new Logger('ImportTenants')

/**
 * Imports tenant configurations from JSON files to the tenant service
 *
 * This function processes all JSON files in the specified directory and uploads them as tenant configurations.
 * Unlike other import functions, tenant import doesn't require authentication tokens as it operates at the system level.
 *
 * @param tenantsDir - Directory path containing the tenant JSON files
 * @param endpoint - API endpoint URL for tenant import operations
 *
 * @example
 * ```typescript
 * await importTenants(
 *   './data/tenants',
 *   'http://localhost:8080/onecx-tenant-svc/internal/tenants'
 * )
 * ```
 */
export async function importTenants(tenantsDir: string, endpoint: string) {
  logger.info('IMPORT_TENANTS_START')
  const files = await readdir(tenantsDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue

    logger.info('PROCESSING_FILE', file)
    const data = await readFile(path.join(tenantsDir, file), 'utf-8')

    try {
      const response = await axios.post(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      logger.status('UPLOAD_SUCCESS', response.status, `Tenants from ${file}`)
    } catch (err) {
      logger.error('UPLOAD_ERROR', `Tenants from ${file}`, err)
    }
  }
}
