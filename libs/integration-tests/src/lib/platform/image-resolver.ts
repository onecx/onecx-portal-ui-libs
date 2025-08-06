import {
  POSTGRES,
  KEYCLOAK,
  NODE_20,
  OnecxBffImage,
  OnecxUiImage,
  OnecxServiceImage,
  onecxSvcImages,
  onecxBffImages,
  onecxUiImages,
} from '../config/env'
import { PlatformConfig } from '../model/platform-config.interface'
import { ImagePullChecker } from './image-pull-checker'

/**
 * Resolves the actual image name to use based on the configuration and any version overrides
 */
export class ImageResolver {
  /**
   * Get the PostgreSQL image with optional image override
   */
  async getPostgresImage(config: PlatformConfig): Promise<string> {
    const overrideImage = config.imageOverrides?.core?.postgres
    if (!overrideImage) {
      return POSTGRES
    }

    const imageIsVerified = await this.verifyImage(overrideImage)
    if (imageIsVerified) {
      return overrideImage
    }

    // If verification fails, fall back to default image
    console.warn(`Image verification failed for ${overrideImage}, falling back to default: ${POSTGRES}`)
    return POSTGRES
  }

  /**
   * Get the Keycloak image with optional image override
   */
  async getKeycloakImage(config: PlatformConfig): Promise<string> {
    const overrideImage = config.imageOverrides?.core?.keycloak
    if (!overrideImage) {
      return KEYCLOAK
    }

    const imageIsVerified = await this.verifyImage(overrideImage)
    if (imageIsVerified) {
      return overrideImage
    }

    // If verification fails, fall back to default image
    console.warn(`Image verification failed for ${overrideImage}, falling back to default: ${KEYCLOAK}`)
    return KEYCLOAK
  }

  /**
   * Get the Node.js image with optional image override
   */
  async getNodeImage(config: PlatformConfig): Promise<string> {
    const overrideImage = config.imageOverrides?.core?.node
    if (!overrideImage) {
      return NODE_20
    }

    const imageIsVerified = await this.verifyImage(overrideImage)
    if (imageIsVerified) {
      return overrideImage
    }

    // If verification fails, fall back to default image
    console.warn(`Image verification failed for ${overrideImage}, falling back to default: ${NODE_20}`)
    return NODE_20
  }

  /**
   * Get a service image with optional image override
   */
  async getServiceImage(serviceName: OnecxServiceImage, config: PlatformConfig): Promise<string> {
    const imageOverride = this.getServiceImageOverride(serviceName, config)
    if (imageOverride) {
      const imageIsVerified = await this.verifyImage(imageOverride)
      if (imageIsVerified) {
        return imageOverride
      }
      // If verification fails, fall back to default image
      const defaultImage = onecxSvcImages[serviceName]
      console.warn(`Image verification failed for ${imageOverride}, falling back to default: ${defaultImage}`)
      return defaultImage
    }
    return onecxSvcImages[serviceName]
  }

  /**
   * Get a bff service image with optional image override
   */
  async getBffImage(bffService: OnecxBffImage, config: PlatformConfig): Promise<string> {
    const imageOverride = this.getBffImageOverride(bffService, config)
    if (imageOverride) {
      const imageIsVerified = await this.verifyImage(imageOverride)
      if (imageIsVerified) {
        return imageOverride
      }
      // If verification fails, fall back to default image
      const defaultImage = onecxBffImages[bffService]
      console.warn(`Image verification failed for ${imageOverride}, falling back to default: ${defaultImage}`)
      return defaultImage
    }
    return onecxBffImages[bffService]
  }

  /**
   * Get a ui service image with optional image override
   */
  async getUiImage(uiService: OnecxUiImage, config: PlatformConfig): Promise<string> {
    const imageOverride = this.getUiImageOverride(uiService, config)
    if (imageOverride) {
      const imageIsVerified = await this.verifyImage(imageOverride)
      if (imageIsVerified) {
        return imageOverride
      }
      // If verification fails, fall back to default image
      const defaultImage = onecxUiImages[uiService]
      console.warn(`Image verification failed for ${imageOverride}, falling back to default: ${defaultImage}`)
      return defaultImage
    }
    return onecxUiImages[uiService]
  }

  /**
   * Resolve a custom image (used for container factory configurations)
   * This method returns the image as-is since custom images are already specified
   * in the container configuration and don't need to be resolved from env.ts
   */
  async getCustomImage(imageName: string): Promise<string> {
    const imageIsVerified = await this.verifyImage(imageName)
    if (imageIsVerified) {
      return imageName
    }
    // For custom images, we don't have a fallback, so we throw an error
    throw new Error(`Custom image verification failed for: ${imageName}`)
  }

  async verifyImage(image: string): Promise<boolean> {
    let imageChecked = false
    imageChecked = await ImagePullChecker.verifyImagePull(image)
    if (imageChecked) {
      return true
    }
    return false
  }

  private getServiceImageOverride(serviceName: OnecxServiceImage, config: PlatformConfig): string | undefined {
    const serviceImages = config.imageOverrides?.services
    if (!serviceImages) return undefined

    switch (serviceName) {
      case OnecxServiceImage.ONECX_IAM_KC_SVC:
        return serviceImages.iamKc
      case OnecxServiceImage.ONECX_WORKSPACE_SVC:
        return serviceImages.workspace
      case OnecxServiceImage.ONECX_USER_PROFILE_SVC:
        return serviceImages.userProfile
      case OnecxServiceImage.ONECX_THEME_SVC:
        return serviceImages.theme
      case OnecxServiceImage.ONECX_TENANT_SVC:
        return serviceImages.tenant
      case OnecxServiceImage.ONECX_PRODUCT_STORE_SVC:
        return serviceImages.productStore
      case OnecxServiceImage.ONECX_PERMISSION_SVC:
        return serviceImages.permission
      default:
        return undefined
    }
  }

  private getBffImageOverride(bffService: OnecxBffImage, config: PlatformConfig): string | undefined {
    const overrides = config.imageOverrides
    if (!overrides) return undefined

    // If core overrides exist or BFF shell override exists, return the BFF shell override
    if (overrides.bff?.shell) {
      switch (bffService) {
        case OnecxBffImage.ONECX_SHELL_BFF:
          return overrides.bff?.shell
        default:
          return undefined
      }
    }

    return undefined
  }

  private getUiImageOverride(uiService: OnecxUiImage, config: PlatformConfig): string | undefined {
    const overrides = config.imageOverrides
    if (!overrides) return undefined

    // If core overrides exist or UI shell override exists, return the UI shell override
    if (overrides.ui?.shell) {
      switch (uiService) {
        case OnecxUiImage.ONECX_SHELL_UI:
          return overrides.ui?.shell
        default:
          return undefined
      }
    }

    return undefined
  }
}
