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

export class ImportManager {
  private containerInfo: ContainerInfo

  constructor() {
    const containerInfoPath = path.resolve(__dirname, 'container-info.json')

    if (!fs.existsSync(containerInfoPath)) {
      throw new Error(`Container info file not found: ${containerInfoPath}`)
    }

    const containerInfoData = fs.readFileSync(containerInfoPath, 'utf-8')
    this.containerInfo = JSON.parse(containerInfoData)

    console.log('Loaded container info:', {
      keycloak: `${this.containerInfo.tokenValues.alias}:${this.containerInfo.tokenValues.port}`,
      servicesCount: Object.keys(this.containerInfo.services).length,
    })
  }

  private async getToken(): Promise<string> {
    const { tokenValues } = this.containerInfo
    const url = `http://${tokenValues.alias}:${tokenValues.port}/realms/${tokenValues.realm}/protocol/openid-connect/token`
    const params = new URLSearchParams({
      username: tokenValues.username,
      password: tokenValues.password,
      grant_type: 'password',
      client_id: tokenValues.clientId,
    })

    const response = await axios.post<{ access_token: string }>(url, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    console.log('Token received')
    return response.data.access_token
  }

  async import(): Promise<void> {
    const token = await this.getToken()
    const base = path.resolve(__dirname, '')
    const { services } = this.containerInfo

    // Helper function to get service URL
    const getServiceUrl = (serviceName: string, path = '') => {
      const service = services[serviceName]
      if (!service) {
        throw new Error(`Service '${serviceName}' not found in container info`)
      }
      return `http://${service.alias}:${service.port}${path}`
    }

    // Get all available services
    const serviceNames = Object.keys(services)

    console.log('Available services:', serviceNames)
    console.log('Using all services:', Object.fromEntries(serviceNames.map((name) => [name, getServiceUrl(name)])))

    // Tenant import - requires tenant service
    if (services['tenantSvc']) {
      await importTenants(path.join(base, 'tenant'), getServiceUrl('tenantSvc', '/exim/v1/tenants/operator'))
    }

    // Theme import - requires theme service
    if (services['themeSvc']) {
      await importThemes(
        path.join(base, 'theme'),
        async () => token,
        getServiceUrl('themeSvc', '/exim/v1/themes/operator')
      )
    }

    // Product store related imports - requires product store service
    if (services['productStoreSvc']) {
      const productStore = 'product-store'
      const productStoreBase = getServiceUrl('productStoreSvc', '/')

      await importProducts(path.join(base, productStore), productStoreBase)
      await importSlots(path.join(base, productStore), productStoreBase)
      await importMicroservices(path.join(base, productStore), productStoreBase)
      await importMicrofrontends(path.join(base, productStore), productStoreBase)
    }

    // Permission imports - requires permission service
    if (services['permissionSvc']) {
      await importPermissions(path.join(base, 'permissions'), getServiceUrl('permissionSvc'))

      await importAssignments(
        path.join(base, 'assignments'),
        async () => token,
        getServiceUrl('permissionSvc', '/exim/v1/assignments/operator')
      )
    }

    // Workspace import - requires workspace service
    if (services['workspaceSvc']) {
      await importWorkspaces(
        path.join(base, 'workspace'),
        async () => token,
        getServiceUrl('workspaceSvc', '/exim/v1/workspace/operator')
      )
    }
  }
}
