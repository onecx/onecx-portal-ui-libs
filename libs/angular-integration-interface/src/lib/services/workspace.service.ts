import { Injectable } from '@angular/core'
import { AppStateService } from './app-state.service'
import { Observable, map } from 'rxjs'
import { Route } from '@onecx/integration-interface'
import { Endpoint } from '@onecx/integration-interface'
import { Location } from '@angular/common'

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
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
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace) => {
        const finalUrl = this.constructRouteUrl(workspace, appId, productName, endpointName, endpointParameters)
        return finalUrl
      })
    )
  }

  doesUrlExistFor(productName: string, appId: string, endpointName?: string): Observable<boolean> {
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace) => {
        const checkEndpoint = endpointName !== undefined && endpointName.length > 0

        if (workspace.routes == undefined) {
          return false
        }
        const route = this.filterRouteFromList(workspace.routes, appId, productName)

        if (checkEndpoint) {
          if (!route || route.endpoints === undefined || route.endpoints.length == 0) {
            return false
          }

          const endpoint = route.endpoints.find((ep) => ep.name === endpointName)
          return !!(endpoint && endpoint.path && endpoint.path.length > 0)
        } else {
          return !!(route && route.baseUrl && route.baseUrl.length > 0)
        }
      })
    )
  }

  private constructBaseUrlFromWorkspace(workspace: any): string {
    if (workspace.baseUrl === undefined) {
      console.log('WARNING: There was no baseUrl for received workspace.')
      return ''
    }
    return workspace.baseUrl
  }

  private constructRouteUrl(
    workspace: any,
    appId: string,
    productName: string,
    endpointName?: string,
    endpointParameters?: Record<string, unknown>
  ): string {
    const route = this.filterRouteFromList(workspace.routes, appId, productName)
    let url = this.constructBaseUrlFromWorkspace(workspace)
    if (!route) {
      console.log(
        `WARNING: No route.baseUrl could be found for given appId "${appId}" and productName "${productName}"`
      )

      return url
    }

    if (route.baseUrl !== undefined && route.baseUrl.length > 0) {
      url = route.baseUrl
    }
    if (endpointName == undefined) {
      return url
    }

    url = Location.joinWithSlash(url, this.constructEndpointUrl(route, endpointName, endpointParameters))
    return url
  }

  private constructEndpointUrl(
    route: any,
    endpointName: string,
    endpointParameters: Record<string, unknown> = {}
  ): string {
    if (!route.endpoints) {
      return ''
    }
    const finalEndpoint = this.dissolveEndpoint(endpointName, route.endpoints)
    if (!finalEndpoint || finalEndpoint.path === undefined) {
      console.log('WARNING: No endpoint or endpoint.path could be found')
      return ''
    }

    const paramsFilled = this.fillParamsForPath(finalEndpoint.path, endpointParameters)
    if (paramsFilled === undefined) {
      console.log('WARNING: Params could not be filled correctly')
      return ''
    }

    return paramsFilled
  }

  private filterRouteFromList(routes: Array<Route>, appId: string, productName: string): Route | undefined {
    if (!routes) {
      return undefined
    }

    const productRoutes = routes.filter((route) => route.appId === appId && route.productName === productName)

    if (productRoutes.length === 0) {
      return undefined
    }

    if (productRoutes.length > 1) {
      console.log('WARNING: There were more than one route. First route has been used.')
    }

    return productRoutes[0]
  }

  private dissolveEndpoint(endpointName: string, endpoints: Array<Endpoint>): Endpoint | undefined {
    let endpoint = endpoints.find((ep) => ep.name === endpointName)

    if (!endpoint) {
      return undefined
    }

    while (endpoint.path?.includes(this.aliasStart)) {
      const path: string = endpoint.path
      const startIdx = path.indexOf(this.aliasStart) + this.aliasStart.length
      const endIdx = path.lastIndexOf(this.aliasEnd)
      if (endIdx <= startIdx) {
        return undefined
      }
      const aliasName = path.substring(startIdx, endIdx)
      endpoint = endpoints.find((ep) => ep.name === aliasName)

      if (!endpoint) {
        return undefined
      }
    }

    return endpoint
  }

  private fillParamsForPath(path: string, endpointParameters: Record<string, unknown>): string {
    while (path.includes(this.paramStart)) {
      const paramName = path.substring(
        path.indexOf(this.paramStart) + this.paramStart.length,
        path.indexOf(this.paramEnd)
      )
      const paramValue = this.getStringFromUnknown(endpointParameters[paramName])
      if (paramValue != undefined && paramValue.length > 0) {
        path = path.replace(this.paramStart.concat(paramName).concat(this.paramEnd), paramValue)
      } else {
        console.log(`WARNING: Searched param "${paramName}" was not found in given param list `)
        return ''
      }
    }
    return path
  }

  private getStringFromUnknown(value: unknown): string {
    if (value === null || value === undefined) {
      return ''
    } else if (typeof value === 'string') {
      return value
    } else {
      return String(value)
    }
  }
}
