import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, OnDestroy, Optional } from '@angular/core'
import { firstValueFrom } from 'rxjs'
import { Config, ConfigurationTopic } from '@onecx/integration-interface'
import { APP_CONFIG } from '../api/injection-tokens'
import { CONFIG_KEY } from '../model/config-key.model'

@Injectable({ providedIn: 'root' })
export class ConfigurationService implements OnDestroy {
  config$ = new ConfigurationTopic()

  constructor(
    private http: HttpClient,
    @Optional() @Inject(APP_CONFIG) private defaultConfig?: { [key: string]: string }
  ) {}

  ngOnDestroy(): void {
    this.config$.destroy()
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const skipRemoteConfigLoad = this.defaultConfig && this.defaultConfig['skipRemoteConfigLoad']
      let loadConfigPromise: Promise<Config>

      const inlinedConfig = (window as typeof window & { APP_CONFIG: Config })['APP_CONFIG']
      if (inlinedConfig) {
        console.log(`ENV resolved from injected config`)
        loadConfigPromise = Promise.resolve(inlinedConfig)
      } else {
        if (skipRemoteConfigLoad) {
          console.log(
            '📢 TKA001: Remote config load is disabled. To enable it, remove the "skipRemoteConfigLoad" key in your environment.json'
          )
          loadConfigPromise = Promise.resolve(this.defaultConfig || {})
        } else {
          loadConfigPromise = firstValueFrom(
            this.http.get<Config>((this.defaultConfig && this.defaultConfig['remoteConfigURL']) || 'assets/env.json')
          )
        }
      }

      loadConfigPromise
        .then(async (config) => {
          await this.config$.publish({ ...this.defaultConfig, ...(config ?? {}) }).then(() => {
            resolve(true)
          })
        })
        .catch((e) => {
          console.log(`Failed to load env configuration`)
          reject(e)
        })
    })
  }

  get isInitialized(): Promise<void> {
    return this.config$.isInitialized
  }

  public getProperty(key: CONFIG_KEY): string | undefined {
    if (!Object.values(CONFIG_KEY).includes(key)) {
      console.error('Invalid config key ', key)
    }
    return this.config$.getValue()?.[key]
  }

  public async setProperty(key: string, val: string) {
    const currentValues = await firstValueFrom(this.config$.asObservable())
    currentValues[key] = val
    await this.config$.publish(currentValues)
  }

  public getConfig(): Config | undefined {
    return this.config$.getValue()
  }
}
