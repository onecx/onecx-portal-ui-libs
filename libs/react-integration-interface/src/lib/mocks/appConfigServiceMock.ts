import { BehaviorSubject } from 'rxjs'
import type { Config } from '@onecx/integration-interface'

class AppConfigServiceMock {
  config$ = new BehaviorSubject<{ [key: string]: string }>({})

  init(): Promise<void> {
    return new Promise((resolve) => {
      const mockConfig: Config = { key: 'config' }
      this.config$.next(mockConfig)
      resolve()
    })
  }

  getProperty(key: string): string | undefined {
    return this.config$.getValue()?.[key]
  }

  setProperty(key: string, val: string) {
    this.config$.next({ ...this.config$.value, [key]: val })
  }

  getConfig(): { [key: string]: string } {
    return this.config$.getValue()
  }
}

const createAppConfigServiceMock = () => new AppConfigServiceMock()

export { AppConfigServiceMock, createAppConfigServiceMock }
