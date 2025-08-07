import { POSTGRES, KEYCLOAK, onecxSvcImages } from '../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { WorkspaceSvcContainer, StartedWorkspaceSvcContainer } from '../containers/svc/onecx-workspace-svc'
import axios from 'axios'
describe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let workspaceSvcContainer: StartedWorkspaceSvcContainer

  beforeAll(async () => {
    const network: StartedNetwork = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    workspaceSvcContainer = await new WorkspaceSvcContainer(
      onecxSvcImages.ONECX_WORKSPACE_SVC,
      pgContainer,
      kcContainer
    )
      .withNetwork(network)
      .start()
  })
  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('onecx_workspace')).resolves.not.toBeTruthy()
  })

  it('should respond with 200 on /q/health', async () => {
    const port = workspaceSvcContainer.getMappedPort(workspaceSvcContainer.getPort())
    const response = axios.get(`http://localhost:${port}/q/health`)

    expect((await response).status).toBe(200)
  })

  afterAll(async () => {
    await workspaceSvcContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
  })
})
