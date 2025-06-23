import { OnecxSvcContainer, OnecxSvcDetails, StartedOnecxSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class OnecxWorkspaceSvcContainer extends OnecxSvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    const onecxSvcDetails: OnecxSvcDetails = {
      svcUsername: 'onecx_workspace',
      svcPassword: 'onecx_workspace',
    }
    super(image, { databaseContainer, keycloakContainer }, onecxSvcDetails)
    this.withEnvironment({
      TKIT_RS_CONTEXT_TENANT_ID_ENABLED: 'false',
    })
    this.withNetworkAliases('onecx-workspace-svc')
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

export class StartedOnecxWorkspaceSvcContainer extends StartedOnecxSvcContainer {}
