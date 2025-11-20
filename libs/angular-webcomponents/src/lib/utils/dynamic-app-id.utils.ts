export class DynamicAppId {
  public appElementName = ''

  constructor(private value = 'ng') {
    Object.getOwnPropertyNames(String.prototype).forEach((k) => {
      if (k != 'valueOf' && k != 'length') {
        ;(this as any)[k] = function (...args: any[]) {
          const str = this.valueOf()
          return str[k](...args)
        }
      }
    })
  }

  public valueOf() {
    return this.value
  }

  public get length(): number {
    return this.valueOf().length
  }

  public setValue(value: string) {
    this.value = value
  }
}
