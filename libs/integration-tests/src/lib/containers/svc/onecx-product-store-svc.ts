import { SvcContainer, StartedSvcContainer } from '../abstract/onecx-svc'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { StartedOnecxPostgresContainer } from '../core/onecx-postgres'

export class ProductStoreSvcContainer extends SvcContainer {
  constructor(
    image: string,
    databaseContainer: StartedOnecxPostgresContainer,
    keycloakContainer: StartedOnecxKeycloakContainer
  ) {
    super(image, { databaseContainer, keycloakContainer })
    this.withNetworkAliases('onecx-product-store-svc')
    this.withDatabaseUsername('onecx_product_store')
    this.withDatabasePassword('onecx_product_store')
  }
}

export class StartedProductStoreSvcContainer extends StartedSvcContainer {}
