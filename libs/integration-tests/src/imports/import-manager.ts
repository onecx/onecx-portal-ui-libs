import axios from 'axios'
import * as path from 'path'
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

export class ImportManager {
  private async getToken(retries = 5, delayMs = 3000): Promise<string> {
    const url = 'http://keycloak-app:8080/realms/onecx/protocol/openid-connect/token'
    const params = new URLSearchParams({
      username: 'onecx',
      password: 'onecx',
      grant_type: 'password',
      client_id: 'onecx-shell-ui-client',
    })

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const response = await axios.post<{ access_token: string }>(url, params, {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        console.log(`Token received on attempt ${attempt}`)
        return response.data.access_token
      } catch (error) {
        console.warn(`Attempt ${attempt} failed: ${(error as Error).message}`)
        if (attempt === retries) throw error
        await new Promise((res) => setTimeout(res, delayMs))
      }
    }

    throw new Error('Failed to get token after retries')
  }

  async import(): Promise<void> {
    const token = await this.getToken()
    const base = path.resolve(__dirname, '')
    const http = 'http://'
    const port = '8080'
    const productStoreBase = `${http}onecx-product-store-svc:${port}/`

    await importTenants(path.join(base, 'tenant'), `${http}onecx-tenant-svc:${port}/exim/v1/tenants/operator`)

    await importThemes(
      path.join(base, 'theme'),
      async () => token,
      `${http}onecx-theme-svc:${port}/exim/v1/themes/operator`
    )

    await importProducts(path.join(base, 'product-store'), productStoreBase)

    await importSlots(path.join(base, 'product-store'), productStoreBase)

    await importMicroservices(path.join(base, 'product-store'), productStoreBase)

    await importMicrofrontends(path.join(base, 'product-store'), productStoreBase)

    await importPermissions(path.join(base, 'permissions'), `${http}onecx-permission-svc:${port}`)

    await importAssignments(
      path.join(base, 'assignments'),
      async () => token,
      `${http}onecx-permission-svc:${port}/exim/v1/assignments/operator`
    )

    await importWorkspaces(
      path.join(base, 'workspace'),
      async () => token,
      `${http}onecx-workspace-svc:${port}/exim/v1/workspace/operator`
    )
  }
}
