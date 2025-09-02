import { Injectable, OnDestroy } from '@angular/core'
import { GuardsGatherer } from '@onecx/angular-utils/guards'

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
  private result = true

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method, @typescript-eslint/no-empty-function
  ngOnDestroy(): void {}

  setGatherResult(result: boolean): void {
    this.result = result
  }

  gather(): Promise<any> {
    return Promise.resolve(this.result)
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  resolveRoute(): void {}

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  activate(): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  deactivate(): void {}
}
