import { Injectable, OnDestroy } from '@angular/core'
import { DEFAULT_LANG } from '../api/constants'
import { UserProfile, UserProfileTopic } from '@onecx/integration-interface'
import { BehaviorSubject } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class UserService implements OnDestroy {
  profile$ = new UserProfileTopic()
  permissions$ = new BehaviorSubject<string[]>([])
  lang$ = new BehaviorSubject(this.determineLanguage() ?? DEFAULT_LANG)

  constructor() {
    this.profile$.subscribe((profile) => {
      this.lang$.next(
        profile.accountSettings?.localeAndTimeSettings?.locale ?? this.determineLanguage() ?? DEFAULT_LANG
      )
      this.updatePermissionsFromUserProfile(profile)
    })
  }

  ngOnDestroy(): void {
    this.profile$.destroy()
  }

  hasPermission(permissionKey: string): boolean {
    const result = this.permissions$.getValue() ? this.permissions$.getValue()?.includes(permissionKey) : false
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

  private updatePermissionsFromUserProfile(userProfile: UserProfile) {
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
        this.permissions$.next(permissions)
      }
    }
  }
}
