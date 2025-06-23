import { AbstractStartedContainer, GenericContainer, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export interface OnecxSvcDetails {
  svcUsername: string
  svcPassword: string
}

interface OnecxSvcContainerServices {
  databaseContainer: StartedOnecxPostgresContainer
  keycloakContainer: StartedOnecxKeycloakContainer
}

export abstract class OnecxSvcContainer extends GenericContainer {
  protected onecxSvcDetails: OnecxSvcDetails

  private port = 8080

  private defaultHealthCheck: HealthCheck = {
    test: ['CMD-SHELL', `curl --head -fsS http://localhost:${this.port}/q/health`],
    interval: 10_000,
    timeout: 5_000,
    retries: 3,
  }

  constructor(
    image: string,
    private services: OnecxSvcContainerServices,
    onecxSvcDetails: OnecxSvcDetails
  ) {
    super(image)
    this.onecxSvcDetails = onecxSvcDetails
    this.withHealthCheck(this.defaultHealthCheck)
    this.withExposedPorts(this.port)
    this.withStartupTimeout(180_000)
  }

  withSvcPort(svcPort: number): this {
    this.port = svcPort
    return this
  }

  getKeycloakContainer() {
    return this.services.keycloakContainer
  }

  getPostgresContainer() {
    return this.services.databaseContainer
  }

  override async start(): Promise<StartedOnecxSvcContainer> {
    await this.services.databaseContainer.createUserAndDatabase(
      this.onecxSvcDetails.svcUsername,
      this.onecxSvcDetails.svcPassword
    )
    // Re-apply the default health check explicitly if it has not been overridden.
    // This ensures the healthcheck is correctly registered before container startup
    if (JSON.stringify(this.healthCheck) === JSON.stringify(this.defaultHealthCheck)) {
      this.withHealthCheck(this.defaultHealthCheck)
    }
    // Spread existing environment variables to preserve previously set values.
    // This ensures that calling withEnvironment() does not override earlier configurations.
    this.withEnvironment({
      ...this.environment,
      QUARKUS_DATASOURCE_USERNAME: this.onecxSvcDetails.svcUsername,
      QUARKUS_DATASOURCE_PASSWORD: this.onecxSvcDetails.svcPassword,
      QUARKUS_DATASOURCE_JDBC_URL: `jdbc:postgresql://${this.services.databaseContainer.getNetworkAliases()[0]}:${this.services.databaseContainer.getPort()}/${this.onecxSvcDetails.svcUsername}?sslmode=disable`,
      KC_REALM: `${this.services.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_AUTH_SERVER_URL: `http://${this.services.keycloakContainer.getNetworkAliases()[0]}:${this.services.keycloakContainer.getPort()}/realms/${this.services.keycloakContainer.getRealm()}`,
      QUARKUS_OIDC_TOKEN_ISSUER: `http://${this.services.keycloakContainer.getNetworkAliases()[0]}/realms/${this.services.keycloakContainer.getRealm()}`,
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
    return new StartedOnecxSvcContainer(await super.start(), this.onecxSvcDetails, this.networkAliases, this.port)
  }
}

export class StartedOnecxSvcContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxSvcDetails: OnecxSvcDetails,
    private readonly networkAliases: string[],
    private readonly port: number
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
    return this.port
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }
}
