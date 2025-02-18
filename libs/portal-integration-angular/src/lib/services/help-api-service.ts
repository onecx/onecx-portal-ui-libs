import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
import { Observable, map } from 'rxjs'
import { HelpData } from '../model/help-data'

const baseUrl = './ahm-api/internal/applications'

@Injectable({ providedIn: 'root' })
export class HelpPageAPIService {
  private httpClient = inject(HttpClient)

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  getHelpDataItem(appId: string, helpItemId: string, type = 'PAGE'): Observable<HelpData> {
    return this.httpClient
      .get<HelpData[]>(`${baseUrl}/${appId}/helpItems`, {
        params: {
          helpItemId,
        },
      })
      .pipe(map((helpItems) => helpItems[0]))
  }

  saveHelpPage(appId: string, helpItem: HelpData): Observable<HttpResponse<any>> {
    if (helpItem.id) {
      return this.httpClient.patch(`${baseUrl}/${appId}/helpItems/${helpItem.id}`, helpItem, {
        observe: 'response',
      })
    } else {
      return this.httpClient.post(`${baseUrl}/${appId}/helpItems`, helpItem, {
        observe: 'response',
      })
    }
  }

  saveHelpPageLegacy(helpItem: HelpData): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${baseUrl}/helpdata`, helpItem, {
      headers: {
        'Content-Type': 'application/v1+json',
        Accept: 'application/v1+json',
      },
      observe: 'response',
    })
  }
}
