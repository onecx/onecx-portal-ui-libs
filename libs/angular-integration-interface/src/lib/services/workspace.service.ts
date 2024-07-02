import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';
import { Observable, of, switchMap} from 'rxjs';
import { Route } from 'libs/integration-interface/src/lib/topics/current-workspace/v1/route.model';
import { Endpoint } from 'libs/integration-interface/src/lib/topics/current-workspace/v1/endpoint.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {

  private aliasStart = '[[';
  private aliasEnd = ']]';
  private paramStart = "{";
  private paramEnd = "}"


  constructor(
    protected appStateService: AppStateService) 
    { }

     getUrl(appId: string, productName: string, endpointname: string, params: Map<string, string>): Observable<string> {
      return this.appStateService.currentWorkspace$.pipe(
        switchMap((workspace) => {
          let finalUrl = "";
          const baseUrl = workspace.baseUrl;
          if (baseUrl !== undefined) {
            finalUrl = finalUrl.concat(baseUrl);
          }
    
          const routes = workspace.routes;
          if (routes !== undefined && routes.length > 0) {
            const route = this.filterRouteFromList(routes, appId, productName);
            if (route !== undefined && route.baseUrl !== undefined) {
              finalUrl = finalUrl.concat(route.baseUrl);
    
              const endpoints = route.endpoints;
              if (endpoints !== undefined && endpoints.length > 0) {
                const finalEndpoint = this.dissolveEndpoint(endpointname, endpoints);
                if (finalEndpoint !== undefined && finalEndpoint.path !== undefined) {
                  const paramsFilled = this.fillParamsForPath(finalEndpoint.path, params);
                  if(paramsFilled !== undefined){
                    finalUrl = finalUrl.concat(paramsFilled);
                  }
                  
                }
              }
            }
          }
    
          return of(finalUrl);
          //return of("ws.baseUrl + route.baseUrl + url"); // Wrap finalUrl in an Observable
        })
      );
    }

    private filterRouteFromList( routes: Array<Route>, appId: string, productName: string): Route | undefined{
      if(routes != undefined){
        let productRoutes = routes.filter(route => (route.appId === appId && route.productName === productName));
        if(productRoutes.length != 1){
          //Problemfall //TODO
        }
        else{
          let resultRoute = productRoutes.at(0);
          return resultRoute!; //TODO
        }
      }
      return undefined;
    }

    dissolveEndpoint( endpointname: string, endpoints: Array<Endpoint>): Endpoint | undefined{
      let endpoint = endpoints.filter(ep => (ep.name === endpointname)).at(0) as Endpoint; // abfangen wenn fehler
      if(endpoint == undefined){
        return undefined;
      }
      // check if endpoint contains Aliases
      while(endpoint.path?.includes(this.aliasStart)){
        let path = endpoint.path;
        let aliasName = path.substring(
          path.indexOf(this.aliasStart) + this.aliasStart.length, 
          path.lastIndexOf(this.aliasEnd)
        );
        let filteredEndpoints = endpoints.filter(ep => (ep.name === aliasName));
        if(filteredEndpoints == undefined || filteredEndpoints.length == 0){
          return undefined;
        }
        else{
          endpoint = filteredEndpoints.at(0)!;
        }

      }

      return endpoint;
    }

    fillParamsForPath( path: string, params: Map<string,string>): string{
      while(path.includes(this.paramStart)){
        let paramName = path.substring(
          path.indexOf(this.paramStart) + this.paramStart.length, 
          path.indexOf(this.paramEnd)
        );
        let paramValue = params.get(paramName);
        if(paramValue != undefined && paramValue.length>0){
          path = path.replace(this.paramStart.concat(paramName).concat(this.paramEnd), paramValue);
        }
        
        

      }
      return path;
    }
}
