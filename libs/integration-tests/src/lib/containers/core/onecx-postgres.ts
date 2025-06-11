import { StartedNetwork, StartedTestContainer } from 'testcontainers'
import { OneCXContainer, StartedOneCXContainer } from '../abstract/onecx-container'

export class OneCXPostgresContainer extends OneCXContainer {
  private onecxStartCommand: string[] = ['-cmax_prepared_transactions=100']
  private initDataPaths: string[] = []

  constructor(image: string, network: StartedNetwork) {
    super(image, 'postgresdb', 'postgresdb', network)

    this.withOneCXEnvironment({
      POSTGRES_DB: 'postgres',
      POSTGRES_USER: 'postgres',
      POSTGRES_PASSWORD: 'admin',
    })
      .withOneCXHealthCheck({
        test: ['CMD-SHELL', 'pg_isready -U postgres'],
        interval: 10_000,
        timeout: 5_000,
        retries: 3,
      })
      .withOneCXExposedPort(5432)
  }

  public withOneCXStartCommand(startCommand: string[]) {
    this.onecxStartCommand = startCommand
    return this
  }

  public withOneCXInitPath(path: string) {
    this.initDataPaths.push(path)
    return this
  }

  public getOneCXStartCommand() {
    return this.onecxStartCommand
  }

  override async start(): Promise<StartedOneCXPostgresContainer> {
    this.withCommand(this.onecxStartCommand)

    return new StartedOneCXPostgresContainer(
      await super.start(),
      this.getOneCXName(),
      this.getOneCXAlias(),
      this.getOneCXNetwork(),
      this.getOneCXExposedPort()
    )
  }
}

export class StartedOneCXPostgresContainer extends StartedOneCXContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    name: string,
    alias: string,
    network: StartedNetwork,
    exposedPort: number | undefined
  ) {
    super(startedTestContainer, name, alias, network, exposedPort)
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

  public async doesDatabaseExist(user: string, database: string): Promise<boolean> {
    const { stdout } = await this.exec([
      'psql',
      '-U',
      user,
      '-tc',
      `SELECT 1 FROM pg_database WHERE datname='${database}'`,
    ])
    return stdout.trim() === '1'
  }

  public async createUserAndDatabase(user: string, password: string): Promise<boolean> {
    const commands = [
      `CREATE USER ${user} WITH ENCRYPTED PASSWORD '${password}';`,
      `CREATE DATABASE ${user} WITH OWNER ${user};`,
      `GRANT ALL PRIVILEGES ON DATABASE ${user} TO ${user};`,
    ]

    for (const command of commands) {
      const { stderr, exitCode } = await this.exec(['psql', '-U', 'postgres', '-c', command])

      if (exitCode !== 0) {
        console.error(`Failed to execute: ${command}\nError: ${stderr}`)
        return false
      }
    }

    console.log(`User and database "${user}" created successfully.`)
    return true
  }
}
