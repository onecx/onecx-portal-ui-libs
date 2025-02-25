import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, OnDestroy, Optional } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { Config, ConfigurationTopic } from '@onecx/integration-interface'
import { APP_CONFIG } from '../src/lib/api/injection-tokens'
import { CONFIG_KEY } from '../src/lib/model/config-key.model'

@Injectable({ providedIn: 'root' })
export class ConfigurationServiceMock implements OnDestroy {
  config$ = new ConfigurationTopic()

  constructor(
    private http: HttpClient,
    @Optional() @Inject(APP_CONFIG) private defaultConfig?: { [key: string]: string }
  ) {}

  ngOnDestroy(): void {
    this.config$.destroy()
  }

  public init(): Promise<boolean> {
    return Promise.resolve(true)
  }

  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }

  public getProperty(key: CONFIG_KEY): string | undefined {
    return this.defaultConfig ? this.defaultConfig[key] : undefined
  }

  public async setProperty(key: string, val: string) {
    const currentValues = await firstValueFrom(this.config$.asObservable())
    currentValues[key] = val
    await this.config$.publish(currentValues)
  }

  public getConfig(): Config | undefined {
    return this.defaultConfig
  }
}
