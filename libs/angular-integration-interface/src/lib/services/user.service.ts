import { Injectable, OnDestroy } from '@angular/core'
import {
  PermissionsTopic,
  type UserProfile,
  UserProfileTopic,
  determineBrowserLanguage,
  resolveLegacyLanguage,
  resolveProfileLanguage,
} from '@onecx/integration-interface'
import { BehaviorSubject, firstValueFrom, map } from 'rxjs'
import { DEFAULT_LANG } from '../api/constants'
import { getNormalizedBrowserLocales } from '@onecx/accelerator'

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  profile$ = new UserProfileTopic()
  lang$ = new BehaviorSubject(determineBrowserLanguage() ?? DEFAULT_LANG)

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
          return resolveProfileLanguage(profile, DEFAULT_LANG, getNormalizedBrowserLocales)
        })
      )
      .subscribe(this.lang$)
  }

  ngOnDestroy(): void {
    this.profile$.destroy()
    this._permissionsTopic$?.destroy()
  }

  useOldLangSetting(profile: UserProfile): string {
    return resolveLegacyLanguage(profile, DEFAULT_LANG, determineBrowserLanguage)
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

  get isInitialized(): Promise<void> {
    return Promise.all([
      this.permissionsTopic$.isInitialized,
      this.profile$.isInitialized,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
    ]).then(() => {})
  }
}
