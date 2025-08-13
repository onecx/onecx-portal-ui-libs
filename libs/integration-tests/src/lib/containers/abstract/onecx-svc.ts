import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { SvcDetails, SvcContainerServices } from '../../model/svc.interface'
import { getCommonEnvironmentVariables } from '../../utils/common-env'

export abstract class SvcContainer extends GenericContainer {
  protected details: SvcDetails = {
    databaseUsername: '',
    databasePassword: '',
  }

  protected shouldCreateDatabase = true

  protected loggingEnabled = false

  private port = 8080

  private defaultHealthCheck: HealthCheck = {
    test: ['CMD-SHELL', `curl --head -fsS http://localhost:${this.port}/q/health`],
    interval: 10_000,
    timeout: 5_000,
    retries: 3,
  }

  constructor(
    image: string,
    private services: SvcContainerServices
  ) {
    super(image)
    this.withHealthCheck(this.defaultHealthCheck)
    this.withExposedPorts(this.port)
  }

  withDatabaseUsername(databaseUsername: string): this {
    this.details.databaseUsername = databaseUsername
    return this
  }

  withDatabasePassword(databasePassword: string): this {
    this.details.databasePassword = databasePassword
    return this
  }

  getKeycloakContainer() {
    return this.services.keycloakContainer
  }

  getPostgresContainer() {
    return this.services.databaseContainer
  }

  protected validateDatabaseCredentials(): void {
    if (!this.details.databaseUsername || !this.details.databasePassword) {
      throw new Error('Database credentials must be set using withDatabaseUsername and withDatabasePassword')
    }
  }

  createDatabaseAtStart(shouldStart: boolean) {
    this.shouldCreateDatabase = shouldStart
  }

  enableLogging(log: boolean): this {
    this.loggingEnabled = log
    return this
  }

  override async start(): Promise<StartedSvcContainer> {
    if (this.shouldCreateDatabase) {
      this.validateDatabaseCredentials()
      await this.services.databaseContainer?.createUserAndDatabase(
        this.details.databaseUsername,
        this.details.databaseUsername
      )
    }
    // Re-apply the default health check explicitly if it has not been overridden.
    // This ensures the healthcheck is correctly registered before container startup
    if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
      this.withHealthCheck(this.defaultHealthCheck)
    }
    // Spread existing environment variables to preserve previously set values.
    // This ensures that calling withEnvironment() does not override earlier configurations.
    this.withEnvironment({
      ...this.environment,
      QUARKUS_DATASOURCE_USERNAME: this.details.databaseUsername,
      QUARKUS_DATASOURCE_PASSWORD: this.details.databaseUsername,
      QUARKUS_DATASOURCE_JDBC_URL: `jdbc:postgresql://${this.services.databaseContainer?.getNetworkAliases()[0]}:${this.services.databaseContainer?.getPort()}/${this.details.databaseUsername}?sslmode=disable`,
      TKIT_DATAIMPORT_ENABLED: 'true',
      ONECX_TENANT_CACHE_ENABLED: 'false',
    }).withEnvironment(getCommonEnvironmentVariables(this.services.keycloakContainer))
    if (this.loggingEnabled) {
      this.withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(`${this.details.databaseUsername}: `, line))
        stream.on('err', (line) => console.error(`${this.details.databaseUsername}: `, line))
        stream.on('end', () => console.log(`${this.details.databaseUsername}: Stream closed`))
      })
    }

    this.withWaitStrategy(Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()]))
    return new StartedSvcContainer(await super.start(), this.details, this.networkAliases, this.port)
  }
}

export class StartedSvcContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly details: SvcDetails,
    private readonly networkAliases: string[],
    private readonly port: number
  ) {
    super(startedTestContainer)
  }

  getDatabaseUsername(): string {
    return this.details.databaseUsername
  }

  getDatabasePassword(): string {
    return this.details.databasePassword
  }

  getPort(): number {
    return this.port
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }
}
