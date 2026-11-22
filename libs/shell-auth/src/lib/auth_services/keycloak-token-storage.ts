const KC_REFRESH_TOKEN_LS = 'onecx_kc_refreshToken'
const KC_ID_TOKEN_LS = 'onecx_kc_idToken'
const KC_TOKEN_LS = 'onecx_kc_token'

export interface KeycloakTokenValues {
  token: string | null
  idToken: string | null
  refreshToken: string | null
}

const persistValue = (storageKey: string, value: string | null | undefined): void => {
  if (value) {
    localStorage.setItem(storageKey, value)
  } else {
    localStorage.removeItem(storageKey)
  }
}

export const readStoredTokens = (): KeycloakTokenValues => ({
  token: localStorage.getItem(KC_TOKEN_LS),
  idToken: localStorage.getItem(KC_ID_TOKEN_LS),
  refreshToken: localStorage.getItem(KC_REFRESH_TOKEN_LS),
})

export const clearStoredKeycloakTokens = (): void => {
  localStorage.removeItem(KC_TOKEN_LS)
  localStorage.removeItem(KC_ID_TOKEN_LS)
  localStorage.removeItem(KC_REFRESH_TOKEN_LS)
}

export const persistKeycloakTokens = (keycloak: {
  token?: string | null
  idToken?: string | null
  refreshToken?: string | null
}): void => {
  persistValue(KC_TOKEN_LS, keycloak.token)
  persistValue(KC_ID_TOKEN_LS, keycloak.idToken)
  persistValue(KC_REFRESH_TOKEN_LS, keycloak.refreshToken)
}
