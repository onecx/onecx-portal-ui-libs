const DOCKER_REPO = 'ghcr.io/onecx'
const DEFAULT_TAG = 'main-native'

// External Images
export const POSTGRES = 'docker.io/library/postgres:13.4'
export const KEYCLOAK = 'quay.io/keycloak/keycloak:23.0.4'
export const IMPORTMANAGER = 'docker.io/library/node:20'

// Simplified Enums (string-based for unique keys)
export enum OnecxService {
  IAM_KC_SVC = 'IAM_KC_SVC',
  PERMISSION_SVC = 'PERMISSION_SVC',
  PRODUCT_STORE_SVC = 'PRODUCT_STORE_SVC',
  TENANT_SVC = 'TENANT_SVC',
  THEME_SVC = 'THEME_SVC',
  WORKSPACE_SVC = 'WORKSPACE_SVC',
  USER_PROFILE_SVC = 'USER_PROFILE_SVC',
}

export enum OnecxBff {
  SHELL_BFF = 'SHELL_BFF',
}

export enum OnecxUi {
  SHELL_UI = 'SHELL_UI',
}

// Unified Image Registry
export const IMAGES = {
  // External
  POSTGRES: 'docker.io/library/postgres:13.4',
  KEYCLOAK: 'quay.io/keycloak/keycloak:23.0.4',
  NODE: 'docker.io/library/node:20',

  // OneCX Services
  [OnecxService.IAM_KC_SVC]: `${DOCKER_REPO}/onecx-iam-kc-svc:${DEFAULT_TAG}`,
  [OnecxService.PERMISSION_SVC]: `${DOCKER_REPO}/onecx-permission-svc:${DEFAULT_TAG}`,
  [OnecxService.PRODUCT_STORE_SVC]: `${DOCKER_REPO}/onecx-product-store-svc:${DEFAULT_TAG}`,
  [OnecxService.TENANT_SVC]: `${DOCKER_REPO}/onecx-tenant-svc:${DEFAULT_TAG}`,
  [OnecxService.THEME_SVC]: `${DOCKER_REPO}/onecx-theme-svc:${DEFAULT_TAG}`,
  [OnecxService.WORKSPACE_SVC]: `${DOCKER_REPO}/onecx-workspace-svc:${DEFAULT_TAG}`,
  [OnecxService.USER_PROFILE_SVC]: `${DOCKER_REPO}/onecx-user-profile-svc:${DEFAULT_TAG}`,

  // OneCX BFF
  [OnecxBff.SHELL_BFF]: `${DOCKER_REPO}/onecx-shell-bff:${DEFAULT_TAG}`,

  // OneCX UI
  [OnecxUi.SHELL_UI]: `${DOCKER_REPO}/onecx-shell-ui:1.x`,
} as const
