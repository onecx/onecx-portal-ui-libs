import { OnecxSvcContainer, OnecxSvcDetails, StartedOnecxSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class OnecxPermissionSvcContainer extends OnecxSvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer,
    tenantSvcContainer: StartedOnecxSvcContainer
  ) {
    const onecxSvcDetails: OnecxSvcDetails = {
      svcUsername: 'onecx_persmission',
      svcPassword: 'onecx_persmission',
    }
    super(image, { databaseContainer, keycloakContainer }, onecxSvcDetails)
    this.withEnvironment({
      QUARKUS_REST_CLIENT_ONECX_TENANT_URL: `https://${tenantSvcContainer.getNetworkAliases()[0]}:${tenantSvcContainer.getPort()}`,
      ONECX_PERMISSION_TOKEN_VERIFIED: 'false',
      TKIT_RS_CONTEXT_TENANT_ID_ENABLED: 'false',
    })
    this.withNetworkAliases('onecx-permission-svc')
  }

  withSvcUsername(svcUsername: string): this {
    this.onecxSvcDetails.svcUsername = svcUsername
    return this
  }

  withSvcPassword(svcPassword: string): this {
    this.onecxSvcDetails.svcPassword = svcPassword
    return this
  }
}
export class StartedOnecxPermissionSvcContainer extends StartedOnecxSvcContainer {}
