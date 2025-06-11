import { StartedOneCXKeycloakContainer } from '../containers/core/onecx-keycloak'
import { StartedOneCXPostgresContainer } from '../containers/core/onecx-postgres'
import { CoreBuilder } from '../environment/core-builder'

let testEnv: CoreBuilder
let pg: StartedOneCXPostgresContainer
let kc: StartedOneCXKeycloakContainer

beforeAll(async () => {
  testEnv = new CoreBuilder()
  const { startedPgContainer, startedKcContainer } = await testEnv.startCore()
  pg = startedPgContainer

  if (!startedKcContainer) {
    throw new Error('Keycloak container failed to start')
  }

  kc = startedKcContainer
})

afterAll(async () => {
  await testEnv.stop()
})

test('Postgres', async () => {
  expect(pg.doesDatabaseExist('keycloak', 'keycloak')).toBeTruthy()
  expect(pg.getOneCXExposedPort()).toBeGreaterThan(0)
})

test('Keycloak', async () => {
  expect(kc.getOneCXExposedPort()).toBeGreaterThan(0)
  expect(kc.getOneCXAdminUsername()).toBe('admin')
})
