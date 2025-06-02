import { TestEnvironmentFactory } from '../environment/TestEnvironmentFactory'

let testEnv: TestEnvironmentFactory

beforeAll(async () => {
  testEnv = new TestEnvironmentFactory()
  await testEnv.start()
})

afterAll(async () => {
  await testEnv.stop()
})

test('Postgres is reachable', async () => {
  const postgres = testEnv.getPostgres()
  const host = postgres.getHost()
  const port = postgres.getPort()

  expect(host).toBeDefined()
  expect(port).toBeGreaterThan(0)
})

test('Keycloak is reachable', async () => {
  const keycloak = testEnv.getKeycloak()
  const host = keycloak['container']?.getHost()
  const port = keycloak['container']?.getMappedPort(8080)

  expect(host).toBeDefined()
  expect(port).toBeGreaterThan(0)
})
