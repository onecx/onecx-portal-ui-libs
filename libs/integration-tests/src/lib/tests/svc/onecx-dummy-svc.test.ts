import { POSTGRES, KEYCLOAK, onecxSvcImages } from '../../config/env'
import { Network, StartedNetwork } from 'testcontainers'
import { OnecxKeycloakContainer, StartedOnecxKeycloakContainer } from '../../containers/core/onecx-keycloak'
import { OnecxPostgresContainer, StartedOnecxPostgresContainer } from '../../containers/core/onecx-postgres'
import { DummySvcContainer, StartedDummySvcContainer } from '../../containers/svc/onecx-dummy-svc'

describe('Default workspace-svc Testcontainer', () => {
  let pgContainer: StartedOnecxPostgresContainer
  let kcContainer: StartedOnecxKeycloakContainer
  let dummyContainer: StartedDummySvcContainer

  beforeAll(async () => {
    const network: StartedNetwork = await new Network().start()
    pgContainer = await new OnecxPostgresContainer(POSTGRES).withNetwork(network).start()
    kcContainer = await new OnecxKeycloakContainer(KEYCLOAK, pgContainer).withNetwork(network).start()
    dummyContainer = await new DummySvcContainer(onecxSvcImages.ONECX_IAM_KC_SVC, kcContainer)
      .withNetwork(network)
      .start()
  })

  it('should have expected environment variables in dummy-svc container', async () => {
    const environmentVariablesToCheck = [
      { name: 'QUARKUS_DATASOURCE_USERNAME', expected: '' },
      { name: 'QUARKUS_DATASOURCE_PASSWORD', expected: '' },
      { name: 'KC_REALM', expected: 'onecx' },
      { name: 'TKIT_OIDC_HEALTH_ENABLED', expected: 'false' },
      { name: 'TKIT_DATAIMPORT_ENABLED', expected: 'true' },
    ]

    for (const { name, expected } of environmentVariablesToCheck) {
      const execResult = await dummyContainer.exec(['printenv', name])
      const output = execResult.output.trim()

      expect(output).toContain(expected)
    }
  })

  afterAll(async () => {
    await dummyContainer.stop()
    await kcContainer.stop()
    await pgContainer.stop()
  })
})
