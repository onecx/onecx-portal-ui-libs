import { POSTGRES, KEYCLOAK, onecxSvcImages } from '../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { ProductStoreSvcContainer, StartedProductStoreSvcContainer } from '../containers/svc/onecx-product-store-svc'
import axios from 'axios'

describe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let productStoreSvcContainer: StartedProductStoreSvcContainer

  beforeAll(async () => {
    const network: StartedNetwork = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    productStoreSvcContainer = await new ProductStoreSvcContainer(
      onecxSvcImages.ONECX_PRODUCT_STORE_SVC,
      pgContainer,
      kcContainer
    )
      .withNetwork(network)
      .start()
  })

  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('onecx_product_store')).resolves.not.toBeTruthy()
  })

  it('should respond with 200 on /q/health', async () => {
    const port = productStoreSvcContainer.getMappedPort(productStoreSvcContainer.getPort())
    const response = axios.get(`http://localhost:${port}/q/health`)

    expect((await response).status).toBe(200)
  })

  afterAll(async () => {
    await productStoreSvcContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
  })
})
