import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
// import { withCache } from '@ngneat/cashew'
import { Observable } from 'rxjs'
import { Portal } from '../model/portal'
import { PortalWrapper } from '../model/portal-wrapper'

@Injectable({ providedIn: 'root' })
export class PortalApiService {
  constructor(private readonly httpClient: HttpClient) {}
  baseUrlV1 = './portal-api/v1/portals'
  baseUrlInternal = './portal-api/internal/portals'

  getAllPortals(): Observable<Array<Portal>> {
    return this.httpClient.get<Array<Portal>>(`${this.baseUrlInternal}`)
  }

  // internal: by portal id
  getPortal(portal: string): Observable<Portal> {
    return this.httpClient.get<Portal>(`${this.baseUrlInternal}/${portal}`)
  }
  // external: by portal name
  getPortalData(portal: string): Observable<Portal> {
    return this.httpClient.get<Portal>(`${this.baseUrlV1}/${portal}`)
  }

  getCurrentPortalData(url: string): Observable<PortalWrapper> {
    return this.httpClient.get<PortalWrapper>(`${this.baseUrlV1}/current?url=${url}`)
  }
}
