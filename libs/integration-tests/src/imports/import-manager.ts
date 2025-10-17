import axios from 'axios'
import * as path from 'path'
import * as fs from 'fs'
import { importTenants } from './tenant/import-tenants'
import { importThemes } from './theme/import-themes'
import { importAssignments } from './assignments/import-assignments'
import { importWorkspaces } from './workspace/import-workspaces'
import {
  importMicrofrontends,
  importMicroservices,
  importProducts,
  importSlots,
} from './product-store/import-product-store'
import { importPermissions } from './permissions/import-permissions'
import { Logger } from './utils/imports-logger'

const logger = new Logger('ImportManager')

/**
 * Container information interface containing authentication and service details
 */
export interface ContainerInfo {
  tokenValues: {
    username: string
    password: string
    realm: string
    alias: string
    port: number
    clientId: string
  }
  services: Record<string, { alias: string; port: number }>
}

/**
 * Import Manager class for orchestrating data imports across OneCX services
 *
 * This class manages the complete data import process for a OneCX platform setup,
 * including authentication, service discovery, and coordinated imports of various data types.
 */
export class ImportManager {
  private containerInfo!: ContainerInfo

  /**
   * Initializes the ImportManager with container configuration
   *
   * @param containerInfoPath - Path to the JSON file containing container and service information
   * @throws Error if the configuration file cannot be found or parsed
   */
  constructor(containerInfoPath: string) {
    logger.info('IMPORT_MANAGER_INIT')

    if (!fs.existsSync(containerInfoPath)) {
      logger.error('CONFIG_FILE_NOT_FOUND', containerInfoPath)
    }

    const containerInfoData = fs.readFileSync(containerInfoPath, 'utf-8')
    this.containerInfo = JSON.parse(containerInfoData)

    logger.success('CONFIG_LOADED')
    logger.info(
      'CONTAINER_DISCOVERED',
      `Keycloak: ${this.containerInfo.tokenValues.alias}:${this.containerInfo.tokenValues.port}`
    )
    logger.info('SERVICES_FOUND', `${Object.keys(this.containerInfo.services).length} services configured`)
  }

  /**
   * Executes the complete data import process for all OneCX containers
   *
   * This method orchestrates the import of various data types including tenants, themes,
   * workspaces, product store data, permissions, and assignments. The imports are executed
   * in a specific order to respect dependencies between services.
   *
   * @returns Promise that resolves when all imports are completed
   * @throws Error if any critical import step fails
   *
   * @example
   * ```typescript
   * const importManager = new ImportManager('./container-info.json')
   * await importManager.import()
   * ```
   *
   * @remarks
   * Import order:
   * 1. Tenants (foundational)
   * 2. Themes (tenant-specific)
   * 3. Product Store data (products, slots, microservices, microfrontends)
   * 4. Permissions (product-specific)
   * 5. Workspaces (depends on products)
   * 6. Assignments (final step)
   */
  async import(): Promise<void> {
    logger.info('IMPORT_MANAGER_START')

    const token = await this.getToken()
    const base = path.resolve(__dirname, '')
    const { services } = this.containerInfo

    // Get all available services
    const serviceNames = Object.keys(services)
    logger.info('SERVICES_FOUND', `Available services: ${serviceNames.join(', ')}`)

    // Tenant import - requires tenant service
    if (services['onecx-tenant-svc']) {
      logger.info('SERVICE_AVAILABLE', 'onecx-tenant-svc')
      await importTenants(
        path.join(base, 'tenant'),
        this.getServiceUrl('onecx-tenant-svc', '/exim/v1/tenants/operator')
      )
    } else {
      logger.info('SERVICE_UNAVAILABLE', 'onecx-tenant-svc - skipping tenant import')
    }

    // Theme import - requires theme service
    if (services['onecx-theme-svc']) {
      logger.info('SERVICE_AVAILABLE', 'onecx-theme-svc')
      await importThemes(
        path.join(base, 'theme'),
        async () => token,
        this.getServiceUrl('onecx-theme-svc', '/exim/v1/themes/operator')
      )
    } else {
      logger.info('SERVICE_UNAVAILABLE', 'onecx-theme-svc - skipping theme import')
    }

    // Product store related imports - requires product store service
    if (services['onecx-product-store-svc']) {
      const productStore = 'product-store'
      logger.info('SERVICE_AVAILABLE', 'onecx-product-store-svc')
      const productStoreBase = this.getServiceUrl('onecx-product-store-svc', '/')

      await importProducts(path.join(base, productStore), productStoreBase)
      await importSlots(path.join(base, productStore), productStoreBase)
      await importMicroservices(path.join(base, productStore), productStoreBase)
      await importMicrofrontends(
        path.join(base, productStore),
        productStoreBase,
        this.getServicePort('onecx-product-store-svc')
      )
    } else {
      logger.info('SERVICE_UNAVAILABLE', 'onecx-product-store-svc - skipping product store imports')
    }

    // Permission imports - requires permission service
    if (services['onecx-permission-svc']) {
      logger.info('SERVICE_AVAILABLE', 'onecx-permission-svc')
      await importPermissions(path.join(base, 'permissions'), this.getServiceUrl('onecx-permission-svc'))

      await importAssignments(
        path.join(base, 'assignments'),
        async () => token,
        this.getServiceUrl('onecx-permission-svc', '/exim/v1/assignments/operator')
      )
    } else {
      logger.info('SERVICE_UNAVAILABLE', 'onecx-permission-svc - skipping permission imports')
    }

    // Workspace import - requires workspace service
    if (services['onecx-workspace-svc']) {
      logger.info('SERVICE_AVAILABLE', 'onecx-workspace-svc')
      await importWorkspaces(
        path.join(base, 'workspace'),
        async () => token,
        this.getServiceUrl('onecx-workspace-svc', '/exim/v1/workspace/operator')
      )
    } else {
      logger.info('SERVICE_UNAVAILABLE', 'onecx-workspace-svc - skipping workspace import')
    }

    logger.success('IMPORT_COMPLETE')
  }

  /**
   * Retrieves an authentication token from the Keycloak service
   *
   * @returns Promise resolving to the access token
   * @throws Error if token retrieval fails
   * @private
   */
  private async getToken(): Promise<string> {
    logger.info('REQUESTING_TOKEN')
    const { tokenValues } = this.containerInfo
    const url = `http://${tokenValues.alias}:${tokenValues.port}/realms/${tokenValues.realm}/protocol/openid-connect/token`
    const params = new URLSearchParams({
      username: tokenValues.username,
      password: tokenValues.password,
      grant_type: 'password',
      client_id: tokenValues.clientId,
    })

    try {
      const response = await axios.post<{ access_token: string }>(url, params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      logger.success('TOKEN_SUCCESS')
      return response.data.access_token
    } catch (error) {
      logger.error('TOKEN_ERROR', undefined, error)
      throw error
    }
  }

  private getServiceUrl = (serviceName: string, path = '') => {
    const { services } = this.containerInfo
    const service = services[serviceName]
    if (!service) {
      logger.error('SERVICE_UNAVAILABLE', serviceName)
      throw new Error(`Service '${serviceName}' not found in container info`)
    }
    return `http://${service.alias}:${service.port}${path}`
  }

  private getServicePort = (serviceName: string) => {
    const { services } = this.containerInfo
    const service = services[serviceName]
    if (!service) {
      logger.error('SERVICE_UNAVAILABLE', serviceName)
      throw new Error(`Service '${serviceName}' not found in container info`)
    }
    return service.port
  }
}
