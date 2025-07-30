import { PlatformConfig } from '../model/platform-config.interface'

/** Complete platform configuration with all services enabled */
export const DEFAULT_PLATFORM_CONFIG: PlatformConfig = {
  core: {
    postgres: true,
    keycloak: true,
  },
  services: {
    iamKc: true,
    workspace: true,
    userProfile: true,
    theme: true,
    tenant: true,
    productStore: true,
    permission: true,
  },
  bff: {
    shell: true,
  },
  ui: {
    shell: true,
  },
  importData: true,
}

/** Minimal platform configuration with only essential services */
export const MINIMAL_PLATFORM_CONFIG: PlatformConfig = {
  core: {
    postgres: true,
    keycloak: true,
  },
  importData: false,
}

/** Configuration for testing backend services only (no UI/BFF) */
export const BACKEND_ONLY_CONFIG: PlatformConfig = {
  core: {
    postgres: true,
    keycloak: true,
  },
  services: {
    iamKc: true,
    workspace: true,
    userProfile: true,
    theme: true,
    tenant: true,
    productStore: true,
    permission: true,
  },
  importData: true,
}
