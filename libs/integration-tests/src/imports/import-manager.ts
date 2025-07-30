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

interface ContainerInfo {
  keycloak: {
    realm: string
    alias: string
    port: number
  }
  services: Record<string, { alias: string; port: number }>
}
enum CONTAINER {
  POSTGRES = 'postgres',
  KEYCLOAK = 'keycloak',
  IAMKC_SVC = 'iamKcSvcContainer',
  WORKSPACE_SVC = 'workspaceSvcContainer',
  USER_PROFILE_SVC = 'userProfileSvcContainer',
  THEME_SVC = 'themeSvcContainer',
  TENANT_SVC = 'tenantSvcContainer',
  PRODUCT_STORE_SVC = 'productStoreSvcContainer',
  PERMISSION_SVC = 'permissionSvcContainer',
  SHELL_BFF = 'shellBff',
  SHELL_UI = 'shellUi',
  IMPORT_MANAGER = 'importManager',
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
      keycloak: `${this.containerInfo.keycloak.alias}:${this.containerInfo.keycloak.port}`,
      servicesCount: Object.keys(this.containerInfo.services).length,
    })
  }

  private async getToken(): Promise<string> {
    const { keycloak } = this.containerInfo
    const url = `http://${keycloak.alias}:${keycloak.port}/realms/${keycloak.realm}/protocol/openid-connect/token`
    const params = new URLSearchParams({
      username: keycloak.realm,
      password: keycloak.realm,
      grant_type: 'password',
      client_id: 'onecx-shell-ui-client',
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

    const getService = (serviceName: string) => {
      const service = services[serviceName]
      if (!service) {
        throw new Error(`Service '${serviceName}' not found in container info`)
      }
      return service
    }

    const workspaceSvc = getService(CONTAINER.WORKSPACE_SVC)
    const themeSvc = getService(CONTAINER.THEME_SVC)
    const tenantSvc = getService(CONTAINER.TENANT_SVC)
    const productStoreSvc = getService(CONTAINER.PRODUCT_STORE_SVC)
    const permissionSvc = getService(CONTAINER.PERMISSION_SVC)

    console.log('Available services:', Object.keys(services))
    console.log('Using services:', {
      workspace: `${workspaceSvc.alias}:${workspaceSvc.port}`,
      theme: `${themeSvc.alias}:${themeSvc.port}`,
      tenant: `${tenantSvc.alias}:${tenantSvc.port}`,
      productStore: `${productStoreSvc.alias}:${productStoreSvc.port}`,
      permission: `${permissionSvc.alias}:${permissionSvc.port}`,
    })

    const productStoreBase = `http://${productStoreSvc.alias}:${productStoreSvc.port}/`

    await importTenants(
      path.join(base, 'tenant'),
      `http://${tenantSvc.alias}:${tenantSvc.port}/exim/v1/tenants/operator`
    )

    await importThemes(
      path.join(base, 'theme'),
      async () => token,
      `http://${themeSvc.alias}:${themeSvc.port}/exim/v1/themes/operator`
    )

    await importProducts(path.join(base, 'product-store'), productStoreBase)

    await importSlots(path.join(base, 'product-store'), productStoreBase)

    await importMicroservices(path.join(base, 'product-store'), productStoreBase)

    await importMicrofrontends(path.join(base, 'product-store'), productStoreBase)

    await importPermissions(path.join(base, 'permissions'), `http://${permissionSvc.alias}:${permissionSvc.port}`)

    await importAssignments(
      path.join(base, 'assignments'),
      async () => token,
      `http://${permissionSvc.alias}:${permissionSvc.port}/exim/v1/assignments/operator`
    )

    await importWorkspaces(
      path.join(base, 'workspace'),
      async () => token,
      `http://${workspaceSvc.alias}:${workspaceSvc.port}/exim/v1/workspace/operator`
    )
  }
}
