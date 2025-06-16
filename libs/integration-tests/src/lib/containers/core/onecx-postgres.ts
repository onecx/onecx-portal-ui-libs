import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'

interface OnecxPostgresDetails {
  database: string
  username: string
  password: string
  postgresPort: number
  networkAliases?: string[] | undefined
}

export class OnecxPostgresContainer extends GenericContainer {
  private onecxPostgresDetails: OnecxPostgresDetails = {
    database: 'postgres',
    username: 'postgres',
    password: 'admin',
    postgresPort: 5432,
    networkAliases: undefined,
  }
  private defaultHealthCheck: HealthCheck = {
    test: ['CMD-SHELL', `pg_isready -U ${this.onecxPostgresDetails.username}`],
    interval: 10_000,
    timeout: 5_000,
    retries: 3,
  }

  constructor(image: string) {
    super(image)
    this.withCommand(['-cmax_prepared_transactions=100'])
    this.withHealthCheck(this.defaultHealthCheck)
    this.withExposedPorts(this.onecxPostgresDetails.postgresPort)
    this.withNetworkAliases('postgresdb')
  }

  public withDatabase(database: string): this {
    this.onecxPostgresDetails.database = database
    return this
  }

  public withUsername(username: string): this {
    this.onecxPostgresDetails.username = username
    return this
  }

  public withPassword(password: string): this {
    this.onecxPostgresDetails.password = password
    return this
  }

  public getDatabase() {
    return this.onecxPostgresDetails.database
  }

  public getUser() {
    return this.onecxPostgresDetails.username
  }

  public getPassword() {
    return this.onecxPostgresDetails.password
  }

  public getNetworkAliases() {
    return this.onecxPostgresDetails.networkAliases
  }

  override async start(): Promise<StartedOnecxPostgresContainer> {
    if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
      this.withHealthCheck(this.defaultHealthCheck)
    }
    this.withEnvironment({
      ...this.environment,
      POSTGRES_DB: this.onecxPostgresDetails.database,
      POSTGRES_USER: this.onecxPostgresDetails.username,
      POSTGRES_PASSWORD: this.onecxPostgresDetails.password,
    })

    this.withLogConsumer((stream) => {
      stream.on('data', (line) => console.log(`${this.onecxPostgresDetails.username}: `, line))
      stream.on('err', (line) => console.error(`${this.onecxPostgresDetails.username}: `, line))
      stream.on('end', () => console.log(`${this.onecxPostgresDetails.username}: Stream closed`))
    })
    this.withWaitStrategy(Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()]))
    this.onecxPostgresDetails.networkAliases = this.networkAliases
    return new StartedOnecxPostgresContainer(await super.start(), this.onecxPostgresDetails)
  }
}

export class StartedOnecxPostgresContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxPostgresDetails: OnecxPostgresDetails
  ) {
    super(startedTestContainer)
  }

  public getDatabase(): string {
    return this.onecxPostgresDetails.database
  }

  public getUsername(): string {
    return this.onecxPostgresDetails.username
  }

  public getPassword(): string {
    return this.onecxPostgresDetails.password
  }

  public getPort(): number {
    return super.getMappedPort(this.onecxPostgresDetails.postgresPort)
  }

  public getNetworkAliases(): string[] {
    if (this.onecxPostgresDetails.networkAliases === undefined) {
      this.onecxPostgresDetails.networkAliases = []
    }
    return this.onecxPostgresDetails.networkAliases
  }

  private async execCommandsSQL(commands: string[]): Promise<void> {
    for (const command of commands) {
      try {
        const result = await this.exec([
          'psql',
          '-v',
          'ON_ERROR_STOP=1',
          '-U',
          this.getUsername(),
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

  // TODO make sure that password and user is a valid value. (check for sql injection)
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
