import { POSTGRES, KEYCLOAK, IMPORTMANAGER, OnecxBff, OnecxUi, OnecxService, IMAGES } from '../config/env'
import { PlatformConfig } from '../model/platform-config.interface'
import { ImagePullChecker } from './image-pull-checker'
import { Logger } from '../utils/logger'

const logger = new Logger('ImageResolver')

/**
 * Resolves the actual image name to use based on the configuration and any version overrides
 */
export class ImageResolver {
  constructor(config?: PlatformConfig) {
    // Platform config will be set globally by PlatformManager
  }
  /**
   * Get any image with optional override and fallback to default
   */
  private async getImageWithOverride(defaultImage: string, overrideImage: string | undefined): Promise<string> {
    if (!overrideImage) {
      return defaultImage
    }

    const imageIsVerified = await this.verifyImage(overrideImage)
    if (imageIsVerified) {
      return overrideImage
    }

    // If verification fails, fall back to default image
    logger.warn('IMAGE_VERIFY_FAILED', `${overrideImage} -> ${defaultImage}`)
    return defaultImage
  }

  /**
   * Get the PostgreSQL image with optional image override
   */
  async getPostgresImage(config: PlatformConfig): Promise<string> {
    return this.getImageWithOverride(POSTGRES, config.imageOverrides?.core?.postgres)
  }

  /**
   * Get the Keycloak image with optional image override
   */
  async getKeycloakImage(config: PlatformConfig): Promise<string> {
    return this.getImageWithOverride(KEYCLOAK, config.imageOverrides?.core?.keycloak)
  }

  /**
   * Get the Node.js image with optional image override
   */
  async getNodeImage(config: PlatformConfig): Promise<string> {
    return this.getImageWithOverride(IMPORTMANAGER, config.imageOverrides?.core?.importmanager)
  }

  /**
   * Get a service image with optional image override
   */
  async getServiceImage(serviceName: OnecxService, config: PlatformConfig): Promise<string> {
    const defaultImage = IMAGES[serviceName]
    const overrideImage = this.getServiceImageOverride(serviceName, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Get a bff container image with optional image override
   */
  async getBffImage(bffService: OnecxBff, config: PlatformConfig): Promise<string> {
    const defaultImage = IMAGES[bffService]
    const overrideImage = this.getBffImageOverride(bffService, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Get a ui container image with optional image override
   */
  async getUiImage(uiService: OnecxUi, config: PlatformConfig): Promise<string> {
    const defaultImage = IMAGES[uiService]
    const overrideImage = this.getUiImageOverride(uiService, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Resolve a custom image (used for container factory configurations)
   * This method returns the image as-is since custom images are already specified
   */
  async getCustomImage(imageName: string): Promise<string> {
    // For integration tests, we'll be more lenient with custom images
    // In a real environment, you might want to enable strict verification
    const imageIsVerified = await this.verifyImage(imageName)
    if (imageIsVerified) {
      logger.success('IMAGE_VERIFY_SUCCESS', imageName)
      return imageName
    }

    // Log warning but don't fail - let the container startup handle the failure
    logger.warn('IMAGE_VERIFY_FAILED', `Custom image may not be available: ${imageName}`)
    logger.info('IMAGE_PULL_START', `Proceeding with unverified image: ${imageName}`)

    return imageName
  }

  async verifyImage(image: string): Promise<boolean> {
    return await ImagePullChecker.verifyImagePull(image)
  }

  private getServiceImageOverride(serviceName: OnecxService, config: PlatformConfig): string | undefined {
    const serviceImages = config.imageOverrides?.services
    if (!serviceImages) return undefined

    const overrideMap = {
      [OnecxService.IAM_KC_SVC]: serviceImages.iamKc,
      [OnecxService.WORKSPACE_SVC]: serviceImages.workspace,
      [OnecxService.USER_PROFILE_SVC]: serviceImages.userProfile,
      [OnecxService.THEME_SVC]: serviceImages.theme,
      [OnecxService.TENANT_SVC]: serviceImages.tenant,
      [OnecxService.PRODUCT_STORE_SVC]: serviceImages.productStore,
      [OnecxService.PERMISSION_SVC]: serviceImages.permission,
    }

    return overrideMap[serviceName]
  }

  private getBffImageOverride(bffService: OnecxBff, config: PlatformConfig): string | undefined {
    const overrides = config.imageOverrides?.bff
    if (!overrides) return undefined

    const overrideMap = {
      [OnecxBff.SHELL_BFF]: overrides.shell,
    }

    return overrideMap[bffService]
  }

  private getUiImageOverride(uiService: OnecxUi, config: PlatformConfig): string | undefined {
    const overrides = config.imageOverrides?.ui
    if (!overrides) return undefined

    const overrideMap = {
      [OnecxUi.SHELL_UI]: overrides.shell,
    }

    return overrideMap[uiService]
  }
}
