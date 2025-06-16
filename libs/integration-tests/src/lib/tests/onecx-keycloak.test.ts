import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'

let kcContainer: StartedOnecxKeycloakContainer
let pgContainer: StartedOnecxPostgresContainer

beforeAll(async () => {
  const imagePg = 'docker.io/library/postgres:13.4'
  const imageKc = 'quay.io/keycloak/keycloak:23.0.4'

  pgContainer = await new OnecxPostgresContainer(imagePg).start()
  kcContainer = await new OnecxKeycloakContainer(imageKc, pgContainer).start()
})

afterAll(async () => {
  await kcContainer.stop()
  await pgContainer.stop()
})

// Tests are not complete and need to be expanded

describe('Default Keycloak Testcontainer', () => {
  it('should set default environment values', () => {
    expect(kcContainer.getOnecxRealm()).toBe('onecx')
    expect(kcContainer.getAdminUsername()).toBe('admin')
    expect(kcContainer.getPassword()).toBe('keycloak')
    expect(kcContainer.getKeycloakPort()).toBe(8080)
  })

  describe('Keycloak Container Integration', () => {
    it('should expose correct database and user configuration', () => {
      expect(kcContainer.getUsername()).toBe('keycloak')
      expect(kcContainer.getDatabase()).toBe('keycloak')
      expect(kcContainer.getEnvironmentHostname()).toBe('keycloak-app')
    })

    it('should have valid network aliases', () => {
      const aliases = kcContainer.getNetworkAliases()
      expect(Array.isArray(aliases)).toBe(true)
      expect(aliases).toContain('keycloak-app')
    })
  })
})
