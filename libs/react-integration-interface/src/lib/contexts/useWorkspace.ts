import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { Workspace } from '@onecx/integration-interface'
import { constructRouteUrl, doesUrlExistForWorkspace, type EndpointParameters } from '@onecx/integration-interface'
import { useAppState } from './appStateContext'

/**
 * Hook to resolve workspace URLs and endpoints from current workspace state.
 * Must be used within AppStateContext.
 *
 * @returns Workspace URL helpers.
 */
const useWorkspace = () => {
  const { currentWorkspace$ } = useAppState()
  /**
   * Resolves a URL for the specified app/endpoint using the current workspace.
   *
   * @param productName - Product name identifier.
   * @param appId - Application identifier.
   * @param endpointName - Optional endpoint name to resolve.
   * @param endpointParameters - Optional parameters for endpoint path placeholders.
   * @returns Observable of the resolved URL.
   */
  const getUrl = (
    productName: string,
    appId: string,
    endpointName?: string,
    endpointParameters?: EndpointParameters
  ): Observable<string> => {
    return currentWorkspace$.pipe(
      map((workspace: Workspace) => constructRouteUrl(workspace, appId, productName, endpointName, endpointParameters))
    )
  }

  /**
   * Checks whether a route or endpoint URL exists for the given identifiers.
   *
   * @param productName - Product name identifier.
   * @param appId - Application identifier.
   * @param endpointName - Optional endpoint name to validate.
   * @returns Observable indicating whether the URL exists.
   */
  const doesUrlExistFor = (productName: string, appId: string, endpointName?: string): Observable<boolean> => {
    return currentWorkspace$.pipe(
      map((workspace: Workspace) => doesUrlExistForWorkspace(workspace, productName, appId, endpointName))
    )
  }

  return {
    getUrl,
    doesUrlExistFor,
  }
}

export { useWorkspace }
