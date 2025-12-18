import { Injectable, OnDestroy } from '@angular/core'
import { PermissionsTopic, UserProfile, UserProfileTopic } from '@onecx/integration-interface'
import { BehaviorSubject, firstValueFrom, map } from 'rxjs'
import { DEFAULT_LANG } from '../api/constants'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  profile$ = new UserProfileTopic()
  lang$ = new BehaviorSubject(this.determineLanguage() ?? DEFAULT_LANG)

  _permissionsTopic$: PermissionsTopic | undefined
  get permissionsTopic$() {
    this._permissionsTopic$ ??= new PermissionsTopic()
    return this._permissionsTopic$
  }
  set permissionsTopic$(source: PermissionsTopic) {
    this._permissionsTopic$ = source
  }

  constructor() {
    this.profile$
      .pipe(
        map((profile) => {
          let locales = profile.settings?.locales

          if (!locales) {
            return this.useOldLangSetting(profile)
          }

          if (locales.length === 0) {
            locales = getNormalizedBrowserLocales()
          }

          // the lang$ should contain the first language, because locales is an ordered list
          // length of 2 is checked because we need the general language
          // never choose 'en-US', but choose 'en'
          const firstLang = locales.find((l) => l.length === 2) ?? DEFAULT_LANG
          return firstLang
        })
      )
      .subscribe(this.lang$)
  }

  ngOnDestroy(): void {
    this.profile$.destroy()
    this._permissionsTopic$?.destroy()
  }

  useOldLangSetting(profile: UserProfile): string {
    return profile.accountSettings?.localeAndTimeSettings?.locale ?? this.determineLanguage() ?? DEFAULT_LANG
  }

  getPermissions() {
    return this.permissionsTopic$.asObservable()
  }

  async hasPermission(permissionKey: string | string[] | undefined): Promise<boolean> {
    if (!permissionKey) return true

    if (Array.isArray(permissionKey)) {
      const permissions = await Promise.all(permissionKey.map((key) => this.hasPermission(key)))
      return permissions.every((hasPermission) => hasPermission)
    }

    return firstValueFrom(
      this.permissionsTopic$.pipe(
        map((permissions) => {
          const result = permissions.includes(permissionKey)
          if (!result) {
            console.log(`👮‍♀️ No permission for: ${permissionKey}`)
          }
          return !!result
        })
      )
    )
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

  get isInitialized(): Promise<void> {
    return Promise.all([
      this.permissionsTopic$.isInitialized,
      this.profile$.isInitialized,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    ]).then(() => {})
  }
}
