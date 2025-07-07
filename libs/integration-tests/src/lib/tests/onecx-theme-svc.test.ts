import { POSTGRES, KEYCLOAK, onecxSvcImages } from '../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../containers/core/onecx-postgres'
import { ThemeSvcContainer, StartedThemeSvcContainer } from '../containers/svc/onecx-theme-svc'
import axios from 'axios'
xdescribe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let themeSvcContainer: StartedThemeSvcContainer

  beforeAll(async () => {
    const network: StartedNetwork = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    themeSvcContainer = await new ThemeSvcContainer(onecxSvcImages.ONECX_THEME_SVC, pgContainer, kcContainer)
      .withNetwork(network)
      .start()
  })

  it('database should be created', async () => {
    await expect(pgContainer.doesDatabaseExist('onecx_theme')).resolves.not.toBeTruthy()
  })

  it('should respond with 200 on /q/health', async () => {
    const port = themeSvcContainer.getMappedPort(themeSvcContainer.getPort())
    const response = axios.get(`http://localhost:${port}/q/health`)

    expect((await response).status).toBe(200)
  })

  it('should have expected environment variables in permission-svc container, QUARKUS_DATASOURCE_USERNAME', async () => {
    const execResult = await themeSvcContainer.exec(['printenv', 'QUARKUS_DATASOURCE_USERNAME'])
    const output = execResult.output.trim()

    expect(output).toContain('onecx_theme')
  })

  it('should have expected environment variables in permission-svc container, QUARKUS_DATASOURCE_PASSWORD', async () => {
    const execResult = await themeSvcContainer.exec(['printenv', 'QUARKUS_DATASOURCE_PASSWORD'])
    const output = execResult.output.trim()

    expect(output).toContain('onecx_theme')
  })

  it('should have expected environment variables in permission-svc container, KC_REALM', async () => {
    const execResult = await themeSvcContainer.exec(['printenv', 'KC_REALM'])
    const output = execResult.output.trim()

    expect(output).toContain('onecx')
  })

  it('should have expected environment variables in permission-svc container, TKIT_OIDC_HEALTH_ENABLED', async () => {
    const execResult = await themeSvcContainer.exec(['printenv', 'TKIT_OIDC_HEALTH_ENABLED'])
    const output = execResult.output.trim()

    expect(output).toContain('false')
  })

  it('should have expected environment variables in permission-svc container, TKIT_DATAIMPORT_ENABLED', async () => {
    const execResult = await themeSvcContainer.exec(['printenv', 'TKIT_DATAIMPORT_ENABLED'])
    const output = execResult.output.trim()

    expect(output).toContain('true')
  })

  afterAll(async () => {
    await themeSvcContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
  })
})
