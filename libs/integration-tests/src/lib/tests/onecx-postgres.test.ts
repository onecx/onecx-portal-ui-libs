import { assert } from 'console'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { Client } from 'pg'

let client: Client
let pgContainer: StartedOnecxPostgresContainer

beforeAll(async () => {
  const imagePg = 'docker.io/library/postgres:13.4'

  pgContainer = await new OnecxPostgresContainer(imagePg).start()

  client = new Client({
    host: pgContainer.getHost(),
    port: pgContainer.getPort(),
    user: pgContainer.getUsername(),
    password: pgContainer.getPassword(),
    database: pgContainer.getDatabase(),
  })
  await client.connect()
})

afterAll(async () => {
  if (client) await client.end()
  await pgContainer.stop()
})
// Tests are not complete and need to be expanded
describe('Default Postgres Testcontainer', () => {
  it('should create database', async () => {
    const username = 'keycloak'
    const password = 'keycloak'

    await pgContainer.createUserAndDatabase(username, password)
    assert(true, await pgContainer.doesDatabaseExist(username))
  })
  it('should return correct database details', () => {
    expect(pgContainer.getDatabase()).toBe('postgres')
    expect(pgContainer.getUsername()).toBe('postgres')
    expect(pgContainer.getPassword()).toBe('admin')
  })
  it('should have valid network aliases', () => {
    const aliases = pgContainer.getNetworkAliases()
    expect(Array.isArray(aliases)).toBe(true)
    expect(aliases).toContain('postgresdb')
  })
})
