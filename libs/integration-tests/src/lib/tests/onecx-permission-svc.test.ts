import { POSTGRES, KEYCLOAK, onecxSvcImages } from '../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { PermissionSvcContainer, StartedPermissionSvcContainer } from '../containers/svc/onecx-permission-svc'
import axios from 'axios'
import { TenantSvcContainer, StartedTenantSvcContainer } from '../containers/svc/onecx-tenant-svc'
describe('Default workspace-svc Testcontainer', () => {
  jest.mock('axios')
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let permissionSvcContainer: StartedPermissionSvcContainer
  let tenantSvcContainer: StartedTenantSvcContainer

  beforeAll(async () => {
    const network: StartedNetwork = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    tenantSvcContainer = await new TenantSvcContainer(onecxSvcImages.ONECX_TENANT_SVC, pgContainer, kcContainer)
      .withNetwork(network)
      .start()
    permissionSvcContainer = await new PermissionSvcContainer(
      onecxSvcImages.ONECX_PERMISSION_SVC,
      pgContainer,
      kcContainer,
      tenantSvcContainer
    )
      .withNetwork(network)
      .start()
  })

  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('onecx_permission')).resolves.not.toBeTruthy()
  })

  it('should respond with 200 on /q/health', async () => {
    const port = permissionSvcContainer.getMappedPort(permissionSvcContainer.getPort())
    const response = axios.get(`http://localhost:${port}/q/health`)

    expect((await response).status).toBe(200)
  })

  afterAll(async () => {
    await permissionSvcContainer.stop()
    await tenantSvcContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
  })
})
