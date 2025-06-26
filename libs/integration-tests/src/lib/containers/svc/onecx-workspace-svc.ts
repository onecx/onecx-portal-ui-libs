import { SvcContainer, StartedSvcContainer } from '../abstract/onecx-svc'
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
    this.withDatabaseUsername('onecx_workspace')
    this.withDatabasePassword('onecx_workspace')
  }
}

export class StartedWorkspaceSvcContainer extends StartedSvcContainer {}
