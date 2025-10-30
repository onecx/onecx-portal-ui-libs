import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { SvcDetails, SvcContainerServices } from '../../models/svc.interface'
import { getCommonEnvironmentVariables } from '../../utils/common-env.utils'
import { HealthCheckableContainer } from '../../models/health-checkable-container.interface'
import { HealthCheckExecutor } from '../../models/health-check-executor.interface'
import { buildHealthCheckUrl } from '../../utils/health-check.utils'
import { HttpHealthCheckExecutor, SkipHealthCheckExecutor } from '../../utils/health-check-executor'

export class SvcContainer extends GenericContainer {
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
        this.details.databasePassword
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
        stream.on('data', (line) => console.log(`${this.networkAliases[0]}: `, line))
        stream.on('err', (line) => console.error(`${this.networkAliases[0]}: `, line))
        stream.on('end', () => console.log(`${this.networkAliases[0]}: Stream closed`))
      })
    }

    this.withWaitStrategy(Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()]))
    return new StartedSvcContainer(
      await super.start(),
      this.details,
      this.networkAliases,
      this.port,
      this.healthCheck || this.defaultHealthCheck
    )
  }
}

export class StartedSvcContainer extends AbstractStartedContainer implements HealthCheckableContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly details: SvcDetails,
    private readonly networkAliases: string[],
    private readonly port: number,
    private readonly healthCheck: HealthCheck
  ) {
    super(startedTestContainer)
  }

  /**
   * Creates Quarkus-specific health check strategy
   * Uses URL from health check or falls back to default
   */
  getHealthCheckExecutor(): HealthCheckExecutor {
    const mappedPort = this.getMappedPort(this.port)

    // Build URL from health check configuration
    const endpoint = buildHealthCheckUrl(mappedPort, this.healthCheck)

    // If no valid URL can be extracted, skip health check
    if (!endpoint) {
      return new SkipHealthCheckExecutor('No valid health check URL could be extracted')
    }

    // Use timeout from health check if available, otherwise default
    const timeout = this.healthCheck?.timeout || 8000

    return new HttpHealthCheckExecutor(endpoint, timeout, [200, 503])
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
