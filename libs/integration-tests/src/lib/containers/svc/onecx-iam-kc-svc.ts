import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

interface OnecxSvcDetails {
  svcUsername: string
  svcPassword: string
  port: number
}

export abstract class OnecxIamKcContainer extends GenericContainer {
  private onecxSvcDetails: OnecxSvcDetails = {
    svcUsername: 'onecx-iam-kc',
    svcPassword: 'onecx-iam-kc',
    port: 8080,
  }

  private defaultHealthCheck: HealthCheck = {
    test: ['CMD-SHELL', `curl --head -fsS http://localhost:${this.onecxSvcDetails.port}/q/health`],
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
    this.withExposedPorts(this.onecxSvcDetails.port)
  }

  withSvcPort(svcPort: number): this {
    this.onecxSvcDetails.port = svcPort
    return this
  }

  withSvcUsername(svcUsername: string): this {
    this.onecxSvcDetails.svcUsername = svcUsername
    return this
  }

  withSvcPassword(svcPassword: string): this {
    this.onecxSvcDetails.svcPassword = svcPassword
    return this
  }

  getSvcUsername() {
    return this.onecxSvcDetails.svcUsername
  }

  getSvcPassword() {
    return this.onecxSvcDetails.svcPassword
  }

  getPort() {
    return this.onecxSvcDetails.port
  }

  getKeycloakContainer() {
    return this.keycloakContainer
  }

  override async start(): Promise<StartedOnecxSvcContainer> {
    // Re-apply the default health check explicitly if it has not been overridden.
    // This ensures the healthcheck is correctly registered before container startup
    if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
      this.withHealthCheck(this.defaultHealthCheck)
    }
    // Spread existing environment variables to preserve previously set values.
    // This ensures that calling withEnvironment() does not override earlier configurations.
    this.withEnvironment({
      ...this.environment,
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_SERVER_URL: `http://${this.keycloakContainer.getNetworkAliases()[0]}:${this.keycloakContainer.getPort()}`,
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_REALM: `${this.keycloakContainer.getAdminRealm()}`,
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_USERNAME: `${this.keycloakContainer.getAdminUsername()}`,
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_PASSWORD: `${this.keycloakContainer.getAdminPassword()}`,
      KC_REALM: `${this.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_AUTH_SERVER_URL: `http://${this.keycloakContainer.getNetworkAliases()[0]}:${this.keycloakContainer.getPort()}/realms/${this.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_TOKEN_ISSUER: `http://${this.keycloakContainer.getNetworkAliases()[0]}/realms/${this.keycloakContainer.getRealm()}`,
      TKIT_SECURITY_AUTH_ENABLED: 'false',
      TKIT_RS_CONTEXT_TENANT_ID_MOCK_ENABLED: 'false',
      TKIT_LOG_JSON_ENABLED: 'false',
      TKIT_OIDC_HEALTH_ENABLED: 'false',
      TKIT_DATAIMPORT_ENABLED: 'true',
      ONECX_TENANT_CACHE_ENABLED: 'false',
    })
    this.withLogConsumer((stream) => {
      stream.on('data', (line) => console.log(`${this.onecxSvcDetails.svcUsername}: `, line))
      stream.on('err', (line) => console.error(`${this.onecxSvcDetails.svcUsername}: `, line))
      stream.on('end', () => console.log(`${this.onecxSvcDetails.svcUsername}: Stream closed`))
    })
    this.withWaitStrategy(Wait.forAll([Wait.forHealthCheck(), Wait.forListeningPorts()]))
    return new StartedOnecxSvcContainer(await super.start(), this.onecxSvcDetails, this.networkAliases)
  }
}

export class StartedOnecxSvcContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxSvcDetails: OnecxSvcDetails,
    private readonly networkAliases: string[]
  ) {
    super(startedTestContainer)
  }

  getSvcUsername(): string {
    return this.onecxSvcDetails.svcUsername
  }

  getSvcPassword(): string {
    return this.onecxSvcDetails.svcPassword
  }

  getPort(): number {
    return this.onecxSvcDetails.port
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }
}
