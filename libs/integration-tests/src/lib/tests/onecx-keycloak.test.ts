import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import axios from 'axios'

const imagePg = 'docker.io/library/postgres:13.4'
const imageKc = 'quay.io/keycloak/keycloak:23.0.4'

describe('Default Keycloak Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer

  beforeAll(async () => {
    const network: StartedNetwork = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(imagePg).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(imageKc, pgContainer).withNetwork(network).start()
  })

  it('should set default environment values', () => {
    expect(kcContainer.getRealm()).toBe('onecx')
    expect(kcContainer.getAdminUsername()).toBe('admin')
    expect(kcContainer.getAdminPassword()).toBe('admin')
  })

  it('should expose correct database and user configuration', async () => {
    expect(kcContainer.getKeycloakDatabaseUsername()).toBe('keycloak')
    expect(kcContainer.getKeycloakDatabasePassword()).toBe('keycloak')
    expect(kcContainer.getKeycloakDatabase()).toBe('keycloak')
    expect(kcContainer.getEnvironmentHostname()).toBe('keycloak-app')
  })

  it('should have valid network aliases', async () => {
    const aliases = kcContainer.getNetworkAliases()
    expect(Array.isArray(aliases)).toBe(true)
    expect(aliases).toContain('keycloak-app')
  })

  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('keycloak')).resolves.not.toThrow()
  })

  it('should respond with 200 on OpenID configuration endpoint', async () => {
    const port = kcContainer.getMappedPort(kcContainer.getPort())
    const realm = kcContainer.getRealm()

    const response = await axios.get(`http://localhost:${port}/realms/${realm}/.well-known/openid-configuration`)

    expect(response.status).toBe(200)
    expect(response.data.issuer).toContain(`/realms/${realm}`)
  })

  afterAll(async () => {
    await kcContainer.stop()
    await pgContainer.stop()
  })
})
