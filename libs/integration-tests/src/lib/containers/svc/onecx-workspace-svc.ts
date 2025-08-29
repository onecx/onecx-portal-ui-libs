import { SvcContainer, StartedSvcContainer } from '../basic/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class WorkspaceSvcContainer extends SvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image, { databaseContainer, keycloakContainer })
    this.withEnvironment({
      TKIT_RS_CONTEXT_TENANT_ID_ENABLED: 'false',
    })
    this.withNetworkAliases('onecx-workspace-svc')
      .withDatabaseUsername('onecx_workspace')
      .withDatabasePassword('onecx_workspace')
  }
}

export class StartedWorkspaceSvcContainer extends StartedSvcContainer {}
