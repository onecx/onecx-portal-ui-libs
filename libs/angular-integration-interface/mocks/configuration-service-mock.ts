import { Injectable } from '@angular/core'
import { Config } from '@onecx/integration-interface'
import { CONFIG_KEY } from '../src/lib/model/config-key.model'
import { FakeTopic } from './fake-topic'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'
import { ConfigurationService } from '../src/lib/services/configuration.service'

export function provideConfigurationServiceMock() {
  return [ConfigurationServiceMock, { provide: ConfigurationService, useExisting: ConfigurationServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class ConfigurationServiceMock {
  config$ = new FakeTopic<Config>()

  public init(): Promise<boolean> {
    return this.config$.publish({ config: 'config' }).then(() => true)
  }

  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }

  public getProperty(key: CONFIG_KEY): string | undefined {
    return 'config'
  }

  public async setProperty(key: string, val: string): Promise<void> {
    const currentValues = await firstValueFrom(this.config$.asObservable())
    currentValues[key] = val
    await this.config$.publish(currentValues)
  }

  public getConfig(): Config | undefined {
    return { config: 'config' }
  }
}
