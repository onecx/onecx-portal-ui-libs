import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Optional, SkipSelf } from '@angular/core'
import { BehaviorSubject, firstValueFrom } from 'rxjs'
import { APP_CONFIG, MFE_INFO } from '../api/injection-tokens'
import { MfeInfo } from '../model/mfe-info.model'
import { Portal } from '../model/portal'
import { DEFAULT_LANG } from '../api/constants'

type KV = { [key: string]: string }

@Injectable()
export class ConfigurationService {
  public lang: string = this.determineLanguage() || DEFAULT_LANG

  public lang$ = new BehaviorSubject<string | undefined>(this.lang)

  private config: KV = {}

  private portalId!: string

  private portal!: Portal

  private parent?: ConfigurationService

  constructor(
    private http: HttpClient,
    @Optional() @SkipSelf() parentService?: ConfigurationService,
    @Optional() @Inject(APP_CONFIG) private defaultConfig?: { [key: string]: string },
    @Optional() @Inject(MFE_INFO) private mfeInfo?: MfeInfo
  ) {
    if (parentService) {
      console.log(
        `💡 ConfigurationService started with level = child, parent config belongs to : ${mfeInfo?.shellName} parent : `,
        parentService.getPortal()
      )
      this.parent = parentService
      this.lang = parentService.lang
      this.lang$ = parentService.lang$
    } else {
      console.log(`💡 ConfigurationService started with level = root`)
    }
    // if (parentModule) {
    //   console.log(`Got Parent module ${parentModule}`)
    // }
    // if (parentModule2) {
    //   console.log(`Got Parent module2 ${parentModule2}`)
    // }
    // if (parentService) {
    //   console.log(`Got parentService ${JSON.stringify(parentService.getConfig())}`)
    // }
  }

  public init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const skipRemoteConfigLoad = this.defaultConfig && this.defaultConfig['skipRemoteConfigLoad']
      let loadConfigPromise: Promise<KV>

      // if we have Backend env vars injected in HTML, use it
      const inlinedConfig = (window as typeof window & { APP_CONFIG: KV })['APP_CONFIG']
      if (inlinedConfig) {
        console.log(`ENV resolved from injected config`)
        loadConfigPromise = Promise.resolve(inlinedConfig)
      } else {
        //otherwise if we load remote config, or just fallback to whatever we got from module if remote config is disabled
        if (skipRemoteConfigLoad) {
          console.log(
            '📢 TKA001: Remote config load is disabled. To enable it, remove the "skipRemoteConfigLoad" key in your environment.json'
          )
          loadConfigPromise = Promise.resolve(this.defaultConfig || {})
        } else {
          //otherwise fetch them from env.json
          loadConfigPromise = firstValueFrom(
            this.http.get<KV>((this.defaultConfig && this.defaultConfig['remoteConfigURL']) || 'assets/env.json')
          )
        }
      }

      loadConfigPromise
        .then((config) => {
          if (config) {
            const sanitizedEnvValues = this.sanitizeConfig(config)
            this.config = { ...this.defaultConfig, ...sanitizedEnvValues }
            this.portalId = this.config['TKIT_PORTAL_ID']
            //resolve the parent promix, we are done
            // setTimeout(() => resolve(true), 5000)
            resolve(true)
          }
        })

        .catch((e) => {
          console.log(`Failed to load env configuration`)
          reject(e)
        })
    })
  }

  private sanitizeConfig(config: KV) {
    const sanitizedConfig: KV = {}
    return (
      Object.keys(config)
        // only take values that are interpolated/set
        //.filter((key) => !(config[key]).startsWith('${'))
        .reduce((obj, key) => {
          obj[key] = config[key]
          return obj
        }, sanitizedConfig)
    )
  }

  public setPortal(portal: Portal) {
    this.portal = portal
  }

  public getPortal(): Portal {
    return this.portal || this.parent?.getPortal()
  }

  public areWeRunningAsMFE() {
    return this.mfeInfo !== undefined && this.mfeInfo !== null
  }

  public getMFEInfo(): MfeInfo | undefined {
    return this.mfeInfo
  }

  public getBaseUrl(): string {
    if (this.mfeInfo) {
      return this.mfeInfo.baseHref
    } else {
      return ''
    }
  }

  public getProperty(key: string): string | undefined {
    return this.config[key]
  }

  public getConfig() {
    return this.config
  }

  public getPortalId(): string {
    return this.portalId || this.parent?.getPortalId() || 'undefined'
  }

  setProperty(key: string, val: string) {
    this.config[key] = val
  }

  private determineLanguage(): string | undefined {
    if (typeof window === 'undefined' || typeof window.navigator === 'undefined') {
      return undefined
    }

    let browserLang: any = window.navigator.languages ? window.navigator.languages[0] : null
    browserLang = browserLang || window.navigator.language

    if (typeof browserLang === 'undefined') {
      return undefined
    }

    if (browserLang.indexOf('-') !== -1) {
      browserLang = browserLang.split('-')[0]
    }

    if (browserLang.indexOf('_') !== -1) {
      browserLang = browserLang.split('_')[0]
    }

    return browserLang
  }
}
