import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable } from 'rxjs'
import { UserProfile } from '@onecx/integration-interface'
import { UserService } from '@onecx/angular-integration-interface'
import { FakeTopic } from '@onecx/accelerator'
import { createLogger } from '../src/lib/utils/logger.utils'

const logger = createLogger('UserServiceMock')

export function provideUserServiceMock() {
  return [UserServiceMock, { provide: UserService, useExisting: UserServiceMock }]
}

@Injectable({ providedIn: 'root' })
export class UserServiceMock {
  profile$ = new FakeTopic<UserProfile>()
  permissionsTopic$ = new FakeTopic<string[]>(['mocked-permission'])
  lang$ = new BehaviorSubject('en')

  async hasPermission(permissionKey: string | string[]): Promise<boolean> {
    if (Array.isArray(permissionKey)) {
      return permissionKey.every(async (key) => await this.hasPermission(key))
    }

    const result = this.permissionsTopic$.getValue()?.includes(permissionKey)
    if (!result) {
      logger.debug(`No permission for: ${permissionKey}`)
    }
    return !!result
  }

  getPermissions(): Observable<string[]> {
    return this.permissionsTopic$.asObservable()
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
