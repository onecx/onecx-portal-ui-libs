import { StartedNetwork, StartedTestContainer } from 'testcontainers'
import { commonEnv } from '../../config/env'
import { OneCXContainer, StartedOneCXContainer } from '../abstract/onecx-container'
import * as path from 'path'

export interface OneCXKeycloakDetails {
  onecxRealm: string
  adminRealm: string
  adminUsername: string
  adminPassword: string
}

export class OneCXKeycloakContainer extends OneCXContainer {
  private onecxStartCommand: string[] = ['start-dev', '--import-realm']
  private onecxKeycloakDetails: OneCXKeycloakDetails = {
    onecxRealm: commonEnv.KC_REALM,
    adminRealm: 'master',
    adminUsername: 'admin',
    adminPassword: 'admin',
  }
  private onecxStartTimeout = 100_000
  private initDataPaths: string[] = []
  private defaultInitDataPath = 'libs/integration-tests/src/init-data/keycloak/imports'
  private defaultInitEnabled = true

  constructor(
    image: string,
    network: StartedNetwork,
    private readonly databaseContainer: OneCXContainer | StartedOneCXContainer
  ) {
    const name = 'keycloak-app'
    const alias = 'keycloak-app'
    const port = 8080
    super(image, name, alias, network)

    this.withOneCXRealm(commonEnv.KC_REALM)
      .withOneCXEnvironment({
        KEYCLOAK_ADMIN: this.onecxKeycloakDetails.adminUsername,
        KEYCLOAK_ADMIN_PASSWORD: this.onecxKeycloakDetails.adminPassword,
        KC_DB: 'postgres',
        KC_DB_POOL_INITIAL_SIZE: '1',
        KC_DB_POOL_MAX_SIZE: '5',
        KC_DB_POOL_MIN_SIZE: '2',
        KC_DB_URL_DATABASE: 'keycloak',
        KC_DB_URL_HOST: `${databaseContainer.getOneCXAlias()}`,
        KC_DB_USERNAME: 'keycloak',
        KC_DB_PASSWORD: 'keycloak',
        KC_HOSTNAME: `${alias}`,
        KC_HOSTNAME_STRICT: 'false',
        KC_HTTP_ENABLED: 'true',
        KC_HTTP_PORT: `${port}`,
        KC_HEALTH_ENABLED: 'true',
      })
      .withOneCXHealthCheck({
        test: [
          'CMD-SHELL',
          `{ printf >&3 'GET /realms/${this.getOneCXRealm()}/.well-known/openid-configuration HTTP/1.0\\r\\nHost: localhost\\r\\n\\r\\n'; cat <&3; } 3<>/dev/tcp/localhost/${port} | head -1 | grep 200`,
        ],
        interval: 10_000,
        timeout: 5_000,
        retries: 10,
      })
      .withOneCXExposedPort(port)
  }

  public override withOneCXAlias(alias: string): this {
    super.withOneCXAlias(alias)

    this.updateEnv()
    return this
  }

  public override withOneCXExposedPort(port: number): this {
    super.withOneCXExposedPort(port)

    this.updateEnv()

    this.updateHealthCheck()
    return this
  }

  public withOneCXStartCommand(startCommand: string[]) {
    this.onecxStartCommand = startCommand
    return this
  }

  public withOneCXStartupTimeout(timeout: number) {
    this.onecxStartTimeout = timeout
  }

  public withOneCXRealm(realm: string) {
    this.onecxKeycloakDetails.onecxRealm = realm
    return this
  }

  public withOneCXAdminRealm(realm: string) {
    this.onecxKeycloakDetails.adminRealm = realm
    return this
  }

  public withOneCXAdminUsername(username: string) {
    this.onecxKeycloakDetails.adminUsername = username
    return this
  }

  public withOneCXAdminPassword(password: string) {
    this.onecxKeycloakDetails.adminPassword = password
    return this
  }

  public withOneCXDefaultInitEnabled(enabled: boolean) {
    this.defaultInitEnabled = enabled
    return this
  }

  public withOneCXInitPath(path: string) {
    this.initDataPaths.push(path)
    return this
  }

  public getOneCXStartCommand() {
    return this.onecxStartCommand
  }

  public getOneCXRealm() {
    return this.onecxKeycloakDetails.onecxRealm
  }

  public getOneCXAdminRealm() {
    return this.onecxKeycloakDetails.adminRealm
  }

  public getOneCXAdminUsername() {
    return this.onecxKeycloakDetails.adminUsername
  }

  public getOneCXAdminPassword() {
    return this.onecxKeycloakDetails.adminPassword
  }

  override async start(): Promise<StartedOneCXKeycloakContainer> {
    this.withCommand(this.onecxStartCommand).withStartupTimeout(this.onecxStartTimeout)

    this.defaultInitEnabled && this.initDataPaths.push(this.defaultInitDataPath)

    for (const p of this.initDataPaths) {
      this.withCopyDirectoriesToContainer([
        {
          source: path.resolve(p),
          target: '/opt/keycloak/data/import',
        },
      ])
    }

    return new StartedOneCXKeycloakContainer(
      await super.start(),
      this.getOneCXName(),
      this.getOneCXAlias(),
      this.getOneCXNetwork(),
      this.onecxKeycloakDetails,
      this.getOneCXExposedPort()
    )
  }

  private updateEnv() {
    this.withOneCXEnvironment({
      KEYCLOAK_ADMIN: this.onecxKeycloakDetails.adminUsername,
      KEYCLOAK_ADMIN_PASSWORD: this.onecxKeycloakDetails.adminPassword,
      KC_DB: 'postgres',
      KC_DB_POOL_INITIAL_SIZE: '1',
      KC_DB_POOL_MAX_SIZE: '5',
      KC_DB_POOL_MIN_SIZE: '2',
      KC_DB_URL_DATABASE: 'keycloak',
      KC_DB_URL_HOST: `${this.databaseContainer.getOneCXAlias()}`,
      KC_DB_USERNAME: 'keycloak',
      KC_DB_PASSWORD: 'keycloak',
      KC_HOSTNAME: `${this.getOneCXAlias()}`,
      KC_HOSTNAME_STRICT: 'false',
      KC_HTTP_ENABLED: 'true',
      KC_HTTP_PORT: `${this.getOneCXExposedPort()}`,
      KC_HEALTH_ENABLED: 'true',
    })
  }

  private updateHealthCheck() {
    this.withOneCXHealthCheck({
      test: [
        'CMD-SHELL',
        `{ printf >&3 'GET /realms/${this.getOneCXRealm()}/.well-known/openid-configuration HTTP/1.0\\r\\nHost: localhost\\r\\n\\r\\n'; cat <&3; } 3<>/dev/tcp/localhost/${this.getOneCXExposedPort()} | head -1 | grep 200`,
      ],
      interval: 10_000,
      timeout: 5_000,
      retries: 10,
    })
  }
}

export class StartedOneCXKeycloakContainer extends StartedOneCXContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    name: string,
    alias: string,
    network: StartedNetwork,
    private readonly onecxKeycloakDetails: OneCXKeycloakDetails,
    exposedPort: number | undefined
  ) {
    super(startedTestContainer, name, alias, network, exposedPort)
  }

  public getOneCXRealm() {
    return this.onecxKeycloakDetails.onecxRealm
  }

  public getOneCXAdminRealm() {
    return this.onecxKeycloakDetails.adminRealm
  }

  public getOneCXAdminUsername() {
    return this.onecxKeycloakDetails.adminUsername
  }

  public getOneCXAdminPassword() {
    return this.onecxKeycloakDetails.adminPassword
  }
}
