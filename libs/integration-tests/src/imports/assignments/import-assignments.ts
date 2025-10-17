import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'
import { Logger } from '../utils/imports-logger'

const logger = new Logger('ImportAssignments')

/**
 * Imports assignment configurations from JSON files to the assignment service
 *
 * This function processes all JSON files in the specified directory and uploads them as assignment configurations.
 * Each file can follow two naming conventions:
 * - `{tenantName}_{productName}.json` - for tenant-specific product assignments
 * - `{tenantName}.json` - for general tenant assignments (tenant name used as product name)
 *
 * @param assignmentsDir - Directory path containing the assignment JSON files
 * @param getTokenForTenant - Function to retrieve authentication token for a specific tenant
 * @param endpoint - API endpoint URL for assignment import operations
 *
 * @example
 * ```typescript
 * await importAssignments(
 *   './data/assignments',
 *   (tenant) => getAuthToken(tenant),
 *   'http://localhost:8080/onecx-assignment-svc/internal/assignments'
 * )
 * ```
 *
 * @remarks
 * - Supports flexible filename parsing with underscore separator
 * - Uses POST method for assignment creation
 * - Requires tenant-specific authentication tokens
 */
export async function importAssignments(
  assignmentsDir: string,
  getTokenForTenant: (tenant: string) => Promise<string>,
  endpoint: string
) {
  logger.info('IMPORT_ASSIGNMENTS_START')
  const files = await readdir(assignmentsDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue

    const fileNameWithoutExt = file.replace(/\.json$/, '')
    let tenant: string
    let product: string

    if (fileNameWithoutExt.includes('_')) {
      const parts = fileNameWithoutExt.split('_')
      tenant = parts[0]
      product = parts[1] || parts[0]
    } else {
      tenant = fileNameWithoutExt
      product = fileNameWithoutExt
    }

    logger.info('PROCESSING_FILE', `${file} - Tenant: ${tenant}, Product: ${product}`)
    const token = await getTokenForTenant(tenant)
    const data = await readFile(path.join(assignmentsDir, file), 'utf-8')

    try {
      const response = await axios.post(endpoint, JSON.parse(data), {
        headers: {
          'apm-principal-token': token,
          'Content-Type': 'application/json',
        },
        validateStatus: () => true, // accept all status codes
      })
      logger.status('UPLOAD_SUCCESS', response.status, `Assignments for product ${product}`)
    } catch (err) {
      logger.error('UPLOAD_ERROR', `Assignments for product ${product}`, err)
    }
  }
}
