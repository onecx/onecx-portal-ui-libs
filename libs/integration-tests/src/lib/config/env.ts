const DOCKER_REPO = 'ghcr.io/onecx'
export const POSTGRES = 'docker.io/library/postgres:13.4'
export const KEYCLOAK = 'quay.io/keycloak/keycloak:23.0.4'
export const NODE_20 = 'docker.io/library/node:20'

export const onecxSvcImages = {
  ONECX_IAM_KC_SVC: `${DOCKER_REPO}/onecx-iam-kc-svc:main-native`,
  ONECX_PERMISSION_SVC: `${DOCKER_REPO}/onecx-permission-svc:main-native`,
  ONECX_PRODUCT_STORE_SVC: `${DOCKER_REPO}/onecx-product-store-svc:main-native`,
  ONECX_TENANT_SVC: `${DOCKER_REPO}/onecx-tenant-svc:main-native`,
  ONECX_THEME_SVC: `${DOCKER_REPO}/onecx-theme-svc:main-native`,
  ONECX_WORKSPACE_SVC: `${DOCKER_REPO}/onecx-workspace-svc:main-native`,
  ONECX_USER_PROFILE_SVC: `${DOCKER_REPO}/onecx-user-profile-svc:main-native`,
}

export const onecxShellImages = {
  ONECX_SHELL_BFF: `${DOCKER_REPO}/onecx-shell-bff:main-native`,
  ONECX_SHELL_UI: `${DOCKER_REPO}/onecx-shell-ui:1.x`,
}
