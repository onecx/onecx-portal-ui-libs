import {
  POSTGRES,
  KEYCLOAK,
  NODE_20,
  onecxSvcImages,
  onecxShellImages,
  OnecxServiceImage,
  OnecxShellImage,
} from '../config/env'
import { PlatformConfig } from '../model/platform-config.interface'

/**
 * Resolves the actual image name to use based on the configuration and any version overrides
 */
export class ImageResolver {
  constructor(private config: PlatformConfig) {}

  /**
   * Get the PostgreSQL image with optional version override
   */
  getPostgresImage(): string {
    return this.config.imageVersions?.core?.postgres || POSTGRES
  }

  /**
   * Get the Keycloak image with optional version override
   */
  getKeycloakImage(): string {
    return this.config.imageVersions?.core?.keycloak || KEYCLOAK
  }

  /**
   * Get the Node.js image with optional version override
   */
  getNodeImage(): string {
    return this.config.imageVersions?.core?.node || NODE_20
  }

  /**
   * Get a service image with optional version override
   */
  getServiceImage(serviceName: OnecxServiceImage): string {
    const baseImage = onecxSvcImages[serviceName]
    const versionOverride = this.getServiceVersionOverride(serviceName)

    if (versionOverride) {
      const [imageName] = baseImage.split(':')
      return `${imageName}:${versionOverride}`
    }

    return baseImage
  }

  /**
   * Get a shell service image with optional version override
   */
  getShellImage(shellService: OnecxShellImage): string {
    const baseImage = onecxShellImages[shellService]
    const versionOverride = this.getShellVersionOverride(shellService)

    if (versionOverride) {
      const [imageName] = baseImage.split(':')
      return `${imageName}:${versionOverride}`
    }

    return baseImage
  }

  private getServiceVersionOverride(serviceName: OnecxServiceImage): string | undefined {
    const serviceVersions = this.config.imageVersions?.services
    if (!serviceVersions) return undefined

    switch (serviceName) {
      case OnecxServiceImage.ONECX_IAM_KC_SVC:
        return serviceVersions.iamKc
      case OnecxServiceImage.ONECX_WORKSPACE_SVC:
        return serviceVersions.workspace
      case OnecxServiceImage.ONECX_USER_PROFILE_SVC:
        return serviceVersions.userProfile
      case OnecxServiceImage.ONECX_THEME_SVC:
        return serviceVersions.theme
      case OnecxServiceImage.ONECX_TENANT_SVC:
        return serviceVersions.tenant
      case OnecxServiceImage.ONECX_PRODUCT_STORE_SVC:
        return serviceVersions.productStore
      case OnecxServiceImage.ONECX_PERMISSION_SVC:
        return serviceVersions.permission
      default:
        return undefined
    }
  }

  private getShellVersionOverride(shellService: OnecxShellImage): string | undefined {
    const shellVersions = this.config.imageVersions?.shell
    if (!shellVersions) return undefined

    switch (shellService) {
      case OnecxShellImage.ONECX_SHELL_BFF:
        return shellVersions.bff
      case OnecxShellImage.ONECX_SHELL_UI:
        return shellVersions.ui
      default:
        return undefined
    }
  }
}
