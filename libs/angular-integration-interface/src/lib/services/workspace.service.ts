import { Injectable, inject } from '@angular/core'
import { constructRouteUrl, doesUrlExistForWorkspace, type EndpointParameters } from '@onecx/integration-interface'
import { Observable, map } from 'rxjs'
import { AppStateService } from './app-state.service'
import { createLogger } from '../utils/logger.utils'

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  protected appStateService = inject(AppStateService)

  private readonly logger = createLogger('WorkspaceService')

  getUrl(
    productName: string,
    appId: string,
    endpointName?: string,
    endpointParameters?: EndpointParameters
  ): Observable<string> {
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace) => {
        const finalUrl = constructRouteUrl(
          workspace,
          appId,
          productName,
          endpointName,
          endpointParameters,
          this.logger.warn
        )
        return finalUrl
      })
    )
  }

  doesUrlExistFor(productName: string, appId: string, endpointName?: string): Observable<boolean> {
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace) => doesUrlExistForWorkspace(workspace, productName, appId, endpointName, this.logger.warn))
    )
  }
}
