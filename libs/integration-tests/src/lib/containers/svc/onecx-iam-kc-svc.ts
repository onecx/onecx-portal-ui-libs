import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedSvcContainer, SvcContainer } from '../abstract/onecx-svc'

export abstract class IamKcContainer extends SvcContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, { keycloakContainer })
    this.withEnvironment({
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_SERVER_URL: `http://${keycloakContainer.getNetworkAliases()[0]}:${keycloakContainer.getPort()}`,
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_REALM: `${keycloakContainer.getAdminRealm()}`,
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_USERNAME: `${keycloakContainer.getAdminUsername()}`,
      QUARKUS_KEYCLOAK_ADMIN_CLIENT_PASSWORD: `${keycloakContainer.getAdminPassword()}`,
    }).createDatabaseAtStart(false)
    this.withNetworkAliases('onecx-iam-kc-svc')
  }
}

export class StartedIamKcSvcContainer extends StartedSvcContainer {}
