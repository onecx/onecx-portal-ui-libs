import { Injectable, OnDestroy, inject } from '@angular/core'
import { ParametersTopic, findParameterValue, type ParameterValue, Capability } from '@onecx/integration-interface'
import { firstValueFrom, map } from 'rxjs'
import { AppStateService } from './app-state.service'
import { ShellCapabilityService } from './shell-capability.service'

@Injectable({ providedIn: 'root' })
export class ParametersService implements OnDestroy {
  private readonly shellCapabilityService = inject(ShellCapabilityService)
  private readonly appStateService = inject(AppStateService)
  _parameters$: ParametersTopic | undefined
  get parameters$() {
    this._parameters$ ??= new ParametersTopic()
    return this._parameters$
  }
  set parameters$(source: ParametersTopic) {
    this._parameters$ = source
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
  public async get<T extends ParameterValue>(key: string, defaultValue: T | Promise<T>): Promise<T>

  /**
   * Use this method to get a parameter value in remote components.
   *
   * @param key The key of the parameter to get. This is defined when the parameter is configured in parameter management.
   * @param defaultValue The default value that will be returned if the parameter is not found or if the shell is not yet providing the parameters because it is too old.
   * @param productName The name of the product in which the parameter is defined.
   * @param appId The id of the application in which the parameter is defined.
   * @returns The value of the parameter or the default value.
   */
  public async get<T extends ParameterValue>(
    key: string,
    defaultValue: T | Promise<T>,
    productName: string | undefined = undefined,
    appId: string | undefined = undefined
  ): Promise<T> {
    if (!this.shellCapabilityService.hasCapability(Capability.PARAMETERS_TOPIC)) {
      return defaultValue
    }

    if (!productName) {
      productName = await firstValueFrom(this.appStateService.currentMfe$.pipe(map((mfe) => mfe.productName)))
    }
    if (!appId) {
      appId = await firstValueFrom(this.appStateService.currentMfe$.pipe(map((mfe) => mfe.appId)))
    }

    return firstValueFrom(
      this.parameters$.pipe(map((payload) => findParameterValue(payload, key, productName, appId) as T))
    ).then((value): T => value ?? defaultValue)
  }
}
