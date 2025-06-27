import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { BffDetails } from '../../model/service.model'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export abstract class BffContainer extends GenericContainer {
  private details: BffDetails = {
    permissionsProductName: '',
  }
  private port = 8080
  private defaultHealthCheck: HealthCheck = {
    test: ['CMD-SHELL', `curl --head -fsS http://localhost:${this.port}/q/health`],
    interval: 10_000,
    timeout: 5_000,
    retries: 3,
  }
  constructor(
    image: string,
    private readonly keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image)
    this.withHealthCheck(this.defaultHealthCheck)
    this.withExposedPorts(this.port)
  }

  withPermissionsProductName(permissionsProductName: string): this {
    this.details.permissionsProductName = permissionsProductName
    return this
  }

  getKeycloakContainer() {
    return this.keycloakContainer
  }
  override async start(): Promise<StartedBffContainer> {
    // Re-apply the default health check explicitly if it has not been overridden.
    // This ensures the healthcheck is correctly registered before container startup
    if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
      this.withHealthCheck(this.defaultHealthCheck)
    }

    this.withEnvironment({
      ...this.environment,
      ONECX_PERMISSIONS_PROCUCT_NAME: this.details.permissionsProductName,
      KC_REALM: `${this.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_AUTH_SERVER_URL: `http://${this.keycloakContainer.getNetworkAliases()[0]}:${this.keycloakContainer.getFirstMappedPort()}/realms/${this.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_TOKEN_ISSUER: `http://${this.keycloakContainer.getNetworkAliases()[0]}/realms/${this.keycloakContainer.getRealm()}`,
      TKIT_SECURITY_AUTH_ENABLED: 'false',
      TKIT_RS_CONTEXT_TENANT_ID_MOCK_ENABLED: 'false',
      TKIT_LOG_JSON_ENABLED: 'false',
      TKIT_OIDC_HEALTH_ENABLED: 'false',
    })
    this.withLogConsumer((stream) => {
      stream.on('data', (line) => console.log(`${this.details.permissionsProductName}: `, line))
      stream.on('err', (line) => console.error(`${this.details.permissionsProductName}: `, line))
      stream.on('end', () => console.log(`${this.details.permissionsProductName}: Stream closed`))
    })
    this.withWaitStrategy(Wait.forHttp(`http://localhost:${this.port}/q/health`, this.port).forStatusCode(200))
    return new StartedBffContainer(await super.start(), this.details, this.networkAliases)
  }
}

export class StartedBffContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly details: BffDetails,
    private readonly networkAliases: string[]
  ) {
    super(startedTestContainer)
  }

  getPermissionProductName() {
    return this.details.permissionsProductName
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }
}
