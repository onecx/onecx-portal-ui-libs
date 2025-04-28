import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, map, filter, firstValueFrom, skip, Observable, merge } from 'rxjs'
import { PermissionsTopic, UserProfile, UserProfileTopic } from '@onecx/integration-interface'
import { DEFAULT_LANG } from '../api/constants'

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  profile$ = new UserProfileTopic()
  permissions$ = new BehaviorSubject<string[]>([])
  lang$ = new BehaviorSubject(this.determineLanguage() ?? DEFAULT_LANG)

  private effectivePermissions$: Observable<string[]>
  private permissionsTopic$ = new PermissionsTopic()
  private oldStylePermissionsInitialized: Promise<string[]>

  constructor() {
    this.profile$
      .pipe(
        map(
          (profile) =>
            profile.accountSettings?.localeAndTimeSettings?.locale ?? this.determineLanguage() ?? DEFAULT_LANG
        )
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
