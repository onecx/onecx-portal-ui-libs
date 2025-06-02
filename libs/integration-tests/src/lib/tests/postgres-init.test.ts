import { TestEnvironmentFactory } from '../environment/TestEnvironmentFactory'
import { Client } from 'pg'

let testEnv: TestEnvironmentFactory
let client: Client

beforeAll(async () => {
  testEnv = new TestEnvironmentFactory()
  await testEnv.start()

  const postgres = testEnv.getPostgres()
  client = new Client({
    host: postgres.getHost(),
    port: postgres.getPort(),
    user: postgres.getUsername(),
    password: postgres.getPassword(),
    database: postgres.getDatabase(),
  })
  await client.connect()
})

afterAll(async () => {
  if (client) await client.end()
  await testEnv.stop()
})

describe('Postgres Testcontainer Integration', () => {
  it('should list all expected databases', async () => {
    const expectedDatabases = [
      'keycloak',
      'keycloak_public',
      'onecx_theme',
      'onecx_workspace',
      'onecx_permission',
      'onecx_product_store',
      'onecx_user_profile',
      'onecx_tenant',
      'onecx_welcome',
      'onecx_help',
      'onecx_parameter',
    ]

    const res = await client.query('SELECT datname FROM pg_database WHERE datistemplate = false;')

    const dbNames = res.rows.map((row: any) => row.datname)
    console.log('Databases found:', dbNames)

    for (const name of expectedDatabases) {
      expect(dbNames).toContain(name)
    }
  })
})
