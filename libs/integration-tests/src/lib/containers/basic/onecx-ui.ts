import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers'
import { UiDetails } from '../../models/ui.interface'
import { HealthCheckableContainer } from '../../models/health-checkable-container.interface'
import { HealthCheckExecutor } from '../../models/health-check-executor.interface'
import { SkipHealthCheckExecutor } from '../../utils/health-check-executor'

export class UiContainer extends GenericContainer {
  private details: UiDetails = {
    appBaseHref: '',
    appId: '',
    productName: '',
  }

  private port = 8080

  protected loggingEnabled = false

  constructor(image: string) {
    super(image)
  }

  withAppBaseHref(appBaseHref: string): this {
    this.details.appBaseHref = appBaseHref
    return this
  }

  withAppId(appId: string): this {
    this.details.appId = appId
    return this
  }

  withProductName(productName: string): this {
    this.details.productName = productName
    return this
  }

  withPort(port: number): this {
    this.port = port
    return this
  }

  enableLogging(log: boolean): this {
    this.loggingEnabled = log
    return this
  }

  override async start(): Promise<StartedUiContainer> {
    this.withEnvironment({
      ...this.environment,
      APP_BASE_HREF: `${this.details.appBaseHref}`,
      APP_ID: `${this.details.appId}`,
      PRODUCT_NAME: `${this.details.productName}`,
    })

    if (this.loggingEnabled) {
      this.withLogConsumer((stream) => {
        stream.on('data', (line) => console.log(`${this.networkAliases[0]}: `, line))
        stream.on('err', (line) => console.error(`${this.networkAliases[0]}: `, line))
        stream.on('end', () => console.log(`${this.networkAliases[0]}: Stream closed`))
      })
    }

    this.withExposedPorts(this.port)

    return new StartedUiContainer(await super.start(), this.details, this.networkAliases, this.port)
  }
}

export class StartedUiContainer extends AbstractStartedContainer implements HealthCheckableContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly details: UiDetails,
    private readonly networkAliases: string[],
    private readonly port: number
  ) {
    super(startedTestContainer)
  }

  /**
   * UI containers don't have health endpoints - skip health check
   */
  getHealthCheckExecutor(): HealthCheckExecutor {
    return new SkipHealthCheckExecutor('UI Container')
  }

  getAppBaseHref(): string {
    return this.details.appBaseHref
  }

  getAppId(): string {
    return this.details.appId
  }

  getProductName(): string {
    return this.details.productName
  }

  getNetworkAliases(): string[] {
    return this.networkAliases
  }

  getPort(): number {
    return this.port
  }

  getStartedTestContainer(): StartedTestContainer {
    return this.startedTestContainer
  }

  getDetails(): UiDetails {
    return this.details
  }
}
