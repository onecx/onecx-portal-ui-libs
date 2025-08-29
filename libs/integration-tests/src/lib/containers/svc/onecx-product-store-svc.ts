import { SvcContainer, StartedSvcContainer } from '../basic/onecx-svc'
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
      .withDatabaseUsername('onecx_product_store')
      .withDatabasePassword('onecx_product_store')
  }
}

export class StartedProductStoreSvcContainer extends StartedSvcContainer {}
