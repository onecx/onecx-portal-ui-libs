import { GenericContainer, StartedNetwork, StartedTestContainer } from 'testcontainers'
import * as path from 'path'

export class KeycloakContainer {
  private container?: StartedTestContainer

  private readonly KEYCLOAK_ADMIN = 'admin'
  private readonly KEYCLOAK_ADMIN_PASSWORD = 'admin'
  private readonly KEYCLOAK_PORT = 8080
  private readonly KEYCLOAK_VERSION = '23.0.4'
  private readonly KEYCLOAK_NETWORK_ALIAS = 'keycloak-app'
  private readonly realmPath = path.resolve(
    __dirname,
    '..',
    '..',
    'init-data',
    'keycloak',
    'imports',
    'realm-onecx.json'
  )

  constructor(private readonly network: StartedNetwork) {}

  async start(): Promise<StartedTestContainer> {
    this.container = await new GenericContainer(`quay.io/keycloak/keycloak:${this.KEYCLOAK_VERSION}`)
      .withCommand(['start-dev', '--import-realm'])
      .withEnvironment({
        KEYCLOAK_ADMIN: this.KEYCLOAK_ADMIN,
        KEYCLOAK_ADMIN_PASSWORD: this.KEYCLOAK_ADMIN_PASSWORD,
        KC_DB: 'postgres',
        KC_DB_POOL_INITIAL_SIZE: '1',
        KC_DB_POOL_MAX_SIZE: '5',
        KC_DB_POOL_MIN_SIZE: '2',
        KC_DB_URL_DATABASE: 'keycloak',
        KC_DB_URL_HOST: 'postgresdb',
        KC_DB_USERNAME: 'keycloak',
        KC_DB_PASSWORD: 'keycloak',
        KC_HOSTNAME: 'keycloak-app',
        KC_HOSTNAME_STRICT: 'false',
        KC_HTTP_ENABLED: 'true',
        KC_HTTP_PORT: `${this.KEYCLOAK_PORT}`,
        KC_HEALTH_ENABLED: 'true',
      })
      .withExposedPorts(this.KEYCLOAK_PORT)
      .withCopyFilesToContainer([
        {
          source: this.realmPath,
          target: '/opt/keycloak/data/import/realm-onecx.json',
        },
      ])
      .withHealthCheck({
        test: [
          'CMD-SHELL',
          "{ printf >&3 'GET /realms/onecx/.well-known/openid-configuration HTTP/1.0\r\nHost: localhost\r\n\r\n'; cat <&3; } 3<>/dev/tcp/localhost/8080 | head -1 | grep 200",
        ],
        interval: 10_000,
        timeout: 5_000,
        retries: 3,
        startPeriod: 5_000,
      })
      .withNetwork(this.network)
      .withNetworkAliases(this.KEYCLOAK_NETWORK_ALIAS)
      .start()

    return this.container
  }

  async stop() {
    if (this.container) {
      await this.container.stop()
    }
  }
  public getPort(): number {
    if (!this.container) throw new Error('Container not started')
    return this.container.getMappedPort(this.KEYCLOAK_PORT)
  }
}
