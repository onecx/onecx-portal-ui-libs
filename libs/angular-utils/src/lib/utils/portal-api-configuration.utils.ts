import { Location } from '@angular/common'
import { AppStateService, ConfigurationService } from '@onecx/angular-integration-interface'
import { BehaviorSubject, first, map } from 'rxjs'

type Config = {
  credentials: { [key: string]: string | (() => string | undefined) }
  encodeParam: (param: unknown) => string
  selectHeaderContentType(contentTypes: string[]): string | undefined
  selectHeaderAccept(accepts: string[]): string | undefined
  isJsonMime(mime: string): boolean
  lookupCredential(key: string): string | undefined
}

export class PortalApiConfiguration {
  private configuration: Config

  protected basePath$: BehaviorSubject<string>
  get basePath() {
    return this.basePath$.value
  }
  set basePath(_: string) {
    throw new Error('Do not set basePath')
  }

  get credentials(): { [key: string]: string | (() => string | undefined) } {
    return this.configuration.credentials
  }
  set credentials(value: { [key: string]: string | (() => string | undefined) }) {
    this.configuration.credentials = value
  }

  get encodeParam(): (param: unknown) => string {
    return this.configuration.encodeParam
  }
  set encocdeParam(value: (param: unknown) => string) {
    this.configuration.encodeParam = value
  }

  constructor(
    private configurationClassOfGenerator: unknown,
    private apiPrefix: string,
    configService: ConfigurationService,
    appStateService: AppStateService
  ) {
    this.configuration = this.activator(this.configurationClassOfGenerator)
    this.basePath$ = new BehaviorSubject<string>(Location.joinWithSlash('.', this.apiPrefix))
    appStateService.currentMfe$
      .pipe(
        first(),
        map((currentMfe) => {
          return Location.joinWithSlash(currentMfe.remoteBaseUrl, apiPrefix)
        })
      )
      .subscribe(this.basePath$)
  }

  public selectHeaderContentType(contentTypes: string[]): string | undefined {
    return this.configuration.selectHeaderContentType(contentTypes)
  }

  public selectHeaderAccept(accepts: string[]): string | undefined {
    return this.configuration.selectHeaderAccept(accepts)
  }

  public isJsonMime(mime: string): boolean {
    return this.configuration.isJsonMime(mime)
  }

  public lookupCredential(key: string): string | undefined {
    return this.configuration.lookupCredential(key)
  }

  private activator(type: unknown): Config {
    return new (<{ new (): Config }>(<unknown>type))()
  }
}
