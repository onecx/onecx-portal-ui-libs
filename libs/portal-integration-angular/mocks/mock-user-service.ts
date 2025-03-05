import { BehaviorSubject } from 'rxjs'

export class UserServiceMock {
  lang$ = new BehaviorSubject<string>('en')
  /* eslint-disable @typescript-eslint/no-unused-vars */
  hasPermission(permissionKey: string): boolean {
    return true
  }
}
