import { POSTGRES, KEYCLOAK, IMAGES, OnecxUi } from '../../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'
import { ShellUiContainer, StartedShellUiContainer } from '../../containers/ui/onecx-shell-ui'

xdescribe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let shellUiContainer: StartedShellUiContainer
  let network: StartedNetwork

  beforeAll(async () => {
    network = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    shellUiContainer = await new ShellUiContainer(IMAGES[OnecxUi.SHELL_UI], kcContainer).withNetwork(network).start()
  }, 120_000)

  it('should have expected environment variables in permission-svc container, KC_REALM', async () => {
    const execResult = await shellUiContainer.exec(['printenv', 'KC_REALM'])
    const output = execResult.output.trim()

    expect(output).toContain('onecx')
  })

  it('should have expected environment variables in permission-svc container, TKIT_OIDC_HEALTH_ENABLED', async () => {
    const execResult = await shellUiContainer.exec(['printenv', 'TKIT_OIDC_HEALTH_ENABLED'])
    const output = execResult.output.trim()

    expect(output).toContain('false')
  })

  it('should have expected environment variables in permission-svc container, CLIENT_USER_ID', async () => {
    const execResult = await shellUiContainer.exec(['printenv', 'CLIENT_USER_ID'])
    const output = execResult.output.trim()

    expect(output).toContain('onecx-shell-ui-client')
  })

  it('should have expected environment variables in permission-svc container, ONECX_VAR_REMAP', async () => {
    const execResult = await shellUiContainer.exec(['printenv', 'ONECX_VAR_REMAP'])
    const output = execResult.output.trim()

    expect(output).toContain('KEYCLOAK_REALM=KC_REALM;KEYCLOAK_CLIENT_ID=CLIENT_USER_ID')
  })

  afterAll(async () => {
    await shellUiContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
    await network.stop()
  })
})
