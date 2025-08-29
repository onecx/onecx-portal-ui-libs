import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'
import { Logger } from '../utils/imports-logger'

const logger = new Logger('ImportPermissions')

/**
 * Imports permission configurations from JSON files to the permission service
 *
 * This function processes all JSON files in the specified directory and uploads them as permission configurations.
 * Each file should follow the naming convention: `{productName}_{appId}.json`
 * The function constructs API endpoints dynamically based on the product and app ID extracted from filenames.
 *
 * @param permissionsDir - Directory path containing the permission JSON files
 * @param endpointBase - Base URL for the permission service API
 *
 * @example
 * ```typescript
 * await importPermissions(
 *   './data/permissions',
 *   'http://localhost:8080/onecx-permission-svc'
 * )
 * ```
 *
 * @remarks
 * - Uses PUT method for permission updates
 * - Endpoint format: `{endpointBase}/operator/v1/{product}/{appId}`
 * - No authentication tokens required as it uses operator endpoints
 */
export async function importPermissions(permissionsDir: string, endpointBase: string) {
  logger.info('IMPORT_PERMISSIONS_START')
  const files = await readdir(permissionsDir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid] = fileName.split('_')

    logger.info('PROCESSING_FILE', `${file} - Product: ${product}, App: ${appid}`)
    const data = await readFile(path.join(permissionsDir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/v1/${product}/${appid}`

    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      logger.status('UPLOAD_SUCCESS', response.status, `Permissions for app ${appid} and product ${product}`)
    } catch (err) {
      logger.error('UPLOAD_ERROR', `Permissions for app ${appid} and product ${product}`, err)
    }
  }
}
