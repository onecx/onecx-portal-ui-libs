import { Location } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Config } from '@onecx/integration-interface'
import { BehaviorSubject, firstValueFrom } from 'rxjs'
import { createLogger } from '../utils/logger.utils'

@Injectable()
export class AppConfigService {
  private http = inject(HttpClient)
  private readonly logger = createLogger('AppConfigService')

  config$ = new BehaviorSubject<{ [key: string]: string }>({})

  public init(baseUrl: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const loadConfigPromise: Promise<Config> = firstValueFrom(
        this.http.get<Config>(Location.joinWithSlash(baseUrl, 'assets/env.json'))
      )

      loadConfigPromise
        .then(async (config) => {
          if (config) {
            this.config$.next(config)
            resolve()
          }
        })
        .catch((e) => {
          this.logger.error('Failed to load env configuration', e)
          reject(e)
        })
    })
  }

  public getProperty(key: string): string | undefined {
    return this.config$.getValue()?.[key]
  }

  public setProperty(key: string, val: string) {
    this.config$.next({ ...this.config$.value, [key]: val })
  }

  public getConfig(): { [key: string]: string } {
    return this.config$.getValue()
  }
}
