import { TestEnvironmentFactory } from '../environment/TestEnvironmentFactory'
import axios from 'axios'

let testEnv: TestEnvironmentFactory
let keycloakBaseUrl: string

beforeAll(async () => {
  testEnv = new TestEnvironmentFactory()
  await testEnv.start()

  const keycloak = testEnv.getKeycloak()
  const host = keycloak['container']?.getHost()
  const port = keycloak['container']?.getMappedPort(8080)
  keycloakBaseUrl = `http://${host}:${port}`
})

afterAll(async () => {
  await testEnv.stop()
})

describe('Keycloak Realm Import – onecx', () => {
  it('should expose OpenID configuration for realm "onecx"', async () => {
    const url = `${keycloakBaseUrl}/realms/onecx/.well-known/openid-configuration`

    const response = await axios.get(url)

    expect(response.status).toBe(200)
    expect(response.data).toHaveProperty('issuer')
    expect(response.data.issuer).toContain('/realms/onecx')
  })
})
