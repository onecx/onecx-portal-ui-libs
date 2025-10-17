import { POSTGRES, KEYCLOAK, IMPORT_MANAGER_BASE, OnecxBff, OnecxUi, OnecxService } from '../config/env'
import { PlatformConfig } from '../models/platform-config.interface'
import { ImagePullChecker } from './image-pull-checker'
import { ContainerImageOverrideMapper } from '../utils/container-image-override-mapper'
import { Logger, LogMessages } from '../utils/logger'

const logger = new Logger('ImageResolver')

/**
 * Resolves the actual image name to use based on the configuration and any version overrides
 */
export class ImageResolver {
  constructor() {
    // Platform config will be set globally by PlatformManager
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
    const overrideImage = ContainerImageOverrideMapper.getServiceImageOverride(serviceName, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Get a bff container image with optional image override
   */
  async getBffImage(bffService: OnecxBff, config: PlatformConfig): Promise<string> {
    const defaultImage = bffService
    const overrideImage = ContainerImageOverrideMapper.getBffImageOverride(bffService, config)
    return this.getImageWithOverride(defaultImage, overrideImage)
  }

  /**
   * Get a ui container image with optional image override
   */
  async getUiImage(uiService: OnecxUi, config: PlatformConfig): Promise<string> {
    const defaultImage = uiService
    const overrideImage = ContainerImageOverrideMapper.getUiImageOverride(uiService, config)
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
      logger.success(LogMessages.IMAGE_VERIFY_SUCCESS, imageName)
      return imageName
    }

    // Log warning but don't fail - let the container startup handle the failure
    logger.warn(LogMessages.IMAGE_VERIFY_FAILED, `Image may not be available: ${imageName}`)
    logger.info(LogMessages.IMAGE_PULL_START, `Proceeding with unverified image: ${imageName}`)

    return imageName
  }

  async verifyImage(image: string): Promise<boolean> {
    return await ImagePullChecker.verifyImagePull(image)
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
    logger.warn(LogMessages.IMAGE_VERIFY_FAILED, `${overrideImage} -> ${defaultImage}`)
    return defaultImage
  }
}
