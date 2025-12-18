import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy, inject } from '@angular/core'
import { firstValueFrom, map } from 'rxjs'
import { Config, ConfigurationTopic } from '@onecx/integration-interface'
import { APP_CONFIG } from '../api/injection-tokens'
import { CONFIG_KEY } from '../model/config-key.model'
import Semaphore from 'ts-semaphore'

@Injectable({ providedIn: 'root' })
export class ConfigurationService implements OnDestroy {
  private http = inject(HttpClient)
  private defaultConfig = inject<{
    [key: string]: string
  }>(APP_CONFIG, { optional: true })

  _config$: ConfigurationTopic | undefined
  get config$() {
    this._config$ ??= new ConfigurationTopic()
    return this._config$
  }
  set config$(source: ConfigurationTopic) {
    this._config$ = source
  }
  private semaphore = new Semaphore(1)

  ngOnDestroy(): void {
    this._config$?.destroy()
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

  public async getProperty(key: CONFIG_KEY): Promise<string | undefined> {
    if (!Object.values(CONFIG_KEY).includes(key)) {
      console.error('Invalid config key ', key)
    }
    return firstValueFrom(this.config$.pipe(map((config) => config[key])))
  }

  public async setProperty(key: string, val: string) {
    return this.semaphore.use(async () => {
      const currentValues = await firstValueFrom(this.config$.asObservable())
      currentValues[key] = val
      await this.config$.publish(currentValues)
    })
  }

  public async getConfig(): Promise<Config | undefined> {
    return firstValueFrom(this.config$.asObservable())
  }
}
