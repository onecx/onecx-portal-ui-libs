import { SvcContainer, StartedSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class ThemeSvcContainer extends SvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image, { databaseContainer, keycloakContainer })
    this.withNetworkAliases('onecx-theme-svc')
    this.withDatabaseUsername('onecx_theme')
    this.withDatabasePassword('onecx_theme')
  }
}

export class StartedThemeSvcContainer extends StartedSvcContainer {}
