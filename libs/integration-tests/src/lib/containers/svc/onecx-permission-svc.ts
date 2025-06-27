import { SvcContainer, StartedSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class PermissionSvcContainer extends SvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer,
    tenantSvcContainer: StartedSvcContainer
  ) {
    super(image, { databaseContainer, keycloakContainer })
    this.withEnvironment({
      QUARKUS_REST_CLIENT__TENANT_URL: `https://${tenantSvcContainer.getNetworkAliases()[0]}:${tenantSvcContainer.getFirstMappedPort()}`,
      ONECX_PERMISSION_TOKEN_VERIFIED: 'false',
      TKIT_RS_CONTEXT_TENANT_ID_ENABLED: 'false',
    })
    this.withNetworkAliases('onecx-permission-svc')
    this.withDatabaseUsername('onecx_permission')
    this.withDatabasePassword('onecx_permission')
  }
}
export class StartedPermissionSvcContainer extends StartedSvcContainer {}
