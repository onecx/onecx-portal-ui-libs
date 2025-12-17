import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, map, filter, firstValueFrom, skip, Observable, merge } from 'rxjs'
import { PermissionsTopic, UserProfile, UserProfileTopic } from '@onecx/integration-interface'
import { DEFAULT_LANG } from '../api/constants'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  profile$ = new UserProfileTopic()
  permissions$ = new BehaviorSubject<string[]>([])
  lang$ = new BehaviorSubject(this.determineLanguage() ?? DEFAULT_LANG)

  private effectivePermissions$: Observable<string[]>
  _permissionsTopic$: PermissionsTopic | undefined
  get permissionsTopic$() {
    this._permissionsTopic$ ??= new PermissionsTopic()
    return this._permissionsTopic$
  }
  private oldStylePermissionsInitialized: Promise<string[]>

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

    this.oldStylePermissionsInitialized = firstValueFrom(this.permissions$.pipe(skip(1)))
    this.effectivePermissions$ = merge(this.permissions$.pipe(skip(1)), this.permissionsTopic$.asObservable())
    this.profile$
      .pipe(
        map((profile) => this.extractPermissions(profile)),
        filter((permissions): permissions is string[] => !!permissions)
      )
      .subscribe(this.permissions$)
  }

  ngOnDestroy(): void {
    this.profile$.destroy()
    this._permissionsTopic$?.destroy()
  }

  useOldLangSetting(profile: UserProfile): string {
    return profile.accountSettings?.localeAndTimeSettings?.locale ?? this.determineLanguage() ?? DEFAULT_LANG
  }

  getPermissions() {
    return this.effectivePermissions$
  }

  hasPermission(permissionKey: string | string[]): boolean {
    if (Array.isArray(permissionKey)) {
      return permissionKey.every((key) => this.hasPermission(key))
    }
    const oldConceptResult = this.permissions$.getValue()
      ? this.permissions$.getValue()?.includes(permissionKey)
      : false
    const result = this.permissionsTopic$.getValue()
      ? this.permissionsTopic$.getValue()?.includes(permissionKey)
      : oldConceptResult

    if (!result) {
      console.log(`👮‍♀️ No permission for: ${permissionKey}`)
    }
    return !!result
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

  private extractPermissions(userProfile: UserProfile) {
    if (userProfile) {
      if (userProfile.memberships) {
        const permissions: string[] = []
        userProfile.memberships.forEach((m) => {
          m.roleMemberships?.forEach((r) => {
            r.permissions?.forEach((p) => {
              if (p) {
                if (p.key !== undefined) {
                  permissions.push(p.key)
                }
              }
            })
          })
        })
        return permissions
      }
    }
    return null
  }

  get isInitialized(): Promise<void> {
    return Promise.all([
      Promise.race([this.permissionsTopic$.isInitialized, this.oldStylePermissionsInitialized]),
      this.profile$.isInitialized,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    ]).then(() => {})
  }
}
