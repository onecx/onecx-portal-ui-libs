import { UserService } from '@onecx/angular-integration-interface'

export class DynamicLocaleId {
  constructor(private userService: UserService) {
    Object.getOwnPropertyNames(String.prototype).forEach((k) => {
      if (k != 'valueOf' && k != 'length') {
        ;(this as any)[k] = function (...args: any[]) {
          const str = this.valueOf()
          return str[k](...args)
        }
      }
    })
  }

  valueOf() {
    return this.userService.lang$.getValue()
  }

  
  public get length() : number {
    return this.valueOf().length
  }
  
}
