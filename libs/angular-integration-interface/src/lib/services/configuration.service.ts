import { HttpClient } from '@angular/common/http'
import { Injectable, OnDestroy, inject } from '@angular/core'
import { firstValueFrom, map } from 'rxjs'
import { Config, ConfigurationTopic, resolveConfigPayload } from '@onecx/integration-interface'
import { APP_CONFIG } from '../api/injection-tokens'
import { CONFIG_KEY } from '../model/config-key.model'
import Semaphore from 'ts-semaphore'
import { createLogger } from '../utils/logger.utils'

@Injectable({ providedIn: 'root' })
export class ConfigurationService implements OnDestroy {
  private http = inject(HttpClient)
  private readonly logger = createLogger('ConfigurationService')
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
      const skipRemoteConfigLoad = this.defaultConfig?.['skipRemoteConfigLoad']
      const remoteConfigURL = this.defaultConfig?.['remoteConfigURL'] ?? undefined

      resolveConfigPayload({
        defaultConfig: this.defaultConfig ?? {},
        skipRemoteConfigLoad: !!skipRemoteConfigLoad,
        remoteConfigURL,
        loadRemoteConfig: (url) => firstValueFrom(this.http.get<Config>(url)),
      })
        .then(async ({ config, source }) => {
          if (source === 'inlined') {
            this.logger.info('ENV resolved from injected config')
          }
          if (source === 'default' && skipRemoteConfigLoad) {
            this.logger.info(
              '📢 TKA001: Remote config load is disabled. To enable it, remove the "skipRemoteConfigLoad" key in your environment.json'
            )
          }

          await this.config$.publish({ ...this.defaultConfig, ...(config ?? {}) }).then(() => {
            resolve(true)
          })
        })
        .catch((e) => {
          this.logger.error('Failed to load env configuration', e)
          reject(e)
        })
    })
  }

  get isInitialized(): Promise<void> {
    return this.config$.isInitialized
  }

  public async getProperty(key: CONFIG_KEY): Promise<string | undefined> {
    if (!Object.values(CONFIG_KEY).includes(key)) {
      this.logger.error('Invalid config key ', key)
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
