import { assert } from 'console'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'
import { Client } from 'pg'
import { POSTGRES } from '../../config/env'

xdescribe('Default Postgres Testcontainer', () => {
  let client: Client
  let pgContainer: StartedOnecxPostgresContainer

  beforeAll(async () => {
    pgContainer = await new OnecxPostgresContainer(POSTGRES).start()

    client = new Client({
      host: pgContainer.getHost(),
      port: pgContainer.getMappedPort(pgContainer.getPort()),
      user: pgContainer.getPostgresUsername(),
      password: pgContainer.getPostgresPassword(),
      database: pgContainer.getPostgresDatabase(),
    })
    await client.connect()
  }, 120_000)
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

  it('should pass pg_isready health check', async () => {
    const result = await pgContainer.exec(['pg_isready', '-U', pgContainer.getPostgresUsername()])

    expect(result.output).toContain('accepting connections')
  })

  it('should use the correct port', () => {
    const port = pgContainer.getPort()

    expect(port).toBe(5432)
  })

  afterAll(async () => {
    if (client) await client.end()
    await pgContainer.stop()
  })
})
