import { Injectable } from '@angular/core'
import { Observable, of, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionsCacheService {
  permissions: Record<string, string[]> = {}

  getPermissions(
    appId: string,
    productName: string,
    cachemissFkt: (appId: string, productName: string) => Observable<string[]>
  ): Observable<string[]> {
    const key = appId + '|' + productName
    if (this.permissions[key]) {
      return of(this.permissions[key])
    }
    return cachemissFkt(appId, productName).pipe(tap((permissions) => (this.permissions[key] = permissions)))
  }
}
