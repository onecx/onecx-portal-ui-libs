import { OnecxService, OnecxBff, OnecxUi } from '../config/env'
import { PlatformConfig } from '../models/platform-config.interface'

/**
 * Maps container service names to their corresponding platform config image overrides
 */
export class ContainerImageOverrideMapper {
  /**
   * Get image override for a service container
   */
  static getServiceImageOverride(serviceName: OnecxService, config: PlatformConfig): string | undefined {
    const serviceImages = config.platformOverrides?.services
    if (!serviceImages) return undefined

    const overrideMap: Record<OnecxService, string | undefined> = {
      [OnecxService.IAM_KC_SVC]: serviceImages.iamKc?.image,
      [OnecxService.WORKSPACE_SVC]: serviceImages.workspace?.image,
      [OnecxService.USER_PROFILE_SVC]: serviceImages.userProfile?.image,
      [OnecxService.THEME_SVC]: serviceImages.theme?.image,
      [OnecxService.TENANT_SVC]: serviceImages.tenant?.image,
      [OnecxService.PRODUCT_STORE_SVC]: serviceImages.productStore?.image,
      [OnecxService.PERMISSION_SVC]: serviceImages.permission?.image,
    }

    return overrideMap[serviceName]
  }

  /**
   * Get image override for a BFF container
   */
  static getBffImageOverride(bffService: OnecxBff, config: PlatformConfig): string | undefined {
    const overrides = config.platformOverrides?.bff
    if (!overrides) return undefined

    const overrideMap: Record<OnecxBff, string | undefined> = {
      [OnecxBff.SHELL_BFF]: overrides.shell?.image,
    }

    return overrideMap[bffService]
  }

  /**
   * Get image override for a UI container
   */
  static getUiImageOverride(uiService: OnecxUi, config: PlatformConfig): string | undefined {
    const overrides = config.platformOverrides?.ui
    if (!overrides) return undefined

    const overrideMap: Record<OnecxUi, string | undefined> = {
      [OnecxUi.SHELL_UI]: overrides.shell?.image,
    }

    return overrideMap[uiService]
  }
}
