import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { PermissionsTopic, UserProfile } from '@onecx/integration-interface'
import { DEFAULT_LANG } from '../src/lib/api/constants'
import { FakeTopic } from './fake-topic'

@Injectable({ providedIn: 'root' })
export class UserServiceMock {
  profile$ = new FakeTopic<UserProfile>()
  permissions$ = new BehaviorSubject<string[]>(['mocked-permission'])
  lang$ = new BehaviorSubject(DEFAULT_LANG)

  private permissionsTopic$ = new FakeTopic<Permissions>()

  hasPermission(permissionKey: string | string[]): boolean {
    if (Array.isArray(permissionKey)) {
      return permissionKey.every((key) => this.hasPermission(key))
    }
    return this.permissions$.getValue().includes(permissionKey)
    // ||
    // (this.permissionsTopic$.getValue()?.includes(permissionKey) ?? false)
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
