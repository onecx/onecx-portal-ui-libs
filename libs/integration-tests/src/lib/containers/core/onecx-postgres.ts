import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { HealthCheckableContainer } from '../../models/health-checkable-container.interface'
import { SkipHealthCheckExecutor } from '../../utils/health-check-executor'

interface OnecxPostgresDetails {
  postgresDatabase: string
  postgresUsername: string
  postgresPassword: string
  port: number
}

export class OnecxPostgresContainer extends GenericContainer {
  private onecxPostgresDetails: OnecxPostgresDetails = {
    postgresDatabase: 'postgres',
    postgresUsername: 'postgres',
    postgresPassword: 'admin',
    port: 5432,
  }
  private defaultHealthCheck: HealthCheck = {
    test: ['CMD-SHELL', `pg_isready -U ${this.onecxPostgresDetails.postgresUsername}`],
    interval: 10_000,
    timeout: 5_000,
    retries: 3,
  }

  protected loggingEnabled = false

  constructor(image: string) {
    super(image)
    this.withCommand(['-cmax_prepared_transactions=100'])
    this.withHealthCheck(this.defaultHealthCheck)
    this.withExposedPorts(this.onecxPostgresDetails.port)
    this.withNetworkAliases('postgresdb')
  }

  public withPostgresDatabase(postgresDatabase: string): this {
    this.onecxPostgresDetails.postgresDatabase = postgresDatabase
    return this
  }

  public withPostgresUsername(postgresUsername: string): this {
    this.onecxPostgresDetails.postgresUsername = postgresUsername
    return this
  }

  public withPostgresPassword(postgresPassword: string): this {
    this.onecxPostgresDetails.postgresPassword = postgresPassword
    return this
  }

  public getPostgresDatabase() {
    return this.onecxPostgresDetails.postgresDatabase
  }

  public getPostgresUsername() {
    return this.onecxPostgresDetails.postgresUsername
  }

  public getPostgresPassword() {
    return this.onecxPostgresDetails.postgresPassword
  }

  public enableLogging(log: boolean): this {
    this.loggingEnabled = log
    return this
  }

  override async start(): Promise<StartedOnecxPostgresContainer> {
    // Re-apply the default health check explicitly if it has not been overridden.
    // This ensures the healthcheck is correctly registered before container startup
    if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
      this.withHealthCheck(this.defaultHealthCheck)
    }
    // Spread existing environment variables to preserve previously set values.
    // This ensures that calling withEnvironment() does not override earlier configurations.
    this.withEnvironment({
      ...this.environment,
      POSTGRES_DB: this.onecxPostgresDetails.postgresDatabase,
      POSTGRES_USER: this.onecxPostgresDetails.postgresUsername,
      POSTGRES_PASSWORD: this.onecxPostgresDetails.postgresPassword,
    })
    if (this.loggingEnabled) {
      this.withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(`${this.networkAliases[0]}: `, line))
        stream.on('err', (line) => console.error(`${this.networkAliases[0]}: `, line))
        stream.on('end', () => console.log(`${this.networkAliases[0]}: Stream closed`))
      })
    }
    this.withWaitStrategy(Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()]))
    return new StartedOnecxPostgresContainer(await super.start(), this.onecxPostgresDetails, this.networkAliases)
  }
}

export class StartedOnecxPostgresContainer extends AbstractStartedContainer implements HealthCheckableContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxPostgresDetails: OnecxPostgresDetails,
    private readonly networkAliases: string[]
  ) {
    super(startedTestContainer)
  }

  getHealthCheckExecutor(): SkipHealthCheckExecutor {
    return new SkipHealthCheckExecutor('Postgres Container')
  }

  public getPostgresDatabase(): string {
    return this.onecxPostgresDetails.postgresDatabase
  }

  public getPostgresUsername(): string {
    return this.onecxPostgresDetails.postgresUsername
  }

  public getPostgresPassword(): string {
    return this.onecxPostgresDetails.postgresPassword
  }

  public getPort(): number {
    return this.onecxPostgresDetails.port
  }

  public getNetworkAliases(): string[] {
    return this.networkAliases
  }

  private async execCommandsSQL(commands: string[]): Promise<void> {
    for (const command of commands) {
      try {
        const result = await this.exec([
          'psql',
          '-v',
          'ON_ERROR_STOP=1',
          '-U',
          this.getPostgresUsername(),
          '-d',
          'postgres',
          '-c',
          command,
        ])

        if (result.exitCode !== 0) {
          throw new Error(`Command failed with exit code ${result.exitCode}: ${result.output}`)
        }
      } catch (error) {
        console.error(`Failed to execute command: ${command}`, error)
        throw error
      }
    }
  }

  public async getDatabases(): Promise<string[]> {
    const { output, stderr, exitCode } = await this.exec([
      'psql',
      '-U',
      'postgres',
      '-tc',
      `SELECT datname FROM pg_database WHERE datistemplate = false`,
    ])

    if (exitCode === 0) {
      const databases = output
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)

      return databases
    } else {
      console.error(`Error listing databases: ${stderr}`)
      return []
    }
  }

  public async doesDatabaseExist(database: string): Promise<void> {
    const command = [`SELECT 1 FROM pg_database WHERE datname='${database}'`]
    await this.execCommandsSQL(command)
  }

  public async createDatabaseUser(user: string, password: string): Promise<void> {
    const command = [`CREATE USER ${user} WITH ENCRYPTED PASSWORD '${password}';`]
    await this.execCommandsSQL(command)
  }

  public async createDatabase(user: string): Promise<void> {
    const commands = [
      `CREATE DATABASE ${user} WITH OWNER ${user};`,
      `GRANT ALL PRIVILEGES ON DATABASE ${user} TO ${user};`,
    ]
    await this.execCommandsSQL(commands)
  }

  public async createUserAndDatabase(user: string, password: string): Promise<void> {
    await this.createDatabaseUser(user, password)
    await this.createDatabase(user)
  }
}
