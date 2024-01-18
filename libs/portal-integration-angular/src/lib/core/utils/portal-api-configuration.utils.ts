import { Location } from '@angular/common'
import { BehaviorSubject, first, map } from 'rxjs'
import { AppStateService } from '../../services/app-state.service'
import { ConfigurationService } from '../../services/configuration.service'

type Config = {
  credentials: { [key: string]: string | (() => string | undefined) }
  selectHeaderContentType(contentTypes: string[]): string | undefined
  selectHeaderAccept(accepts: string[]): string | undefined
  isJsonMime(mime: string): boolean
  lookupCredential(key: string): string | undefined
}

export class PortalApiConfiguration {
  private configuration = this.activator(this.configurationClassOfGenerator)

  protected basePath$ = new BehaviorSubject<string>(Location.joinWithSlash('.', this.apiPrefix))
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

  constructor(
    private configurationClassOfGenerator: unknown,
    private apiPrefix: string,
    configService: ConfigurationService,
    appStateService: AppStateService
  ) {
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
