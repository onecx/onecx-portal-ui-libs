import { OnecxSvcContainer, OnecxSvcDetails, StartedOnecxSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class OnecxUserProfileSvcContainer extends OnecxSvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    const onecxSvcDetails: OnecxSvcDetails = {
      svcUsername: 'onecx_user_profile',
      svcPassword: 'onecx_user_profile',
    }
    super(image, { databaseContainer, keycloakContainer }, onecxSvcDetails)

    this.withNetworkAliases('onecx-user-profile-svc')
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

export class StartedOnecxUserProfileSvcContainer extends StartedOnecxSvcContainer {}
