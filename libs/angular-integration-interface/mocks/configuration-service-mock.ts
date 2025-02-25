import { Inject, Injectable, Optional } from '@angular/core'
import { Config } from '@onecx/integration-interface'
import { APP_CONFIG } from '../src/lib/api/injection-tokens'
import { CONFIG_KEY } from '../src/lib/model/config-key.model'
import { FakeTopic } from './fake-topic'
import { firstValueFrom } from 'rxjs/internal/firstValueFrom'

@Injectable({ providedIn: 'root' })
export class ConfigurationServiceMock {
  config$ = new FakeTopic()

  constructor(@Optional() @Inject(APP_CONFIG) private defaultConfig?: { [key: string]: string }) {}

  public init(): Promise<boolean> {
    return this.config$.publish(this.defaultConfig).then(() => true)
  }

  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }

  public getProperty(key: CONFIG_KEY): string | undefined {
    return this.defaultConfig ? this.defaultConfig[key] : undefined
  }

  public async setProperty(key: string, val: string): Promise<void> {
    const currentValues = await firstValueFrom(this.config$.asObservable())
    currentValues[key] = val
    await this.config$.publish(currentValues)
  }

  public getConfig(): Config | undefined {
    return this.defaultConfig
  }
}
