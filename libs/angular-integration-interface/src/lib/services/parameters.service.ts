import { Injectable, OnDestroy, inject } from '@angular/core'
import { ParametersTopic } from '@onecx/integration-interface'
import { firstValueFrom, map } from 'rxjs'
import { AppStateService } from './app-state.service'
import { Capability, ShellCapabilityService } from './shell-capability.service'

type Parameter = boolean | number | string | object

@Injectable({ providedIn: 'root' })
export class ParametersService implements OnDestroy {
  private shellCapabilityService = inject(ShellCapabilityService)
  private appStateService = inject(AppStateService)
  _parameters$: ParametersTopic | undefined
  get parameters$() {
    this._parameters$ ??= new ParametersTopic()
    return this._parameters$
  }

  ngOnDestroy(): void {
    this._parameters$?.destroy()
  }

  /**
   * Use this method to get a parameter value in applications.
   *
   * @param key The key of the parameter to get. This is defined when the parameter is configured in parameter management.
   * @param defaultValue The default value that will be returned if the parameter is not found or if the shell is not yet providing the parameters because it is too old.
   */
  public async get<T extends Parameter>(key: string, defaultValue: T | Promise<T>): Promise<T>

  /**
   * Use this method to get a parameter value in remote components.
   *
   * @param key The key of the parameter to get. This is defined when the parameter is configured in parameter management.
   * @param defaultValue The default value that will be returned if the parameter is not found or if the shell is not yet providing the parameters because it is too old.
   * @param productName The name of the product in which the parameter is defined.
   * @param appId The id of the application in which the parameter is defined.
   * @returns The value of the parameter or the default value.
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
