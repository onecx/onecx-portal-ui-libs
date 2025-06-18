import { assert } from 'console'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { Client } from 'pg'

describe('Default Postgres Testcontainer', () => {
  let client: Client
  let pgContainer: StartedOnecxPostgresContainer
  const imagePg = 'docker.io/library/postgres:13.4'

  beforeAll(async () => {
    pgContainer = await new OnecxPostgresContainer(imagePg).start()

    client = new Client({
      host: pgContainer.getHost(),
      port: pgContainer.getPort(),
      user: pgContainer.getPostgresUsername(),
      password: pgContainer.getPostgresPassword(),
      database: pgContainer.getPostgresDatabase(),
    })
    await client.connect()
  })
  it('should create database', async () => {
    const username = 'keycloak'
    const password = 'keycloak'

    await pgContainer.createUserAndDatabase(username, password)
    assert(true, await pgContainer.doesDatabaseExist(username))
  })
  it('should create user', async () => {
    const username = 'booky'
    const password = 'booky'
    await expect(pgContainer.createDatabaseUser(username, password)).resolves.not.toThrow()
  })
  it('should return correct database details', () => {
    expect(pgContainer.getPostgresDatabase()).toBe('postgres')
    expect(pgContainer.getPostgresUsername()).toBe('postgres')
    expect(pgContainer.getPostgresPassword()).toBe('admin')
  })
  it('should have valid network aliases', () => {
    const aliases = pgContainer.getNetworkAliases()
    expect(Array.isArray(aliases)).toBe(true)
    expect(aliases).toContain('postgresdb')
  })
  afterAll(async () => {
    if (client) await client.end()
    await pgContainer.stop()
  })
})
