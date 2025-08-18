import { Injectable, OnDestroy } from '@angular/core'
import { GuardsGatherer } from '@onecx/angular-utils'

export function provideGuardsGathererMock() {
  return [
    GuardsGathererMock,
    {
      provide: GuardsGatherer,
      useExisting: GuardsGathererMock,
    },
  ]
}

@Injectable()
export class GuardsGathererMock implements OnDestroy {
  ngOnDestroy(): void {}

  gather(): Promise<any> {
    return Promise.resolve(true)
  }
  resolveRoute(): void {}

  activate(): void {}
  deactivate(): void {}
}
