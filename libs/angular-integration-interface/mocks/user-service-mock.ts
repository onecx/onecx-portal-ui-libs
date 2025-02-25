import { Injectable, OnDestroy } from '@angular/core'
import { BehaviorSubject, of } from 'rxjs'
import { PermissionsTopic, UserProfile, UserProfileTopic } from '@onecx/integration-interface'
import { DEFAULT_LANG } from '../src/lib/api/constants'

@Injectable({ providedIn: 'root' })
export class UserServiceMock implements OnDestroy {
  profile$ = new UserProfileTopic()
  permissions$ = new BehaviorSubject<string[]>(['mocked-permission'])
  lang$ = new BehaviorSubject(DEFAULT_LANG)

  private permissionsTopic$ = new PermissionsTopic()
  private oldStylePermissionsInitialized: Promise<string[]> = Promise.resolve(['mocked-permission'])

  constructor() {}

  ngOnDestroy(): void {
    this.profile$.destroy()
  }

  hasPermission(permissionKey: string | string[]): boolean {
    if (Array.isArray(permissionKey)) {
      return permissionKey.every((key) => this.hasPermission(key))
    }
    return (
      this.permissions$.getValue().includes(permissionKey) ||
      (this.permissionsTopic$.getValue()?.includes(permissionKey) ?? false)
    )
  }

  private determineLanguage(): string | undefined {
    return 'mocked-lang'
  }

  private extractPermissions(userProfile: UserProfile): string[] | null {
    return ['mocked-permission']
  }

  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }
}
