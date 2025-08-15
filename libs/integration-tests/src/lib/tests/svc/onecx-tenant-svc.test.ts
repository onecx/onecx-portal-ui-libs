import { POSTGRES, KEYCLOAK, IMAGES, OnecxService } from '../../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'
import { TenantSvcContainer, StartedTenantSvcContainer } from '../../containers/svc/onecx-tenant-svc'
import axios from 'axios'

jest.setTimeout(60_000)

xdescribe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let tenantSvcContainer: StartedTenantSvcContainer
  let network: StartedNetwork

  beforeAll(async () => {
    network = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    tenantSvcContainer = await new TenantSvcContainer(IMAGES[OnecxService.TENANT_SVC], pgContainer, kcContainer)
      .withNetwork(network)
      .start()
  }, 120_000)

  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('onecx_tenant')).resolves.not.toBeTruthy()
  })

  it('should respond with 200 on /q/health', async () => {
    const port = tenantSvcContainer.getMappedPort(tenantSvcContainer.getPort())
    const response = axios.get(`http://localhost:${port}/q/health`)

    expect((await response).status).toBe(200)
  })

  it('should use the correct port', () => {
    const port = tenantSvcContainer.getPort()

    expect(port).toBe(8080)
  })

  afterAll(async () => {
    await tenantSvcContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
    await network.stop()
  })
})
