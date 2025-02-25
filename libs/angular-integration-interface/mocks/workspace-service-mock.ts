import { Injectable } from '@angular/core'
import { of, Observable } from 'rxjs'
import { Route } from '@onecx/integration-interface'
import { AppStateService } from '../src/lib/services/app-state.service'

@Injectable({
  providedIn: 'root',
})
export class WorkspaceServiceMock {
  private aliasStart = '[['
  private aliasEnd = ']]'
  private paramStart = '{'
  private paramEnd = '}'

  constructor(protected appStateService: AppStateService) {}

  getUrl(
    productName: string,
    appId: string,
    endpointName?: string,
    endpointParameters?: Record<string, unknown>
  ): Observable<string> {
    return of('mocked-url')
  }

  doesUrlExistFor(productName: string, appId: string, endpointName?: string): Observable<boolean> {
    return of(true)
  }

  private constructBaseUrlFromWorkspace(workspace: any): string {
    return 'mocked-base-url'
  }

  private constructRouteUrl(
    workspace: any,
    appId: string,
    productName: string,
    endpointName?: string,
    endpointParameters?: Record<string, unknown>
  ): string {
    return 'mocked-route-url'
  }

  private constructEndpointUrl(
    route: any,
    endpointName: string,
    endpointParameters: Record<string, unknown> = {}
  ): string {
    return 'mocked-endpoint-url'
  }

  private filterRouteFromList(routes: Array<Route>, appId: string, productName: string): Route | undefined {
    return { appId, productName, baseUrl: 'mocked-base-url', endpoints: [] }
  }

  private dissolveEndpoint(endpointName: string, endpoints: Array<any>): any | undefined {
    return { name: endpointName, path: 'mocked-path' }
  }

  private fillParamsForPath(path: string, endpointParameters: Record<string, unknown>): string {
    return 'mocked-filled-path'
  }

  private getStringFromUnknown(value: unknown): string {
    return 'mocked-string'
  }
}
