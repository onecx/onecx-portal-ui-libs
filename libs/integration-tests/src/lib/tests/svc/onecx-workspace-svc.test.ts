import { POSTGRES, KEYCLOAK, IMAGES, OnecxService } from '../../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'
import { WorkspaceSvcContainer, StartedWorkspaceSvcContainer } from '../../containers/svc/onecx-workspace-svc'
import axios from 'axios'

xdescribe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let workspaceSvcContainer: StartedWorkspaceSvcContainer
  let network: StartedNetwork

  beforeAll(async () => {
    network = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    workspaceSvcContainer = await new WorkspaceSvcContainer(
      IMAGES[OnecxService.WORKSPACE_SVC],
      pgContainer,
      kcContainer
    )
      .withNetwork(network)
      .start()
  }, 120_000)

  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('onecx_workspace')).resolves.not.toBeTruthy()
  })

  it('should respond with 200 on /q/health', async () => {
    const port = workspaceSvcContainer.getMappedPort(workspaceSvcContainer.getPort())
    const response = axios.get(`http://localhost:${port}/q/health`)

    expect((await response).status).toBe(200)
  })

  it('should use the correct port', () => {
    const port = workspaceSvcContainer.getPort()

    expect(port).toBe(8080)
  })

  afterAll(async () => {
    await workspaceSvcContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
    await network.stop()
  })
})
