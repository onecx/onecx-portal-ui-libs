import { OnecxSvcContainer, OnecxSvcDetails, StartedOnecxSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class OnecxThemeSvcContainer extends OnecxSvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    const onecxSvcDetails: OnecxSvcDetails = {
      svcUsername: 'onecx_theme',
      svcPassword: 'onecx_theme',
    }
    super(image, { databaseContainer, keycloakContainer }, onecxSvcDetails)
    this.withNetworkAliases('onecx-theme-svc')
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

export class StartedOnecxThemeSvcContainer extends StartedOnecxSvcContainer {}
