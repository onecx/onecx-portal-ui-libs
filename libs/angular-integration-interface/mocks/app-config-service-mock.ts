import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { Config } from '@onecx/integration-interface'

@Injectable()
export class MockAppConfigService {
  config$ = new BehaviorSubject<{ [key: string]: string }>({})

  public init(baseUrl: string): Promise<void> {
    return new Promise((resolve) => {
      const mockConfig: Config = { key: baseUrl }
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
