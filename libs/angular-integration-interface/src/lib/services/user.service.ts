import { Injectable, OnDestroy } from '@angular/core'
import { PermissionsTopic, UserProfileTopic } from '@onecx/integration-interface'
import { BehaviorSubject, firstValueFrom, map } from 'rxjs'
import { DEFAULT_LANG } from '../api/constants'

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  profile$ = new UserProfileTopic()
  lang$ = new BehaviorSubject(this.determineLanguage() ?? DEFAULT_LANG)

  private permissionsTopic$ = new PermissionsTopic()

  constructor() {
    this.profile$
      .pipe(
        map(
          (profile) =>
            profile.accountSettings?.localeAndTimeSettings?.locale ?? this.determineLanguage() ?? DEFAULT_LANG
        )
      )
      .subscribe(this.lang$)
  }

  ngOnDestroy(): void {
    this.profile$.destroy()
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
