import { StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { WorkspaceSvcContainer } from '../containers/svc/onecx-workspace-svc'
import { UserProfileSvcContainer } from '../containers/svc/onecx-user-profile-svc'
import { ThemeSvcContainer } from '../containers/svc/onecx-theme-svc'
import { TenantSvcContainer } from '../containers/svc/onecx-tenant-svc'
import { ProductStoreSvcContainer } from '../containers/svc/onecx-product-store-svc'
import { IamKcContainer } from '../containers/svc/onecx-iam-kc-svc'
import { PermissionSvcContainer } from '../containers/svc/onecx-permission-svc'
import { ShellBffContainer } from '../containers/bff/onecx-shell-bff'
import { ShellUiContainer } from '../containers/ui/onecx-shell-ui'
import { StartedSvcContainer } from '../containers/abstract/onecx-svc'
import { CONTAINER } from '../model/container.enum'
import { PlatformConfig } from '../model/platform-config.interface'
import { ImageResolver } from './image-resolver'
import { OnecxServiceImage, OnecxShellImage } from '../config/env'
import type { AllowedContainerTypes } from '../model/allowed-container.types'

export class ContainerStarter {
  constructor(
    private imageResolver: ImageResolver,
    private network: StartedNetwork,
    private addContainer: (key: CONTAINER, container: AllowedContainerTypes) => void
  ) {}

  /**
   * Start core services (PostgreSQL and Keycloak)
   */
  async startCoreServices(): Promise<StartedOnecxPostgresContainer> {
    const postgres = await this.startPostgresContainer()
    this.addContainer(CONTAINER.POSTGRES, postgres)

    const keycloak = await this.startKeycloakContainer(postgres)
    this.addContainer(CONTAINER.KEYCLOAK, keycloak)

    return postgres
  }

  /**
   * Start backend services based on configuration
   */
  async startBackendServices(
    config: PlatformConfig,
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer,
    getContainer: (service: CONTAINER) => AllowedContainerTypes | undefined
  ): Promise<void> {
    const services = config.services || {}

    if (services.iamKc) {
      await this.startIamKcService(keycloak)
    }

    if (services.workspace) {
      await this.startWorkspaceService(postgres, keycloak)
    }

    if (services.userProfile) {
      await this.startUserProfileService(postgres, keycloak)
    }

    if (services.theme) {
      await this.startThemeService(postgres, keycloak)
    }

    if (services.tenant) {
      await this.startTenantService(postgres, keycloak)
    }

    if (services.productStore) {
      await this.startProductStoreService(postgres, keycloak)
    }

    if (services.permission) {
      await this.startPermissionService(postgres, keycloak, getContainer)
    }
  }

  /**
   * Start BFF services based on configuration
   */
  async startBffServices(config: PlatformConfig, keycloak: StartedOnecxKeycloakContainer): Promise<void> {
    const bff = config.bff || {}

    if (bff.shell) {
      await this.startShellBffService(keycloak)
    }
  }

  /**
   * Start UI services based on configuration
   */
  async startUiServices(
    config: PlatformConfig,
    keycloak: StartedOnecxKeycloakContainer,
    getContainer: (service: CONTAINER) => AllowedContainerTypes | undefined
  ): Promise<void> {
    const ui = config.ui || {}

    if (ui.shell) {
      await this.startShellUiService(keycloak, getContainer)
    }
  }

  // Private methods for starting individual services
  private async startPostgresContainer(): Promise<StartedOnecxPostgresContainer> {
    return await new OnecxPostgresContainer(this.imageResolver.getPostgresImage()).withNetwork(this.network).start()
  }

  private async startKeycloakContainer(
    postgres: StartedOnecxPostgresContainer
  ): Promise<StartedOnecxKeycloakContainer> {
    return await new OnecxKeycloakContainer(this.imageResolver.getKeycloakImage(), postgres)
      .withNetwork(this.network)
      .start()
  }

  private async startIamKcService(keycloak: StartedOnecxKeycloakContainer): Promise<void> {
    const container = await new IamKcContainer(
      this.imageResolver.getServiceImage(OnecxServiceImage.ONECX_IAM_KC_SVC),
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.IAMKC_SVC, container)
  }

  private async startWorkspaceService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const container = await new WorkspaceSvcContainer(
      this.imageResolver.getServiceImage(OnecxServiceImage.ONECX_WORKSPACE_SVC),
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.WORKSPACE_SVC, container)
  }

  private async startUserProfileService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const container = await new UserProfileSvcContainer(
      this.imageResolver.getServiceImage(OnecxServiceImage.ONECX_USER_PROFILE_SVC),
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.USER_PROFILE_SVC, container)
  }

  private async startThemeService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const container = await new ThemeSvcContainer(
      this.imageResolver.getServiceImage(OnecxServiceImage.ONECX_THEME_SVC),
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.THEME_SVC, container)
  }

  private async startTenantService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const container = await new TenantSvcContainer(
      this.imageResolver.getServiceImage(OnecxServiceImage.ONECX_TENANT_SVC),
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.TENANT_SVC, container)
  }

  private async startProductStoreService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const container = await new ProductStoreSvcContainer(
      this.imageResolver.getServiceImage(OnecxServiceImage.ONECX_PRODUCT_STORE_SVC),
      postgres,
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.PRODUCT_STORE_SVC, container)
  }

  private async startPermissionService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer,
    getContainer: (service: CONTAINER) => AllowedContainerTypes | undefined
  ): Promise<void> {
    // Permission service depends on tenant service
    const tenantSvcContainer = getContainer(CONTAINER.TENANT_SVC)
    if (!tenantSvcContainer) {
      throw new Error('Permission service requires Tenant service to be started first')
    }

    const container = await new PermissionSvcContainer(
      this.imageResolver.getServiceImage(OnecxServiceImage.ONECX_PERMISSION_SVC),
      postgres,
      keycloak,
      tenantSvcContainer as StartedSvcContainer
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.PERMISSION_SVC, container)
  }

  private async startShellBffService(keycloak: StartedOnecxKeycloakContainer): Promise<void> {
    const container = await new ShellBffContainer(
      this.imageResolver.getShellImage(OnecxShellImage.ONECX_SHELL_BFF),
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.SHELL_BFF, container)
  }

  private async startShellUiService(
    keycloak: StartedOnecxKeycloakContainer,
    getContainer: (service: CONTAINER) => AllowedContainerTypes | undefined
  ): Promise<void> {
    // Shell UI depends on Shell BFF
    const shellBffContainer = getContainer(CONTAINER.SHELL_BFF)
    if (!shellBffContainer) {
      throw new Error('Shell UI requires Shell BFF to be started first')
    }

    const container = await new ShellUiContainer(
      this.imageResolver.getShellImage(OnecxShellImage.ONECX_SHELL_UI),
      keycloak
    )
      .withNetwork(this.network)
      .start()
    this.addContainer(CONTAINER.SHELL_UI, container)
  }
}
