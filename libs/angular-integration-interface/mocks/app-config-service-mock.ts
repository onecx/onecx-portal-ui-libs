import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Config } from '@onecx/integration-interface'
import { AppConfigService } from '../src/lib/services/app-config-service'

export function provideAppConfigServiceMock() {
  return [AppConfigServiceMock, { provide: AppConfigService, useExisting: AppConfigServiceMock }]
}
@Injectable()
export class AppConfigServiceMock {
  config$ = new BehaviorSubject<{ [key: string]: string }>({})

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public init(baseUrl: string): Promise<void> {
    return new Promise((resolve) => {
      const mockConfig: Config = { key: 'config' }
      this.config$.next(mockConfig)
      resolve()
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
