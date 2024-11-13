import { BehaviorSubject } from 'rxjs'

export class MockUserService {
  lang$ = new BehaviorSubject<string>('en')
  /* eslint-disable @typescript-eslint/no-unused-vars */
  hasPermission(permissionKey: string | string[]): boolean {
    return true
  }
}
