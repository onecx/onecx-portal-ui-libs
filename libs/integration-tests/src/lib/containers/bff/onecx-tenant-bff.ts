import { BffContainer, StartedBffContainer } from '../abstract/onecx-bff'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class TenantBffContainer extends BffContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, keycloakContainer)
    this.withPermissionsProductName('onecx-tenant')
    this.withNetworkAliases('onecx-tenant-bff')
  }
}

export class StartedTenantBffContainer extends StartedBffContainer {}
