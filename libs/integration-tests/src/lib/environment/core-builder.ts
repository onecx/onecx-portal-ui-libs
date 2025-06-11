import { Network, StartedNetwork } from 'testcontainers'
import { OneCXPostgresContainer, StartedOneCXPostgresContainer } from '../containers/core/onecx-postgres'
import { OneCXKeycloakContainer, StartedOneCXKeycloakContainer } from '../containers/core/onecx-keycloak'
import { containerImagesEnv } from '../config/env'

interface StartedOneCXContainers {
  startedPgContainer: StartedOneCXPostgresContainer
  startedKcContainer?: StartedOneCXKeycloakContainer
}

export class CoreBuilder {
  private network?: StartedNetwork
  private pgImage = containerImagesEnv.POSTGRES
  private kcImage = containerImagesEnv.KEYCLOAK
  private startedPgContainer?: StartedOneCXPostgresContainer
  private startedKcContainer?: StartedOneCXKeycloakContainer

  public async initializePostgresContainer(
    pgImage: string,
    network: StartedNetwork
  ): Promise<StartedOneCXPostgresContainer> {
    const pgContainer = new OneCXPostgresContainer(pgImage, network)
    const startedPgContainer = await pgContainer.start()
    return startedPgContainer
  }

  public async initializeKeycloakContainer(
    kcImage: string,
    network: StartedNetwork,
    startedPgContainer: StartedOneCXPostgresContainer
  ): Promise<StartedOneCXKeycloakContainer> {
    const kcContainer = new OneCXKeycloakContainer(kcImage, network, startedPgContainer)
    const startedKcContainer = await kcContainer.start()
    return startedKcContainer
  }

  public async startCore(): Promise<StartedOneCXContainers> {
    this.network = await new Network().start()

    this.startedPgContainer = await this.initializePostgresContainer(this.pgImage, this.network)

    const dbCreated = await this.startedPgContainer.createUserAndDatabase('keycloak', 'keycloak')

    if (!dbCreated) {
      console.error('Failed to create the database.')
    }

    const exists = await this.startedPgContainer.doesDatabaseExist('keycloak', 'keycloak')
    if (exists) {
      this.startedKcContainer = await this.initializeKeycloakContainer(
        this.kcImage,
        this.network,
        this.startedPgContainer
      )
    } else {
      console.error('Database does not exist, even though creation was reported as successful.')
    }

    return {
      startedPgContainer: this.startedPgContainer,
      startedKcContainer: this.startedKcContainer,
    }
  }

  public async stop() {
    this.startedPgContainer?.stop()
    this.startedKcContainer?.stop()
    this.network?.stop()
  }
}
