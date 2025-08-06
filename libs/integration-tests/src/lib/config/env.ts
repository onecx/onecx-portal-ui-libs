const DOCKER_REPO = 'ghcr.io/onecx'
export const POSTGRES = 'docker.io/library/postgres:13.4'
export const KEYCLOAK = 'quay.io/keycloak/keycloak:23.0.4'
export const NODE_20 = 'docker.io/library/node:20'

export enum OnecxServiceImage {
  ONECX_IAM_KC_SVC = 'ONECX_IAM_KC_SVC',
  ONECX_PERMISSION_SVC = 'ONECX_PERMISSION_SVC',
  ONECX_PRODUCT_STORE_SVC = 'ONECX_PRODUCT_STORE_SVC',
  ONECX_TENANT_SVC = 'ONECX_TENANT_SVC',
  ONECX_THEME_SVC = 'ONECX_THEME_SVC',
  ONECX_WORKSPACE_SVC = 'ONECX_WORKSPACE_SVC',
  ONECX_USER_PROFILE_SVC = 'ONECX_USER_PROFILE_SVC',
}

export enum OnecxBffImage {
  ONECX_SHELL_BFF = 'ONECX_SHELL_BFF',
}

export enum OnecxUiImage {
  ONECX_SHELL_UI = 'ONECX_SHELL_UI',
}

export const onecxSvcImages = {
  [OnecxServiceImage.ONECX_IAM_KC_SVC]: `${DOCKER_REPO}/onecx-iam-kc-svc:main-native`,
  [OnecxServiceImage.ONECX_PERMISSION_SVC]: `${DOCKER_REPO}/onecx-permission-svc:main-native`,
  [OnecxServiceImage.ONECX_PRODUCT_STORE_SVC]: `${DOCKER_REPO}/onecx-product-store-svc:main-native`,
  [OnecxServiceImage.ONECX_TENANT_SVC]: `${DOCKER_REPO}/onecx-tenant-svc:main-native`,
  [OnecxServiceImage.ONECX_THEME_SVC]: `${DOCKER_REPO}/onecx-theme-svc:main-native`,
  [OnecxServiceImage.ONECX_WORKSPACE_SVC]: `${DOCKER_REPO}/onecx-workspace-svc:main-native`,
  [OnecxServiceImage.ONECX_USER_PROFILE_SVC]: `${DOCKER_REPO}/onecx-user-profile-svc:main-native`,
}
export const onecxBffImages = {
  [OnecxBffImage.ONECX_SHELL_BFF]: `${DOCKER_REPO}/onecx-shell-bff:main-native`,
}

export const onecxUiImages = {
  [OnecxUiImage.ONECX_SHELL_UI]: `${DOCKER_REPO}/onecx-shell-ui:1.x`,
}
