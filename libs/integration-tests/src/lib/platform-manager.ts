import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from './containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from './containers/core/onecx-postgres'
import { POSTGRES, KEYCLOAK, onecxSvcImages, onecxShellImages, NODE_20 } from './config/env'
import { WorkspaceSvcContainer } from './containers/svc/onecx-workspace-svc'
import { UserProfileSvcContainer } from './containers/svc/onecx-user-profile-svc'
import { ThemeSvcContainer } from './containers/svc/onecx-theme-svc'
import { TenantSvcContainer } from './containers/svc/onecx-tenant-svc'
import { ProductStoreSvcContainer } from './containers/svc/onecx-product-store-svc'
import { IamKcContainer } from './containers/svc/onecx-iam-kc-svc'
import { PermissionSvcContainer } from './containers/svc/onecx-permission-svc'
import axios from 'axios'
import { ImportManagerContainer } from './containers/svc/import-container'
import { ShellBffContainer } from './containers/bff/onecx-shell-bff'
import { ShellUiContainer } from './containers/ui/onecx-shell-ui'
import { StartedUiContainer } from './containers/abstract/onecx-ui'
import { StartedSvcContainer } from './containers/abstract/onecx-svc'
import { StartedBffContainer } from './containers/abstract/onecx-bff'

export type AllowedContainerTypes =
  | StartedOnecxPostgresContainer
  | StartedOnecxKeycloakContainer
  | StartedSvcContainer
  | StartedBffContainer
  | StartedUiContainer

export class PlatformManager {
  private network?: StartedNetwork

  private startedContainers: Map<string, AllowedContainerTypes> = new Map()

  async startAllServices() {
    this.network = await new Network().start()
    const postgres: StartedOnecxPostgresContainer = await this.startPostgresContainer(this.network)
    this.addContainer('postgres', postgres)

    const keycloak = await this.startKeycloakContainer(postgres, this.network)
    this.addContainer('keycloak', keycloak)

    const iamKcSvcContainer = await new IamKcContainer(onecxSvcImages.ONECX_IAM_KC_SVC, keycloak)
      .withNetwork(this.network)
      .start()
    this.addContainer('iamKcSvcContainer', iamKcSvcContainer)

    const workspaceSvcContainer = await new WorkspaceSvcContainer(
      onecxSvcImages.ONECX_WORKSPACE_SVC,
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer('workspaceSvcContrainer', workspaceSvcContainer)

    const userProfileSvcContainer = await new UserProfileSvcContainer(
      onecxSvcImages.ONECX_USER_PROFILE_SVC,
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer('userProfileSvcContainer', userProfileSvcContainer)

    const themeSvcContainer = await new ThemeSvcContainer(onecxSvcImages.ONECX_THEME_SVC, postgres, keycloak)
      .withNetwork(this.network)
      .start()
    this.addContainer('themeSvcContainer', themeSvcContainer)

    const tenantSvcContainer = await new TenantSvcContainer(onecxSvcImages.ONECX_TENANT_SVC, postgres, keycloak)
      .withNetwork(this.network)
      .start()
    this.addContainer('tenantSvcContainer', tenantSvcContainer)

    const productStoreSvcContainer = await new ProductStoreSvcContainer(
      onecxSvcImages.ONECX_PRODUCT_STORE_SVC,
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer('productStoreSvcContainer', productStoreSvcContainer)

    const permissionSvcContainer = await new PermissionSvcContainer(
      onecxSvcImages.ONECX_PERMISSION_SVC,
      postgres,
      keycloak,
      tenantSvcContainer
    )
      .withNetwork(this.network)
      .start()
    this.addContainer('permissionSvcContainer', permissionSvcContainer)

    const shellBffContainer = await new ShellBffContainer(onecxShellImages.ONECX_SHELL_BFF, keycloak)
      .withNetwork(this.network)
      .start()
    this.addContainer('shellBffContainer', shellBffContainer)

    let shellUiContainer: StartedUiContainer

    if (shellBffContainer) {
      shellUiContainer = await new ShellUiContainer(onecxShellImages.ONECX_SHELL_UI, keycloak)
        .withNetwork(this.network)
        .start()
      this.addContainer('shellUiContainer', shellUiContainer)
    } else {
      throw new Error('Shell BFF Container not started')
    }

    await this.importDefaultData(this.network)
  }

  private addContainer<T extends AllowedContainerTypes>(key: string, container: T): void {
    this.startedContainers.set(key, container)
  }

  private async startPostgresContainer(network: StartedNetwork): Promise<StartedOnecxPostgresContainer> {
    return await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
  }

  private async startKeycloakContainer(
    postgres: StartedOnecxPostgresContainer,
    network: StartedNetwork
  ): Promise<StartedOnecxKeycloakContainer> {
    return await new OnecxKeycloakContainer(KEYCLOAK, postgres).withNetwork(network).start()
  }

  async stopAllServices() {
    const containers = Array.from(this.startedContainers.values()).reverse()
    for (const container of containers) {
      try {
        await container.stop()
      } catch (e) {
        console.error(`Error stopping container: ${e}`)
      }
    }
    this.startedContainers.clear()

    if (this.network) {
      await this.network.stop()
      this.network = undefined
    }
  }

  private async checkContainerHealth(container: any, portGetter: () => number, path = '/q/health'): Promise<boolean> {
    try {
      const port = container.getMappedPort(portGetter())
      const url = `http://localhost:${port}${path}`
      const response = await axios.get(url)
      return response.status === 200
    } catch {
      return false
    }
  }

  private async checkKeycloakHealth(container: any, portGetter: () => number) {
    try {
      const port = container.getMappedPort(portGetter())
      const realm = container.getRealm()
      const url = `http://localhost:${port}/realms/${realm}/.well-known/openid-configuration`
      const response = await axios.get(url)
      return response.status === 200
    } catch {
      return false
    }
  }

  async checkAllHealthy(): Promise<{ name: string; healthy: boolean }[]> {
    const results: { name: string; healthy: boolean }[] = []

    for (const [name, container] of this.startedContainers.entries()) {
      let healthy = true

      if (name === 'postgres') {
        healthy = true
      } else if (name === 'shellUiContainer') {
        healthy = true
      } else if (name === 'keycloak') {
        healthy = await this.checkKeycloakHealth(container, () => container.getPort())
      } else {
        healthy = await this.checkContainerHealth(container, () => container.getPort())
      }
      results.push({ name, healthy })
    }

    return results
  }

  async importDefaultData(network: StartedNetwork) {
    console.log('Starting ImportManagerContainer')
    const importer = await new ImportManagerContainer(NODE_20).withNetwork(network).start()

    try {
      console.log('Monitoring ImportManagerContainer logs...')
      let taskCompleted = false

      const logStream = await importer.logs()
      logStream
        .on('data', (line) => {
          console.log(`ImportManagerContainer: ${line.toString()}`)
          if (line.toString().includes('Import succesfully finished')) {
            taskCompleted = true
          }
        })
        .on('err', (line) => {
          console.error(`ImportManagerContainer Error: ${line.toString()}`)
        })
        .on('end', () => {
          console.log('Log stream closed.')
        })

      while (!taskCompleted) {
        await new Promise((resolve) => setTimeout(resolve, 1000)) // 1 Sekunde warten
      }
      console.log('ImportManagerContainer task completed successfully.')
    } finally {
      console.log('Stopping ImportManagerContainer...')
      await importer.stop()
    }
  }
}
