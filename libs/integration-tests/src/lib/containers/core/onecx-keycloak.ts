import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import * as path from 'path'
import { StartedOnecxPostgresContainer } from './onecx-postgres'
import { HealthCheck } from 'testcontainers/build/types'
import { HealthCheckableContainer } from '../../models/health-checkable-container.interface'
import { HealthCheckExecutor } from '../../models/health-check-executor.interface'
import { HttpHealthCheckExecutor, SkipHealthCheckExecutor } from '../../utils/health-check-executor'

interface OnecxEnvironment {
  realm: string
  adminRealm: string
  adminUsername: string
  adminPassword: string
  keycloakDatabaseUsername: string
  keycloakDatabasePassword: string
  keycloakDatabase: string
  keycloakHostname: string
  port: number
}

export class OnecxKeycloakContainer extends GenericContainer {
  private onecxEnvironment: OnecxEnvironment = {
    realm: 'onecx',
    adminRealm: 'master',
    adminUsername: 'admin',
    adminPassword: 'admin',
    keycloakDatabaseUsername: 'keycloak',
    keycloakDatabasePassword: 'keycloak',
    keycloakDatabase: 'keycloak',
    keycloakHostname: 'keycloak-app',
    port: 8080,
  }

  private initDefaultRealms: string[] = []

  private initDefaultRealm = 'libs/integration-tests/src/lib/config'

  protected loggingEnabled = false

  constructor(
    image: string,
    private readonly databaseContainer: StartedOnecxPostgresContainer
  ) {
    super(image)
    this.withCommand(['start-dev', '--import-realm']).withNetworkAliases('keycloak-app').withStartupTimeout(120_000)
  }

  private setDefaultHealthCheck(realm: string, port: number): HealthCheck {
    return {
      test: ['CMD-SHELL', `timeout 5 bash -c 'cat < /dev/null > /dev/tcp/localhost/${port}' || exit 1`],
      interval: 10_000,
      timeout: 5_000,
      retries: 10,
    }
  }

  withRealm(realm: string): this {
    this.onecxEnvironment.realm = realm
    return this
  }

  withAdminUsername(adminUsername: string): this {
    this.onecxEnvironment.adminUsername = adminUsername
    return this
  }

  withAdminPassword(adminPassword: string): this {
    this.onecxEnvironment.adminPassword = adminPassword
    return this
  }

  withKeycloakUsername(keycloakDatabaseUsername: string): this {
    this.onecxEnvironment.keycloakDatabaseUsername = keycloakDatabaseUsername
    return this
  }

  withKeycloakPassword(keycloakDatabasePassword: string): this {
    this.onecxEnvironment.keycloakDatabasePassword = keycloakDatabasePassword
    return this
  }

  withEnvironmentHostname(hostname: string): this {
    this.onecxEnvironment.keycloakHostname = hostname
    return this
  }

  withInitPath(path: string) {
    this.initDefaultRealms.push(path)
    return this
  }

  withKeycloakDatabase(keycloakDatabase: string): this {
    this.onecxEnvironment.keycloakDatabase = keycloakDatabase
    return this
  }

  withAdminRealm(adminRealm: string): this {
    this.onecxEnvironment.adminRealm = adminRealm
    return this
  }

  withPort(port: number): this {
    this.onecxEnvironment.port = port
    return this
  }

  enableLogging(log: boolean): this {
    this.loggingEnabled = log
    return this
  }

  getRealm(): string {
    return this.onecxEnvironment.realm
  }

  getAdminRealm(): string {
    return this.onecxEnvironment.adminRealm
  }

  getAdminUsername(): string {
    return this.onecxEnvironment.adminUsername
  }

  getAdminPassword(): string {
    return this.onecxEnvironment.adminPassword
  }

  getKeycloakDatabaseUsername(): string {
    return this.onecxEnvironment.keycloakDatabaseUsername
  }

  getKeycloakDatabasePassword(): string {
    return this.onecxEnvironment.keycloakDatabasePassword
  }

  getEnvironmentHostname(): string {
    return this.onecxEnvironment.keycloakHostname
  }

  getPort(): number {
    return this.onecxEnvironment.port
  }

  getKeycloakDatabase() {
    return this.onecxEnvironment.keycloakDatabase
  }

  override async start(): Promise<StartedOnecxKeycloakContainer> {
    this.databaseContainer.createUserAndDatabase(
      this.onecxEnvironment.keycloakDatabaseUsername,
      this.onecxEnvironment.keycloakDatabasePassword
    )

    // Apply the default health check explicitly if it has not been set.
    // This ensures the healthcheck is correctly registered before container startup
    if (!this.healthCheck) {
      const defaultHealthCheck: HealthCheck = this.setDefaultHealthCheck(
        this.onecxEnvironment.realm,
        this.onecxEnvironment.port
      )
      this.withHealthCheck(defaultHealthCheck)
    }

    // Spread existing environment variables to preserve previously set values.
    // This ensures that calling withEnvironment() does not override earlier configurations.
    this.withEnvironment({
      ...this.environment,
      KEYCLOAK_ADMIN: this.onecxEnvironment.adminUsername,
      KEYCLOAK_ADMIN_PASSWORD: this.onecxEnvironment.adminPassword,
      KC_DB: this.databaseContainer.getPostgresDatabase(),
      KC_DB_POOL_INITIAL_SIZE: '1',
      KC_DB_POOL_MAX_SIZE: '5',
      KC_DB_POOL_MIN_SIZE: '2',
      KC_DB_URL_DATABASE: this.onecxEnvironment.keycloakDatabase,
      KC_DB_URL_HOST: this.databaseContainer.getNetworkAliases()[0],
      KC_DB_USERNAME: this.onecxEnvironment.keycloakDatabaseUsername,
      KC_DB_PASSWORD: this.onecxEnvironment.keycloakDatabasePassword,
      KC_HOSTNAME: this.onecxEnvironment.keycloakHostname,
      KC_HOSTNAME_STRICT: 'false',
      KC_HTTP_ENABLED: 'true',
      KC_HTTP_PORT: `${this.onecxEnvironment.port}`,
      KC_HEALTH_ENABLED: 'true',
    })
    if (this.loggingEnabled) {
      this.withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(`${this.networkAliases[0]}: `, line))
        stream.on('err', (line) => console.error(`${this.networkAliases[0]}: `, line))
        stream.on('end', () => console.log(`${this.networkAliases[0]}: Stream closed`))
      })
    }
    this.withInitPath(this.initDefaultRealm)

    for (const p of this.initDefaultRealms) {
      this.withCopyDirectoriesToContainer([
        {
          source: path.resolve(p),
          target: '/opt/keycloak/data/import',
        },
      ])
    }

    this.withExposedPorts(this.onecxEnvironment.port).withWaitStrategy(
      Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()])
    )

    return new StartedOnecxKeycloakContainer(
      await super.start(),
      this.onecxEnvironment,
      this.networkAliases,
      this.healthCheck || this.setDefaultHealthCheck(this.onecxEnvironment.realm, this.onecxEnvironment.port)
    )
  }
}

export class StartedOnecxKeycloakContainer extends AbstractStartedContainer implements HealthCheckableContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxKeycloakEnvironment: OnecxEnvironment,
    private readonly networkAliases: string[],
    private readonly healthCheck: HealthCheck
  ) {
    super(startedTestContainer)
  }

  /**
   * Creates Quarkus-specific health check strategy
   * Uses URL from health check or falls back to default
   */
  getHealthCheckExecutor(): HealthCheckExecutor {
    const mappedPort = this.getMappedPort(this.getPort())
    const keycloakUrl = `http://localhost:${mappedPort}/realms/${this.getRealm()}/.well-known/openid-configuration`
    // Build URL from health check configuration
    const endpoint = keycloakUrl

    // If no valid URL can be extracted, skip health check
    if (!endpoint) {
      return new SkipHealthCheckExecutor('Keycloak Container - No valid health check URL could be extracted')
    }

    // Use timeout from health check if available, otherwise default
    const timeout = this.healthCheck?.timeout || 8000

    return new HttpHealthCheckExecutor(endpoint, timeout, [200, 503])
  }

  getRealm(): string {
    return this.onecxKeycloakEnvironment.realm
  }

  getAdminRealm(): string {
    return this.onecxKeycloakEnvironment.adminRealm
  }

  getAdminUsername(): string {
    return this.onecxKeycloakEnvironment.adminUsername
  }

  getAdminPassword(): string {
    return this.onecxKeycloakEnvironment.adminPassword
  }

  getKeycloakDatabaseUsername(): string {
    return this.onecxKeycloakEnvironment.keycloakDatabaseUsername
  }

  getKeycloakDatabasePassword(): string {
    return this.onecxKeycloakEnvironment.keycloakDatabasePassword
  }

  getEnvironmentHostname(): string {
    return this.onecxKeycloakEnvironment.keycloakHostname
  }

  getKeycloakDatabase(): string {
    return this.onecxKeycloakEnvironment.keycloakDatabase
  }

  getPort(): number {
    return this.onecxKeycloakEnvironment.port
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }
}
