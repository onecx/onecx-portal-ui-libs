import { Injectable } from '@angular/core'
import { Config } from '@onecx/integration-interface'
import { CONFIG_KEY } from '@onecx/angular-integration-interface'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'

export function provideConfigurationServiceMock() {
  return [ConfigurationServiceMock, { provide: ConfigurationService, useExisting: ConfigurationServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class ConfigurationServiceMock {
  config$ = new FakeTopic<Config>()

  private resolveInitPromise!: (value: void | PromiseLike<void>) => void
  private isInitializedPromise: Promise<void>

  constructor() {
    this.isInitializedPromise = new Promise<void>((resolve) => {
      this.resolveInitPromise = resolve
    })
  }

  public init(config?: Config): Promise<boolean> {
    return this.config$.publish(config ?? {}).then(() => {
      this.resolveInitPromise()
      return true
    })
  }

  get isInitialized(): Promise<void> {
    return this.isInitializedPromise
  }

  public getProperty(key: CONFIG_KEY): Promise<string | undefined> {
    return firstValueFrom(this.config$.asObservable()).then((config) => config[key])
  }

  public async setProperty(key: string, val: string): Promise<void> {
    const currentValues = await firstValueFrom(this.config$.asObservable())
    currentValues[key] = val
    await this.config$.publish(currentValues)
  }

  public getConfig(): Promise<Config | undefined> {
    return firstValueFrom(this.config$.asObservable())
  }
}
