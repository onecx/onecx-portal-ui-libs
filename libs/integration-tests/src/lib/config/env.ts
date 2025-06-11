export const baseOneCXRepo = 'ghcr.io/onecx'

export const containerImagesEnv = {
  POSTGRES: 'docker.io/library/postgres:13.4',
  KEYCLOAK: 'quay.io/keycloak/keycloak:23.0.4',

  ONECX_ANNOUNCEMENT_SVC: `${baseOneCXRepo}/onecx-announcement-svc:main-native`,
  ONECX_ANNOUNCEMENT_BFF: `${baseOneCXRepo}/onecx-announcement-bff:main-native`,
  ONECX_ANNOUNCEMENT_UI: `${baseOneCXRepo}/onecx-announcement-ui:main`,

  ONECX_HELP_SVC: `${baseOneCXRepo}/onecx-help-svc:main-native`,
  ONECX_HELP_BFF: `${baseOneCXRepo}/onecx-help-bff:main-native`,
  ONECX_HELP_UI: `${baseOneCXRepo}/onecx-help-ui:main`,

  ONECX_IAM_KC_SVC: `${baseOneCXRepo}/onecx-iam-kc-svc:main-native`,
  ONECX_IAM_BFF: `${baseOneCXRepo}/onecx-iam-bff:main-native`,
  ONECX_IAM_UI: `${baseOneCXRepo}/onecx-iam-ui:main`,

  ONECX_PERMISSION_SVC: `${baseOneCXRepo}/onecx-permission-svc:main-native`,
  ONECX_PERMISSION_BFF: `${baseOneCXRepo}/onecx-permission-bff:main-native`,
  ONECX_PERMISSION_UI: `${baseOneCXRepo}/onecx-permission-ui:main`,

  ONECX_PRODUCT_STORE_SVC: `${baseOneCXRepo}/onecx-product-store-svc:main-native`,
  ONECX_PRODUCT_STORE_BFF: `${baseOneCXRepo}/onecx-product-store-bff:main-native`,
  ONECX_PRODUCT_STORE_UI: `${baseOneCXRepo}/onecx-product-store-ui:main`,

  ONECX_SHELL_BFF: `${baseOneCXRepo}/onecx-shell-bff:main-native`,
  ONECX_SHELL_UI: `${baseOneCXRepo}/onecx-shell-ui:main`,

  ONECX_TENANT_SVC: `${baseOneCXRepo}/onecx-tenant-svc:main-native`,
  ONECX_TENANT_BFF: `${baseOneCXRepo}/onecx-tenant-bff:main-native`,
  ONECX_TENANT_UI: `${baseOneCXRepo}/onecx-tenant-ui:main`,

  ONECX_THEME_SVC: `${baseOneCXRepo}/onecx-theme-svc:main-native`,
  ONECX_THEME_BFF: `${baseOneCXRepo}/onecx-theme-bff:main-native`,
  ONECX_THEME_UI: `${baseOneCXRepo}/onecx-theme-ui:main`,

  ONECX_WORKSPACE_SVC: `${baseOneCXRepo}/onecx-workspace-svc:main-native`,
  ONECX_WORKSPACE_BFF: `${baseOneCXRepo}/onecx-workspace-bff:main-native`,
  ONECX_WORKSPACE_UI: `${baseOneCXRepo}/onecx-workspace-ui:main`,

  ONECX_WELCOME_SVC: `${baseOneCXRepo}/onecx-welcome-svc:main-native`,
  ONECX_WELCOME_BFF: `${baseOneCXRepo}/onecx-welcome-bff:main-native`,
  ONECX_WELCOME_UI: `${baseOneCXRepo}/onecx-welcome-ui:main`,

  ONECX_USER_PROFILE_SVC: `${baseOneCXRepo}/onecx-user-profile-svc:main-native`,
  ONECX_USER_PROFILE_BFF: `${baseOneCXRepo}/onecx-user-profile-bff:main-native`,
  ONECX_USER_PROFILE_UI: `${baseOneCXRepo}/onecx-user-profile-ui:main`,
}

export const commonEnv = {
  KC_REALM: 'onecx',
  QUARKUS_OIDC_AUTH_SERVER_URL: 'http://keycloak-app:8080/realms/onecx',
  QUARKUS_OIDC_TOKEN_ISSUER: 'http://keycloak-app:8080/realms/onecx',
  TKIT_SECURITY_AUTH_ENABLED: 'false',
  'TKIT_RS_CONTEXT_TENANT-ID_MOCK_ENABLED': 'false',
  TKIT_LOG_JSON_ENABLED: 'false',
}

export const bffEnv = {}

export const svcEnv = {
  TKIT_DATAIMPORT_ENABLED: 'true',
  ONECX_TENANT_CACHE_ENABLED: 'false',
}
