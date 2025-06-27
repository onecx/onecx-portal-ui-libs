import { BffContainer, StartedBffContainer } from '../abstract/onecx-bff'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'

export class ProductStoreBffContainer extends BffContainer {
  constructor(image: string, keycloakContainer: StartedOnecxKeycloakContainer) {
    super(image, keycloakContainer)
    this.withPermissionsProductName('onecx-product-store')
    this.withNetworkAliases('onecx-product-store-bff')
  }
}

export class StartedProductStoreBffContainer extends StartedBffContainer {}
