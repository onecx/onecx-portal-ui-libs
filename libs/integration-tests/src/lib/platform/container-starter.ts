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
import { OnecxService, OnecxBff, OnecxUi } from '../config/env'
import type { AllowedContainerTypes } from '../model/allowed-container.types'
import { loggingEnabled } from '../utils/logging-config.util'

export class ContainerStarter {
  constructor(
    private imageResolver: ImageResolver,
    private network: StartedNetwork,
    private addContainer: (key: CONTAINER, container: AllowedContainerTypes) => void,
    private readonly config: PlatformConfig
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
    await this.startIamKcService(keycloak)

    await this.startWorkspaceService(postgres, keycloak)

    await this.startUserProfileService(postgres, keycloak)

    await this.startThemeService(postgres, keycloak)

    await this.startTenantService(postgres, keycloak)

    await this.startProductStoreService(postgres, keycloak)

    await this.startPermissionService(postgres, keycloak, getContainer)
  }

  /**
   * Start BFF services based on configuration
   */
  async startBffServices(config: PlatformConfig, keycloak: StartedOnecxKeycloakContainer): Promise<void> {
    await this.startShellBffService(keycloak)
  }

  /**
   * Start UI services based on configuration
   */
  async startUiServices(
    config: PlatformConfig,
    keycloak: StartedOnecxKeycloakContainer,
    getContainer: (service: CONTAINER) => AllowedContainerTypes | undefined
  ): Promise<void> {
    await this.startShellUiService(keycloak, getContainer)
  }

  // Private methods for starting individual services
  private async startPostgresContainer(): Promise<StartedOnecxPostgresContainer> {
    const postgresImage = await this.imageResolver.getPostgresImage(this.config)
    return await new OnecxPostgresContainer(postgresImage)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
  }

  private async startKeycloakContainer(
    postgres: StartedOnecxPostgresContainer
  ): Promise<StartedOnecxKeycloakContainer> {
    const keycloakImage = await this.imageResolver.getKeycloakImage(this.config)
    return await new OnecxKeycloakContainer(keycloakImage, postgres)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
  }

  private async startIamKcService(keycloak: StartedOnecxKeycloakContainer): Promise<void> {
    const iamKcImage = await this.imageResolver.getServiceImage(OnecxService.IAM_KC_SVC, this.config)
    const container = await new IamKcContainer(iamKcImage, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
    this.addContainer(CONTAINER.IAMKC_SVC, container)
  }

  private async startWorkspaceService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const workspaceImage = await this.imageResolver.getServiceImage(OnecxService.WORKSPACE_SVC, this.config)
    const container = await new WorkspaceSvcContainer(workspaceImage, postgres, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
    this.addContainer(CONTAINER.WORKSPACE_SVC, container)
  }

  private async startUserProfileService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const userProfileImage = await this.imageResolver.getServiceImage(OnecxService.USER_PROFILE_SVC, this.config)
    const container = await new UserProfileSvcContainer(userProfileImage, postgres, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
    this.addContainer(CONTAINER.USER_PROFILE_SVC, container)
  }

  private async startThemeService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const themeImage = await this.imageResolver.getServiceImage(OnecxService.THEME_SVC, this.config)
    const container = await new ThemeSvcContainer(themeImage, postgres, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
    this.addContainer(CONTAINER.THEME_SVC, container)
  }

  private async startTenantService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const tenantImage = await this.imageResolver.getServiceImage(OnecxService.TENANT_SVC, this.config)
    const container = await new TenantSvcContainer(tenantImage, postgres, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
    this.addContainer(CONTAINER.TENANT_SVC, container)
  }

  private async startProductStoreService(
    postgres: StartedOnecxPostgresContainer,
    keycloak: StartedOnecxKeycloakContainer
  ): Promise<void> {
    const productStoreImage = await this.imageResolver.getServiceImage(OnecxService.PRODUCT_STORE_SVC, this.config)
    const container = await new ProductStoreSvcContainer(productStoreImage, postgres, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
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

    const permissionImage = await this.imageResolver.getServiceImage(OnecxService.PERMISSION_SVC, this.config)
    const container = await new PermissionSvcContainer(
      permissionImage,
      postgres,
      keycloak,
      tenantSvcContainer as StartedSvcContainer
    )
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
    this.addContainer(CONTAINER.PERMISSION_SVC, container)
  }

  private async startShellBffService(keycloak: StartedOnecxKeycloakContainer): Promise<void> {
    const shellBffImage = await this.imageResolver.getBffImage(OnecxBff.SHELL_BFF, this.config)
    const container = await new ShellBffContainer(shellBffImage, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
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

    const shellUiImage = await this.imageResolver.getUiImage(OnecxUi.SHELL_UI, this.config)
    const container = await new ShellUiContainer(shellUiImage, keycloak)
      .withNetwork(this.network)
      .enableLogging(loggingEnabled(this.config))
      .start()
    this.addContainer(CONTAINER.SHELL_UI, container)
  }
}
