import { Injectable, OnDestroy, inject } from '@angular/core'
import { ParametersTopic } from '@onecx/integration-interface'
import { firstValueFrom, from, map, mergeMap, of } from 'rxjs'
import { Capability, ShellCapabilityService } from './shell-capability.service'
import { AppStateService } from './app-state.service'

type Parameter = boolean | number | string | object

@Injectable({ providedIn: 'root' })
export class ParametersService implements OnDestroy {
  private shellCapabilityService = inject(ShellCapabilityService)
  private appStateService = inject(AppStateService)
  private parameters$ = new ParametersTopic()

  ngOnDestroy(): void {
    this.parameters$.destroy()
  }

  //Besser immer nur beim Start der Shell checken ob die Parameter noch aktuell sind. Sonst arbeitet man mit inconsistenten Parametern
  //Shell schreibt die Parameter aber immer ins Topic. NUR die Shell ließt den localstorage
  //defaultValue sollte Promise zulassen
  //Parameter sind app spezifisch -> Cache app-spezifisch -> delta anfragen -> ReplaySubject im RouterService -> Topic im RouterService beim Wechsel füllen
  // besser immer alle publishen, damit es auch für RCs funktioniert

  /**
   * Use this method to get a parameter value in applications
   */
  public async get<T extends Parameter>(
    key: string,
    defaultValue: T | Promise<T>
  ): Promise<T>
  
  /**
   *  Use this method to get a parameter value in remote components
   */
  public async get<T extends Parameter>(
    key: string,
    defaultValue: T | Promise<T>,
    productName: string | undefined = undefined,
    appId: string | undefined = undefined
  ): Promise<T> {
    if (!this.shellCapabilityService.hasCapability(Capability.PARAMETERS_TOPIC)) {
      return Promise.resolve(defaultValue)
    }

    if (!productName) {
      productName = await firstValueFrom(this.appStateService.currentMfe$.pipe(map((mfe) => mfe.productName)))
    }
    if (!appId) {
      appId = await firstValueFrom(this.appStateService.currentMfe$.pipe(map((mfe) => mfe.appId)))
    }

    return firstValueFrom(
      this.parameters$.pipe(
        map(
          (payload) =>
            payload.parameters.find((p) => p.productName === productName && p.appId === appId)?.parameters[key] as T
        )
      )
    ).then((value): Promise<T> => {
      if (value === undefined) {
        return Promise.resolve(defaultValue)
      } else {
        return Promise.resolve(value)
      }
    })
  }
}
