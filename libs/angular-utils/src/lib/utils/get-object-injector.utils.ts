import { Injector } from '@angular/core'

export function getInjector(object: any): Injector | undefined {
  return object?.injector ?? object?._injector ?? object?.__injector ?? object?.___injector
}
