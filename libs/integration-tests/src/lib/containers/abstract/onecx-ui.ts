import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers'
import { UiDetails } from '../../model/ui.interface'

export abstract class UiContainer extends GenericContainer {
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
        stream.on('data', (line) => console.log(`${this.details.appBaseHref}: `, line))
        stream.on('err', (line) => console.error(`${this.details.appBaseHref}: `, line))
        stream.on('end', () => console.log(`${this.details.appBaseHref}: Stream closed`))
      })
    }

    this.withExposedPorts(this.port)

    return new StartedUiContainer(await super.start(), this.details, this.networkAliases, this.port)
  }
}

export class StartedUiContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly details: UiDetails,
    private readonly networkAliases: string[],
    private readonly port: number
  ) {
    super(startedTestContainer)
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
}
