import { POSTGRES, KEYCLOAK, IMPORT_MANAGER_BASE, OnecxBff, OnecxUi, OnecxService } from '../config/env'
import { PlatformConfig } from '../model/platform-config.interface'
import { ImagePullChecker } from './image-pull-checker'
import { Logger } from '../utils/logger'

const logger = new Logger('ImageResolver')

/**
 * Resolves the actual image name to use based on the configuration and any version overrides
 */
export class ImageResolver {
  constructor() {
    // Platform config will be set globally by PlatformManager
  }
  /**
   * Get any image with optional override and fallback to default
   */
  private async getImageWithOverride(defaultImage: string, overrideImage: string | undefined): Promise<string> {
    const finalImage = overrideImage || defaultImage
    const imageIsVerified = await this.verifyImage(finalImage)

    if (imageIsVerified) {
      return finalImage
    }

    // If verification fails, fall back to default image
    logger.warn('IMAGE_VERIFY_FAILED', `${overrideImage} -> ${defaultImage}`)
    return defaultImage
  }

  /**
   * Get the PostgreSQL image with optional image override
   */
  async getPostgresImage(config: PlatformConfig): Promise<string> {
    return this.getImageWithOverride(POSTGRES, config.platformOverrides?.core?.postgres?.image)
  }

  /**
   * Get the Keycloak image with optional image override
   */
  async getKeycloakImage(config: PlatformConfig): Promise<string> {
    return this.getImageWithOverride(KEYCLOAK, config.platformOverrides?.core?.keycloak?.image)
  }

  /**
   * Get the Node.js image with optional image override
   */
  async getImportManagerBaseImage(config: PlatformConfig): Promise<string> {
    return this.getImageWithOverride(IMPORT_MANAGER_BASE, config.platformOverrides?.core?.importmanager?.image)
  }

  /**
   * Get a service image with optional image override
   */
  async getServiceImage(serviceName: OnecxService, config: PlatformConfig): Promise<string> {
    const defaultImage = serviceName
    const overrideImage = this.getServiceImageOverride(serviceName, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Get a bff container image with optional image override
   */
  async getBffImage(bffService: OnecxBff, config: PlatformConfig): Promise<string> {
    const defaultImage = bffService
    const overrideImage = this.getBffImageOverride(bffService, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Get a ui container image with optional image override
   */
  async getUiImage(uiService: OnecxUi, config: PlatformConfig): Promise<string> {
    const defaultImage = uiService
    const overrideImage = this.getUiImageOverride(uiService, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Resolve a custom image (used for container factory configurations)
   * This method returns the image as-is since custom images are already specified
   */
  async getImage(imageName: string): Promise<string> {
    // For integration tests, we'll be more lenient with custom images
    // In a real environment, you might want to enable strict verification
    const imageIsVerified = await this.verifyImage(imageName)
    if (imageIsVerified) {
      logger.success('IMAGE_VERIFY_SUCCESS', imageName)
      return imageName
    }

    // Log warning but don't fail - let the container startup handle the failure
    logger.warn('IMAGE_VERIFY_FAILED', `Image may not be available: ${imageName}`)
    logger.info('IMAGE_PULL_START', `Proceeding with unverified image: ${imageName}`)

    return imageName
  }

  async verifyImage(image: string): Promise<boolean> {
    return await ImagePullChecker.verifyImagePull(image)
  }

  private getServiceImageOverride(serviceName: OnecxService, config: PlatformConfig): string | undefined {
    const serviceImages = config.platformOverrides?.services
    if (!serviceImages) return undefined

    const overrideMap = {
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

  private getBffImageOverride(bffService: OnecxBff, config: PlatformConfig): string | undefined {
    const overrides = config.platformOverrides?.bff
    if (!overrides) return undefined

    const overrideMap = {
      [OnecxBff.SHELL_BFF]: overrides.shell?.image,
    }

    return overrideMap[bffService]
  }

  private getUiImageOverride(uiService: OnecxUi, config: PlatformConfig): string | undefined {
    const overrides = config.platformOverrides?.ui
    if (!overrides) return undefined

    const overrideMap = {
      [OnecxUi.SHELL_UI]: overrides.shell?.image,
    }

    return overrideMap[uiService]
  }
}
