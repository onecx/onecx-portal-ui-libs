import { SvcContainer, StartedSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class UserProfileSvcContainer extends SvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image, { databaseContainer, keycloakContainer })
    this.withNetworkAliases('onecx-user-profile-svc')
    this.withDatabaseUsername('onecx_user_profile')
    this.withDatabasePassword('onecx_user_profile')
  }
}

export class StartedUserProfileSvcContainer extends StartedSvcContainer {}
