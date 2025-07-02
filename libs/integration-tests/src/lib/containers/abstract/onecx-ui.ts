import { AbstractStartedContainer, GenericContainer, StartedTestContainer } from 'testcontainers'
import { StartedOnecxKeycloakContainer } from '../core/onecx-keycloak'
import { UiDetails } from '../../model/service.model'

export abstract class UiContainer extends GenericContainer {
  private details: UiDetails = {
    appBaseHref: '',
    appId: '',
    productName: '',
  }

  constructor(
    image: string,
    protected keycloakContainer?: StartedOnecxKeycloakContainer
  ) {
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

  override async start(): Promise<StartedUiContainer> {
    this.withEnvironment({
      ...this.environment,
      APP_BASE_HREF: `${this.details.appBaseHref}`,
    })
    return new StartedUiContainer(await super.start(), this.details, this.networkAliases)
  }
}

export class StartedUiContainer extends AbstractStartedContainer {
  constructor(
    startedTestContainer: StartedTestContainer,
    private readonly details: UiDetails,
    private readonly networkAliases: string[]
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
}
