import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { BffDetails } from '../../model/bff.model'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export abstract class BffContainer extends GenericContainer {
  private details: BffDetails = {
    permissionsProductName: '',
  }

  private port = 8080

  constructor(
    image: string,
    private readonly keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image)
  }

  private setDefaultHealthCheck(port: number): HealthCheck {
    return {
      test: ['CMD-SHELL', `curl --head -fsS http://localhost:${port}/q/health`],
      interval: 10_000,
      timeout: 5_000,
      retries: 3,
    }
  }

  withPermissionsProductName(permissionsProductName: string): this {
    this.details.permissionsProductName = permissionsProductName
    return this
  }

  withPort(port: number): this {
    this.port = port
    return this
  }

  getKeycloakContainer() {
    return this.keycloakContainer
  }

  getPort() {
    return this.port
  }

  override async start(): Promise<StartedBffContainer> {
    // Apply the default health check explicitly if it has not been set.
    // This ensures the healthcheck is correctly registered before container startup
    if (!this.healthCheck) {
      const defaultHealthCheck: HealthCheck = this.setDefaultHealthCheck(this.port)
      this.withHealthCheck(defaultHealthCheck)
    }

    this.withEnvironment({
      ...this.environment,
      ONECX_PERMISSIONS_PROCUCT_NAME: this.details.permissionsProductName,
      KC_REALM: `${this.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_AUTH_SERVER_URL: `http://${this.keycloakContainer.getNetworkAliases()[0]}:${this.keycloakContainer.getPort()}/realms/${this.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_TOKEN_ISSUER: `http://${this.keycloakContainer.getNetworkAliases()[0]}/realms/${this.keycloakContainer.getRealm()}`,
      TKIT_SECURITY_AUTH_ENABLED: 'false',
      TKIT_RS_CONTEXT_TENANT_ID_MOCK_ENABLED: 'false',
      TKIT_LOG_JSON_ENABLED: 'false',
      TKIT_OIDC_HEALTH_ENABLED: 'false',
    })

      .withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(`${this.details.permissionsProductName}: `, line))
        stream.on('err', (line) => console.error(`${this.details.permissionsProductName}: `, line))
        stream.on('end', () => console.log(`${this.details.permissionsProductName}: Stream closed`))
      })

      .withExposedPorts(this.port)

      .withWaitStrategy(Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()]))
    return new StartedBffContainer(await super.start(), this.details, this.networkAliases, this.port)
  }
}

export class StartedBffContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly details: BffDetails,
    private readonly networkAliases: string[],
    private readonly port: number
  ) {
    super(startedTestContainer)
  }

  getPermissionProductName() {
    return this.details.permissionsProductName
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }

  getPort(): number {
    return this.port
  }
}
