import { Network, StartedNetwork } from 'testcontainers'
import { PostgresContainer } from '../containers/PostgresContainer'
import { KeycloakContainer } from '../containers/KeycloakContainer'

export class TestEnvironmentFactory {
  private network?: StartedNetwork
  private postgres?: PostgresContainer
  private keycloak?: KeycloakContainer

  public async start() {
    this.network = await new Network().start()

    this.postgres = new PostgresContainer(this.network)
    this.keycloak = new KeycloakContainer(this.network)

    await this.postgres.start()
    await this.keycloak.start()

    this.logAccessInfo()
  }

  public async stop() {
    await this.keycloak?.stop()
    await this.postgres?.stop()
    await this.network?.stop()
  }

  public getPostgres() {
    if (!this.postgres) throw new Error('Postgres not started')
    return this.postgres
  }

  public getKeycloak() {
    if (!this.keycloak) throw new Error('Keycloak not started')
    return this.keycloak
  }

  private logAccessInfo() {
    const pgPort = this.postgres?.getPort()
    const kcPort = this.keycloak?.getPort()
    console.log(`🔗 Postgres erreichbar unter: localhost:${pgPort}`)
    console.log(`🔗 Keycloak erreichbar unter: http://localhost:${kcPort}`)
  }
}
