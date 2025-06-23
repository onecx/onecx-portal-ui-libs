import { OnecxSvcContainer, OnecxSvcDetails, StartedOnecxSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class OnecxTenantSvcContainer extends OnecxSvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    const onecxSvcDetails: OnecxSvcDetails = {
      svcUsername: 'onecx_tenant',
      svcPassword: 'onecx_tenant',
    }
    super(image, { databaseContainer, keycloakContainer }, onecxSvcDetails)
    this.withNetworkAliases('onecx-tenant-svc')
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

export class StartedOnecxTenantSvcContainer extends StartedOnecxSvcContainer {}
