import { BehaviorSubject, Observable } from 'rxjs'
import type { UserProfile } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

class UserServiceMock {
  profile$ = new FakeTopic<UserProfile>()
  permissionsTopic$ = new FakeTopic<string[]>(['mocked-permission'])
  lang$ = new BehaviorSubject('en')

  async hasPermission(permissionKey: string | string[]): Promise<boolean> {
    if (Array.isArray(permissionKey)) {
      const results = await Promise.all(permissionKey.map((key) => this.hasPermission(key)))
      return results.every((result) => result)
    }

    const result = this.permissionsTopic$.getValue()?.includes(permissionKey)
    if (!result) {
      console.log(`👮‍♀️ No permission for: ${permissionKey}`)
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
  extractPermissions(_userProfile: UserProfile): string[] | null {
    return ['mocked-permission']
  }

  get isInitialized(): Promise<void> {
    return Promise.resolve()
  }
}

const createUserServiceMock = () => new UserServiceMock()

export { UserServiceMock, createUserServiceMock }
