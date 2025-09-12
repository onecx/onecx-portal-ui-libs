import { StartedSvcContainer, SvcContainer } from '../../containers/basic/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'

export class DummySvcContainer extends SvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image, { databaseContainer, keycloakContainer })

    this.withNetworkAliases('onecx-dummy-svc').withDatabaseUsername('onecx_dummy').withDatabasePassword('onecx_dummy')
  }
}

export class StartedDummySvcContainer extends StartedSvcContainer {}
