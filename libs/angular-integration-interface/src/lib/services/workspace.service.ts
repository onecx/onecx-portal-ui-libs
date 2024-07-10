import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';
import { Observable, of, switchMap} from 'rxjs';
import { Route } from '@onecx/integration-interface';
import { Endpoint } from '@onecx/integration-interface';

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

     getUrl(appId: string, productName: string, endpointName: string, params: Record<string, unknown>={}): Observable<string> {
      return this.appStateService.currentWorkspace$.pipe(
        switchMap((workspace) => {
          let finalUrl = this.constructRouteUrl(workspace, appId, productName, endpointName, params)
          return of(finalUrl);
        })
      );
    }

    private constructBaseUrlFromWorkspace(workspace: any): string {
      if (workspace.baseUrl === undefined) {
        console.log("WARNING: There was no baseUrl for received workspace.");
        return "";
      }
      return workspace.baseUrl;
    }

    private constructRouteUrl(workspace: any, appId: string, productName: string, endpointName: string, params: Record<string, unknown>): string {
      const route = this.filterRouteFromList(workspace.routes, appId, productName);
      if (!route || route.baseUrl === undefined) {
        console.log(`WARNING: No route.baseUrl could be found for given appId "${appId}" and productName "${productName}"`);

        return this.constructBaseUrlFromWorkspace(workspace);
      }
    
      let routeUrl = route.baseUrl;
      routeUrl = this.joinWithSlashAndDoubleCheck(routeUrl,this.constructEndpointUrl(route, endpointName, params));
      return routeUrl;
    }

    private constructEndpointUrl(route: any, endpointName: string, params: Record<string, unknown>): string {
      if (!route.endpoints) {
        return "";  
      }
      const finalEndpoint = this.dissolveEndpoint(endpointName, route.endpoints);
      if (!finalEndpoint || finalEndpoint.path === undefined) {
        console.log("WARNING: No endpoint.path could be found");
        return "";
      }
    
      const paramsFilled = this.fillParamsForPath(finalEndpoint.path, params);
      if (paramsFilled === undefined) {
        console.log("WARNING: Params could not be filled correctly");
        return "";
      }
      
      return paramsFilled;
    }

     private filterRouteFromList(routes: Array<Route>, appId: string, productName: string): Route | undefined {
      if (!routes) {
        return undefined;
      }
    
      const productRoutes = routes.filter(route => route.appId === appId && route.productName === productName);
    
      if (productRoutes.length === 0) {
        return undefined;
      }
    
      if (productRoutes.length > 1) {
        console.log("WARNING: Es wurden mehr als eine route gefunden. Die erste wird verwendet.");
      }
    
      return productRoutes[0]; 
    }

     private dissolveEndpoint(endpointName: string, endpoints: Array<Endpoint>): Endpoint | undefined {
      let endpoint = endpoints.find(ep => ep.name === endpointName);
    
      if (!endpoint) {
        return undefined;  
      }
    
      while (endpoint.path?.includes(this.aliasStart)) {
        const path : string = endpoint.path;
        const startIdx = path.indexOf(this.aliasStart) + this.aliasStart.length;
        const endIdx = path.lastIndexOf(this.aliasEnd);
        if (endIdx <= startIdx) {
          return undefined; 
        }
        const aliasName = path.substring(startIdx, endIdx);
        endpoint = endpoints.find(ep => ep.name === aliasName);
    
        if (!endpoint) {
          return undefined; 
        }
      }
    
      return endpoint;
    }

    private fillParamsForPath( path: string, params: Record<string,unknown>): string{
      while(path.includes(this.paramStart)){
        let paramName = path.substring(
          path.indexOf(this.paramStart) + this.paramStart.length, 
          path.indexOf(this.paramEnd)
        );
        let paramValue = this.getStringFromUnknown(params[paramName]);
        if(paramValue != undefined && paramValue.length>0){
          path = path.replace(this.paramStart.concat(paramName).concat(this.paramEnd), paramValue);
        }
        else{ 
          console.log(`WARNING: Searched param "${paramName}" was not found in given param list `);
          return "";
        }
        
        

      }
      return path;
    }

    private getStringFromUnknown(value: unknown): string {
      if (value === null || value === undefined) {
        return "";  
      } else if (typeof value === "string") {
        return value;  
      } else {
        return String(value);  
      }
    }

    private joinWithSlashAndDoubleCheck(string1: string, string2: string) : string{
      if(string2.length==0){
        return string1;
      }
      if(string1.length==0){
        return string2;
      }
      return [string1,string2].join("/").replace(/(?<=[a-zA-Z])\/{2,}/g,'/');
    }
}
