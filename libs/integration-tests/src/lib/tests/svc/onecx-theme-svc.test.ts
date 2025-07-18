import { POSTGRES, KEYCLOAK, onecxSvcImages } from '../../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'
import { ThemeSvcContainer, StartedThemeSvcContainer } from '../../containers/svc/onecx-theme-svc'
import axios from 'axios'

xdescribe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let themeSvcContainer: StartedThemeSvcContainer
  let network: StartedNetwork

  beforeAll(async () => {
    network = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    themeSvcContainer = await new ThemeSvcContainer(onecxSvcImages.ONECX_THEME_SVC, pgContainer, kcContainer)
      .withNetwork(network)
      .start()
  }, 120_000)

  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('onecx_theme')).resolves.not.toBeTruthy()
  })

  it('should respond with 200 on /q/health', async () => {
    const port = themeSvcContainer.getMappedPort(themeSvcContainer.getPort())
    const response = axios.get(`http://localhost:${port}/q/health`)

    expect((await response).status).toBe(200)
  })

  it('should use the correct port', () => {
    const port = themeSvcContainer.getPort()

    expect(port).toBe(8080)
  })

  afterAll(async () => {
    await themeSvcContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
    await network.stop()
  })
})
