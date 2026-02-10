import { Injectable, inject } from '@angular/core'
import {
  constructRouteUrl,
  doesUrlExistForWorkspace,
  type EndpointParameters,
  type Workspace,
} from '@onecx/integration-interface'
import { Observable, map } from 'rxjs'
import { AppStateService } from './app-state.service'

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  protected appStateService = inject(AppStateService)

  getUrl(
    productName: string,
    appId: string,
    endpointName?: string,
    endpointParameters?: EndpointParameters
  ): Observable<string> {
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace: Workspace) => constructRouteUrl(workspace, appId, productName, endpointName, endpointParameters))
    )
  }

  doesUrlExistFor(productName: string, appId: string, endpointName?: string): Observable<boolean> {
    return this.appStateService.currentWorkspace$.pipe(
      map((workspace: Workspace) => doesUrlExistForWorkspace(workspace, productName, appId, endpointName))
    )
  }
}
