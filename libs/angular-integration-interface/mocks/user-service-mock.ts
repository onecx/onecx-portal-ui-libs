import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { UserService } from '@onecx/angular-integration-interface'

export function provideUserServiceMock() {
  return [UserServiceMock, { provide: UserService, useExisting: UserServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class UserServiceMock {
  profile$ = new FakeTopic<UserProfile>()
  permissions$ = new BehaviorSubject<string[]>(['mocked-permission'])
  lang$ = new BehaviorSubject('en')

  hasPermission(permissionKey: string | string[]): boolean {
    if (Array.isArray(permissionKey)) {
      return permissionKey.every((key) => this.permissions$.getValue().includes(key))
    }
    return this.permissions$.getValue().includes(permissionKey)
  }

  determineLanguage(): string | undefined {
    return 'mocked-lang'
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  extractPermissions(userProfile: UserProfile): string[] | null {
    return ['mocked-permission']
  }

  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }
}

export type MockUserService = UserServiceMock
