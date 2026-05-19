import type { Config } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { firstValueFrom } from 'rxjs'
import { CONFIG_KEY } from '@onecx/angular-integration-interface'

class ConfigurationServiceMock {
  config$ = new FakeTopic<Config>({})

  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private isInitializedPromise: Promise<void>

  constructor() {
    this.isInitializedPromise = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve
    })
  }

  init(config?: Config): Promise<boolean> {
    return this.config$.publish(config ?? {}).then(() => {
      this.resolveInitPromise()
      return true
    })
  }

  get isInitialized(): Promise<void> {
    return this.isInitializedPromise
  }

  getProperty(key: CONFIG_KEY): Promise<string | undefined> {
    return firstValueFrom(this.config$.asObservable()).then((config) => config[key])
  }

  async setProperty(key: string, val: string): Promise<void> {
    const currentValues = await firstValueFrom(this.config$.asObservable())
    currentValues[key] = val
    await this.config$.publish(currentValues)
  }

  getConfig(): Promise<Config | undefined> {
    return firstValueFrom(this.config$.asObservable())
  }
}

const createConfigurationServiceMock = () => new ConfigurationServiceMock()

export { ConfigurationServiceMock, createConfigurationServiceMock }
