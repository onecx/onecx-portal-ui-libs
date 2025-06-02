import { GenericContainer, StartedNetwork, StartedTestContainer } from 'testcontainers'
import * as path from 'path'

export class PostgresContainer {
  private container?: StartedTestContainer

  private readonly POSTGRES_PORT = 5432
  private readonly POSTGRES_VERSION = '13.4'
  private readonly POSTGRES_NETWORK_ALIAS = 'postgresdb'
  private readonly POSTGRES_PASSWORD = 'admin'
  private readonly POSTGRES_USERNAME = 'postgres'
  private readonly POSTGRES_DATABASE = 'postgres'
  private readonly INIT_SQL_PATH = path.resolve(__dirname, '..', '..', 'init-data', 'db', 'init-db.sql')

  constructor(private readonly network: StartedNetwork) {}

  public async start(): Promise<StartedTestContainer> {
    this.container = await new GenericContainer(`postgres:${this.POSTGRES_VERSION}`)
      .withExposedPorts(this.POSTGRES_PORT)
      .withEnvironment({ POSTGRES_PASSWORD: this.POSTGRES_PASSWORD })
      .withEnvironment({ POSTGRES_USERNAME: this.POSTGRES_USERNAME })
      .withEnvironment({ POSTGRES_DATABASE: this.POSTGRES_DATABASE })
      .withCommand(['-c', 'max_prepared_transactions=100'])
      .withCopyFilesToContainer([
        {
          source: this.INIT_SQL_PATH,
          target: '/docker-entrypoint-initdb.d/init-db.sql',
        },
      ])
      .withHealthCheck({
        test: ['CMD-SHELL', 'pg_isready -U postgres'],
        interval: 10_000,
        timeout: 5_000,
        retries: 3,
        startPeriod: 5_000,
      })
      .withNetworkAliases(this.POSTGRES_NETWORK_ALIAS)
      .withNetwork(this.network)
      .start()

    return this.container
  }

  public async stop(): Promise<void> {
    if (this.container) {
      await this.container.stop()
    }
  }

  public getHost(): string {
    if (!this.container) throw new Error('Container not started')
    return this.container.getHost()
  }

  public getPort(): number {
    if (!this.container) throw new Error('Container not started')
    return this.container.getMappedPort(this.POSTGRES_PORT)
  }

  public getPassword() {
    if (!this.container) throw new Error('Contianer not started')
    return this.POSTGRES_PASSWORD
  }

  public getDatabase() {
    if (!this.container) throw new Error('Contianer not started')
    return this.POSTGRES_DATABASE
  }

  public getUsername() {
    if (!this.container) throw new Error('Contianer not started')
    return this.POSTGRES_USERNAME
  }
}
