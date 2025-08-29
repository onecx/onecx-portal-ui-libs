const DOCKER_REPO = 'ghcr.io/onecx'
const DEFAULT_TAG = 'main-native'

// External Images
export const POSTGRES = 'docker.io/library/postgres:13.4'
export const KEYCLOAK = 'quay.io/keycloak/keycloak:23.0.4'
export const IMPORT_MANAGER_BASE = 'docker.io/library/node:20'

export enum OnecxService {
  IAM_KC_SVC = `${DOCKER_REPO}/onecx-iam-kc-svc:${DEFAULT_TAG}`,
  PERMISSION_SVC = `${DOCKER_REPO}/onecx-permission-svc:${DEFAULT_TAG}`,
  PRODUCT_STORE_SVC = `${DOCKER_REPO}/onecx-product-store-svc:${DEFAULT_TAG}`,
  TENANT_SVC = `${DOCKER_REPO}/onecx-tenant-svc:${DEFAULT_TAG}`,
  THEME_SVC = `${DOCKER_REPO}/onecx-theme-svc:${DEFAULT_TAG}`,
  WORKSPACE_SVC = `${DOCKER_REPO}/onecx-workspace-svc:${DEFAULT_TAG}`,
  USER_PROFILE_SVC = `${DOCKER_REPO}/onecx-user-profile-svc:${DEFAULT_TAG}`,
}

export enum OnecxBff {
  SHELL_BFF = `${DOCKER_REPO}/onecx-shell-bff:${DEFAULT_TAG}`,
}

export enum OnecxUi {
  SHELL_UI = `${DOCKER_REPO}/onecx-shell-ui:1.x`,
}
