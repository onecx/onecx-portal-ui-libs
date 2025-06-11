import { AbstractStartedContainer, GenericContainer, StartedNetwork, StartedTestContainer, Wait } from 'testcontainers'
import { HealthCheck } from 'testcontainers/build/types'
import { ContainerEnv } from '../../model/container-env'

/**
 * Defined OneCX container
 */
export abstract class OneCXContainer extends GenericContainer {
  private onecxEnv: ContainerEnv | undefined
  private onecxHealthCheck: HealthCheck | undefined
  private onecxExposedPort: number | undefined

  constructor(
    image: string,
    private onecxName: string,
    private onecxAlias: string,
    private readonly network: StartedNetwork
  ) {
    super(image)
  }

  public withOneCXName(name: string) {
    this.onecxName = name
  }

  public withOneCXAlias(alias: string) {
    this.onecxAlias = alias
  }

  public withOneCXEnvironment(env: ContainerEnv) {
    this.onecxEnv = env
    return this
  }

  public withOneCXHealthCheck(healthCheck: HealthCheck) {
    this.onecxHealthCheck = healthCheck
    return this
  }

  public withOneCXExposedPort(port: number) {
    this.onecxExposedPort = port
    return this
  }

  public getOneCXName() {
    return this.onecxName
  }

  public getOneCXAlias() {
    return this.onecxAlias
  }

  public getOneCXEnvironment() {
    return this.onecxEnv
  }

  public getOneCXHealthCheck() {
    return this.onecxHealthCheck
  }

  public getOneCXExposedPort() {
    return this.onecxExposedPort
  }

  public getOneCXNetwork() {
    return this.network
  }

  public override async start(): Promise<StartedOneCXContainer> {
    console.log('Starting container')

    this.onecxName &&
      this.withName(this.onecxName)
        .withNetworkAliases(this.onecxAlias)
        .withEnvironment(this.onecxEnv ?? {})

    this.onecxHealthCheck && this.withHealthCheck(this.onecxHealthCheck).withWaitStrategy(Wait.forHealthCheck())

    this.onecxExposedPort && this.withExposedPorts(this.onecxExposedPort)

    this.withNetwork(this.network).withLogConsumer((stream) => {
      stream.on('data', (line) => console.log(`${this.onecxName}: `, line))
      stream.on('err', (line) => console.error(`${this.onecxName}: `, line))
      stream.on('end', () => console.log(`${this.onecxName}: Stream closed`))
    })

    return new StartedOneCXContainer(
      await super.start(),
      this.onecxName,
      this.onecxAlias,
      this.network,
      this.onecxExposedPort
    )
  }
}

/**
 * Started OneCX container
 */
export class StartedOneCXContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly onecxName: string,
    private readonly onecxAlias: string,
    private readonly onecxNetwork: StartedNetwork,
    private readonly onecxExposedPort?: number
  ) {
    super(startedTestContainer)
  }

  public getOneCXName() {
    return this.onecxName
  }

  public getOneCXAlias() {
    return this.onecxAlias
  }

  public getOneCXExposedPort() {
    return this.onecxExposedPort
  }

  public getOneCXNetwork() {
    return this.onecxNetwork
  }
}
