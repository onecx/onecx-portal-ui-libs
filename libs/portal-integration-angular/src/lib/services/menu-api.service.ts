import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable, inject } from '@angular/core'
// import { withCache } from '@ngneat/cashew'
import { Observable, of } from 'rxjs'
import { PortalMenuItem } from '../model/menu-item.model'

@Injectable({
  providedIn: 'root',
})
export class MenuApiService {
  private http = inject(HttpClient);

  private menuUrl = './portal-api/v1/portals' // URL to web api

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  }

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  getMenuItems(portalId: string): Observable<PortalMenuItem[]> {
    return this.http.get<PortalMenuItem[]>(`${this.menuUrl}/${portalId}/menu`)
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error) // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}, will return ${JSON.stringify(result)}`)

      // Let the app keep running by returning an empty result.
      return of(result as T)
    }
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    console.log(message)
  }
}
