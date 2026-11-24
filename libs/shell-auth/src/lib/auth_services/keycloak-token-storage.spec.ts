import { clearStoredKeycloakTokens, persistKeycloakTokens, readStoredTokens } from './keycloak-token-storage'

describe('keycloak token storage', () => {
  beforeEach(() => localStorage.clear())

  describe('given tokens were persisted', () => {
    it('when read, then the same tokens are returned', () => {
      persistKeycloakTokens({ token: 't', idToken: 'i', refreshToken: 'r' })
      expect(readStoredTokens()).toEqual({ token: 't', idToken: 'i', refreshToken: 'r' })
    })

    it('when persisting empty values afterwards, then those entries are removed', () => {
      persistKeycloakTokens({ token: 't', idToken: 'i', refreshToken: 'r' })
      persistKeycloakTokens({ token: undefined, idToken: null, refreshToken: 'r' })
      expect(readStoredTokens()).toEqual({ token: null, idToken: null, refreshToken: 'r' })
    })

    it('when cleared, then nothing is stored anymore', () => {
      persistKeycloakTokens({ token: 't', idToken: 'i', refreshToken: 'r' })
      clearStoredKeycloakTokens()
      expect(readStoredTokens()).toEqual({ token: null, idToken: null, refreshToken: null })
    })
  })
})
