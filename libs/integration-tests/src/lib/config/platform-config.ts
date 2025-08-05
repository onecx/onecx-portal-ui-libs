import { PlatformConfig } from '../model/platform-config.interface'

// TypeScript configurations (will be migrated to JSON)
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
