import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common'
import { Injector, LOCALE_ID, Pipe, PipeTransform, Type, inject } from '@angular/core'

@Pipe({
  name: 'dynamicPipe',
  standalone: false,
})
export class DynamicPipe implements PipeTransform {
  private injector = inject(Injector)

  knownPipes: { [name: string]: PipeTransform } = {}

  public constructor() {
    const locale = inject(LOCALE_ID)

    this.knownPipes = {
      currency: new CurrencyPipe(locale),
      decimal: new DecimalPipe(locale),
      date: new DatePipe(locale),
    }
  }

  transform(value: any, requiredPipe?: Type<any>, pipeArgs?: any): any {
    if (!requiredPipe) {
      return value
    }

    const injector = Injector.create({
      name: 'DynamicPipe',
      parent: this.injector,
      providers: [{ provide: requiredPipe }],
    })
    const pipe = injector.get(requiredPipe)
    return pipe.transform(value, pipeArgs)
  }

  transform2(value: any, pipeToken: any, ...pipeArgs: any[]): any {
    if (!pipeToken) {
      return value
    } else {
      // eslint-disable-next-line no-prototype-builtins
      if (pipeToken && this.knownPipes.hasOwnProperty(pipeToken)) {
        const pipe = this.knownPipes[pipeToken]
        if (Array.isArray(pipeArgs)) {
          return pipe.transform(value, ...pipeArgs)
        } else {
          return pipe.transform(value, pipeArgs)
        }
      } else {
        return value
      }
    }
  }
}
