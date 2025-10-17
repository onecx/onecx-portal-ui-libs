import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'
import axios from 'axios'
import { KEYCLOAK, POSTGRES } from '../../config/env'

xdescribe('Default Keycloak Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let network: StartedNetwork

  beforeAll(async () => {
    network = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
  }, 120_000)

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

  it('should use the correct port', () => {
    const port = kcContainer.getPort()

    expect(port).toBe(8080)
  })

  afterAll(async () => {
    await kcContainer.stop()
    await pgContainer.stop()
    await network.stop()
  })
})
