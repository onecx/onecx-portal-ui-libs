import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import * as path from 'path'
import { StartedOnecxPostgresContainer } from './onecx-postgres'
import { HealthCheck } from 'testcontainers/build/types'

interface OnecxKeycloakEnvironment {
  onecxRealm: string
  adminUsername: string
  adminPassword: string
  username: string
  database: string
  password: string
  hostname: string
  keycloakPort: number
  networkAliases: string[] | undefined
}

export class OnecxKeycloakContainer extends GenericContainer {
  private onecxKeycloakEnvironment: OnecxKeycloakEnvironment = {
    onecxRealm: 'onecx',
    adminUsername: 'admin',
    adminPassword: 'admin',
    username: 'keycloak',
    database: 'keycloak',
    password: 'keycloak',
    hostname: 'keycloak-app',
    keycloakPort: 8080,
    networkAliases: undefined,
  }
  private defaultHealthCheck: HealthCheck = {
    test: [
      'CMD-SHELL',
      `{ printf >&3 'GET /realms/${this.onecxKeycloakEnvironment.onecxRealm}/.well-known/openid-configuration HTTP/1.0\\r\\nHost: localhost\\r\\n\\r\\n'; cat <&3; } 3<>/dev/tcp/localhost/${this.onecxKeycloakEnvironment.keycloakPort} | head -1 | grep 200`,
    ],
    interval: 10_000,
    timeout: 5_000,
    retries: 10,
  }
  private initDefaultRealms: string[] = []
  private initDefaultRealm = 'libs/integration-tests/src/init-data/keycloak/imports'

  constructor(
    image: string,
    private readonly databaseContainer: StartedOnecxPostgresContainer
  ) {
    super(image)
    this.withCommand(['start-dev', '--import-realm'])
    this.withHealthCheck(this.defaultHealthCheck)
    this.withExposedPorts(this.onecxKeycloakEnvironment.keycloakPort)
    this.withNetworkAliases('keycloak-app')
  }

  withOnecxRealm(onecxRealm: string): this {
    this.onecxKeycloakEnvironment.onecxRealm = onecxRealm
    return this
  }

  withAdminUsername(adminUsername: string): this {
    this.onecxKeycloakEnvironment.adminUsername = adminUsername
    return this
  }

  withAdminPassword(adminPassword: string): this {
    this.onecxKeycloakEnvironment.adminPassword = adminPassword
    return this
  }

  withUsername(username: string): this {
    this.onecxKeycloakEnvironment.username = username
    return this
  }

  withPassword(password: string): this {
    this.onecxKeycloakEnvironment.password = password
    return this
  }

  withEnvironmentHostname(hostname: string): this {
    this.onecxKeycloakEnvironment.hostname = hostname
    return this
  }

  withInitPath(path: string) {
    this.initDefaultRealms.push(path)
    return this
  }

  withDatabase(database: string): this {
    this.onecxKeycloakEnvironment.database = database
    return this
  }

  // GET-Methoden
  getOnecxRealm(): string {
    return this.onecxKeycloakEnvironment.onecxRealm
  }

  getAdminUsername(): string {
    return this.onecxKeycloakEnvironment.adminUsername
  }

  getAdminPassword(): string {
    return this.onecxKeycloakEnvironment.adminPassword
  }

  getUsername(): string {
    return this.onecxKeycloakEnvironment.username
  }

  getPassword(): string {
    return this.onecxKeycloakEnvironment.password
  }

  getEnvironmentHostname(): string {
    return this.onecxKeycloakEnvironment.hostname
  }

  getKeycloakPort(): number {
    return this.onecxKeycloakEnvironment.keycloakPort
  }

  getNetworkAliases(): string[] {
    if (this.onecxKeycloakEnvironment.networkAliases === undefined) {
      this.onecxKeycloakEnvironment.networkAliases = []
    }
    return this.onecxKeycloakEnvironment.networkAliases
  }

  getDatabase() {
    return this.onecxKeycloakEnvironment.database
  }

  override async start(): Promise<StartedOnecxKeycloakContainer> {
    this.databaseContainer.createUserAndDatabase(
      this.onecxKeycloakEnvironment.username,
      this.onecxKeycloakEnvironment.password
    )
    if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
      this.withHealthCheck(this.defaultHealthCheck)
    }
    this.withEnvironment({
      ...this.environment,
      KEYCLOAK_ADMIN: this.onecxKeycloakEnvironment.adminUsername,
      KEYCLOAK_ADMIN_PASSWORD: this.onecxKeycloakEnvironment.adminPassword,
      KC_DB: this.databaseContainer.getDatabase(),
      // where do I get this informaiton?
      KC_DB_POOL_INITIAL_SIZE: '1',
      KC_DB_POOL_MAX_SIZE: '5',
      KC_DB_POOL_MIN_SIZE: '2',
      KC_DB_URL_DATABASE: this.onecxKeycloakEnvironment.database,
      KC_DB_URL_HOST: this.databaseContainer.getNetworkAliases()[0],
      KC_DB_USERNAME: this.onecxKeycloakEnvironment.username,
      KC_DB_PASSWORD: this.onecxKeycloakEnvironment.password,
      KC_HOSTNAME: this.onecxKeycloakEnvironment.hostname,
      KC_HOSTNAME_STRICT: 'false',
      KC_HTTP_ENABLED: 'true',
      KC_HTTP_PORT: `${this.onecxKeycloakEnvironment.keycloakPort}`,
      KC_HEALTH_ENABLED: 'true',
    })
    this.withLogConsumer((stream) => {
      stream.on('data', (line) => console.log(`${this.onecxKeycloakEnvironment.username}: `, line))
      stream.on('err', (line) => console.error(`${this.onecxKeycloakEnvironment.username}: `, line))
      stream.on('end', () => console.log(`${this.onecxKeycloakEnvironment.username}: Stream closed`))
    })
    this.withInitPath(this.initDefaultRealm)

    for (const p of this.initDefaultRealms) {
      this.withCopyDirectoriesToContainer([
        {
          source: path.resolve(p),
          target: '/opt/keycloak/data/import',
        },
      ])
    }
    this.withWaitStrategy(Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()]))
    this.onecxKeycloakEnvironment.networkAliases = this.networkAliases

    return new StartedOnecxKeycloakContainer(await super.start(), this.onecxKeycloakEnvironment)
  }
}

export class StartedOnecxKeycloakContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxKeycloakEnvironment: OnecxKeycloakEnvironment
  ) {
    super(startedTestContainer)
  }
  getOnecxRealm(): string {
    return this.onecxKeycloakEnvironment.onecxRealm
  }

  getAdminUsername(): string {
    return this.onecxKeycloakEnvironment.adminUsername
  }

  getAdminPassword(): string {
    return this.onecxKeycloakEnvironment.adminPassword
  }

  getUsername(): string {
    return this.onecxKeycloakEnvironment.username
  }

  getPassword(): string {
    return this.onecxKeycloakEnvironment.password
  }

  getEnvironmentHostname(): string {
    return this.onecxKeycloakEnvironment.hostname
  }

  getDatabase(): string {
    return this.onecxKeycloakEnvironment.database
  }

  getKeycloakPort(): number {
    return this.onecxKeycloakEnvironment.keycloakPort
  }

  getNetworkAliases(): string[] {
    if (this.onecxKeycloakEnvironment.networkAliases === undefined) {
      this.onecxKeycloakEnvironment.networkAliases = []
    }
    return this.onecxKeycloakEnvironment.networkAliases
  }
}
