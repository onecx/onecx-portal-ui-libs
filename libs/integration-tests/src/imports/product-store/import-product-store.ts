import { readdir, readFile } from 'fs/promises'
import path from 'path'
import axios from 'axios'
import { Logger } from '../utils/imports-logger'

const logger = new Logger('ImportProductStore')

/**
 * Imports product configurations from JSON files to the product store service
 *
 * This function processes all JSON files in the `products` subdirectory and uploads them as product configurations.
 * Each JSON file represents a product configuration where the filename (without .json) becomes the product name.
 *
 * @param baseDir - Base directory path containing the `products` subdirectory with JSON files
 * @param endpointBase - Base URL for the product store service API
 *
 * @example
 * ```typescript
 * await importProducts(
 *   './data',
 *   'http://localhost:8080/onecx-product-store-svc'
 * )
 * ```
 *
 * @remarks
 * - Looks for files in `{baseDir}/products/` directory
 * - Uses PUT method for product updates
 * - Endpoint format: `{endpointBase}/operator/product/v1/update/{productName}`
 */
export async function importProducts(baseDir: string, endpointBase: string) {
  logger.info('IMPORT_PRODUCTS_START')
  const dir = path.join(baseDir, 'products')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')

    logger.info('PROCESSING_FILE', `${file} - Product: ${fileName}`)
    const data = await readFile(path.join(dir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/product/v1/update/${fileName}`

    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      logger.status('UPLOAD_SUCCESS', response.status, `Product ${fileName}`)
    } catch (err) {
      logger.error('UPLOAD_ERROR', `Product ${fileName}`, err)
    }
  }
}

/**
 * Imports slot configurations from JSON files to the product store service
 *
 * This function processes all JSON files in the `slots` subdirectory and uploads them as slot configurations.
 * Each file should follow the naming convention: `{productName}_{appId}_{slotName}.json`
 *
 * @param baseDir - Base directory path containing the `slots` subdirectory with JSON files
 * @param endpointBase - Base URL for the product store service API
 *
 * @example
 * ```typescript
 * await importSlots(
 *   './data',
 *   'http://localhost:8080/onecx-product-store-svc'
 * )
 * ```
 *
 * @remarks
 * - Looks for files in `{baseDir}/slots/` directory
 * - Uses PUT method for slot updates
 * - Endpoint format: `{endpointBase}/operator/slot/v1/{product}/{appId}`
 * - Filename format: `{product}_{appId}_{slot}.json`
 */
export async function importSlots(baseDir: string, endpointBase: string) {
  logger.info('IMPORT_SLOTS_START')
  const dir = path.join(baseDir, 'slots')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid, slot] = fileName.split('_')

    logger.info('PROCESSING_FILE', `${file} - Product: ${product}, App: ${appid}, Slot: ${slot}`)
    const data = await readFile(path.join(dir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/slot/v1/${product}/${appid}`

    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      logger.status('UPLOAD_SUCCESS', response.status, `Slot ${slot} for app ${appid} and product ${product}`)
    } catch (err) {
      logger.error('UPLOAD_ERROR', `Slot ${slot} for app ${appid} and product ${product}`, err)
    }
  }
}

/**
 * Imports microservice configurations from JSON files to the product store service
 *
 * This function processes all JSON files in the `microservices` subdirectory and uploads them as microservice configurations.
 * Each file should follow the naming convention: `{productName}_{appId}.json`
 *
 * @param baseDir - Base directory path containing the `microservices` subdirectory with JSON files
 * @param endpointBase - Base URL for the product store service API
 *
 * @example
 * ```typescript
 * await importMicroservices(
 *   './data',
 *   'http://localhost:8080/onecx-product-store-svc'
 * )
 * ```
 *
 * @remarks
 * - Looks for files in `{baseDir}/microservices/` directory
 * - Uses PUT method for microservice updates
 * - Endpoint format: `{endpointBase}/operator/ms/v1/{product}/{appId}`
 * - Filename format: `{product}_{appId}.json`
 */
export async function importMicroservices(baseDir: string, endpointBase: string) {
  logger.info('IMPORT_MICROSERVICES_START')
  const dir = path.join(baseDir, 'microservices')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid] = fileName.split('_')

    logger.info('PROCESSING_FILE', `${file} - Product: ${product}, App: ${appid}`)
    const data = await readFile(path.join(dir, file), 'utf-8')
    const endpoint = `${endpointBase}/operator/ms/v1/${product}/${appid}`

    try {
      const response = await axios.put(endpoint, JSON.parse(data), {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      logger.status('UPLOAD_SUCCESS', response.status, `Microservice ${appid} for product ${product}`)
    } catch (err) {
      logger.error('UPLOAD_ERROR', `Microservice ${appid} for product ${product}`, err)
    }
  }
}

/**
 * Imports microfrontend configurations from JSON files to the product store service
 *
 * This function processes all JSON files in the `microfrontends` subdirectory and uploads them as microfrontend configurations.
 * Each file should follow the naming convention: `{productName}_{appId}_{mfeName}.json`
 * The function automatically transforms relative URLs to direct container URLs if needed.
 *
 * @param baseDir - Base directory path containing the `microfrontends` subdirectory with JSON files
 * @param endpointBase - Base URL for the product store service API
 *
 * @example
 * ```typescript
 * await importMicrofrontends(
 *   './data',
 *   'http://localhost:8080/onecx-product-store-svc'
 * )
 * ```
 *
 * @remarks
 * - Looks for files in `{baseDir}/microfrontends/` directory
 * - Uses PUT method for microfrontend updates
 * - Endpoint format: `{endpointBase}/operator/mfe/v1/{product}/{appId}`
 * - Filename format: `{product}_{appId}_{mfeName}.json`
 * - Automatically transforms relative URLs (e.g., `/mfe/help/`) to container URLs (e.g., `http://onecx-help-ui/`)
 * - URLs already starting with `http` are used as-is
 */
export async function importMicrofrontends(baseDir: string, endpointBase: string, port: number) {
  logger.info('IMPORT_MICROFRONTENDS_START')
  const dir = path.join(baseDir, 'microfrontends')
  const files = await readdir(dir)
  for (const file of files) {
    if (!file.endsWith('.json')) continue
    const fileName = file.replace('.json', '')
    const [product, appid, mfe] = fileName.split('_')

    logger.info('PROCESSING_FILE', `${file} - Product: ${product}, App: ${appid}, MFE: ${mfe}`)
    const data = await readFile(path.join(dir, file), 'utf-8')
    const mfeData = JSON.parse(data)

    // Transform URLs if they don't start with http
    const appName = mfeData.appName
    if (appName && mfeData.remoteBaseUrl && !mfeData.remoteBaseUrl.startsWith('http')) {
      const originalBaseUrl = mfeData.remoteBaseUrl
      mfeData.remoteBaseUrl = `http://${appName}:${port}/`
      logger.info('PROCESSING_FILE', `URL Transform - BaseURL: ${originalBaseUrl} -> ${mfeData.remoteBaseUrl}`)
    }

    if (appName && mfeData.remoteEntry && !mfeData.remoteEntry.startsWith('http')) {
      const originalEntry = mfeData.remoteEntry
      mfeData.remoteEntry = `http://${appName}:${port}/remoteEntry.js`
      logger.info('PROCESSING_FILE', `URL Transform - Entry: ${originalEntry} -> ${mfeData.remoteEntry}`)
    }

    const endpoint = `${endpointBase}/operator/mfe/v1/${product}/${appid}`
    try {
      const response = await axios.put(endpoint, mfeData, {
        headers: { 'Content-Type': 'application/json' },
        validateStatus: () => true,
      })
      logger.status('UPLOAD_SUCCESS', response.status, `MFE ${mfe} for app ${appid} for product ${product}`)
    } catch (err) {
      logger.error('UPLOAD_ERROR', `MFE ${mfe} for app ${appid} for product ${product}`, err)
    }
  }
}
