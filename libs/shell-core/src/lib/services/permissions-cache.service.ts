import { Injectable } from '@angular/core'
import { Observable, shareReplay } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionsCacheService {
  permissions: Record<string, Observable<string[]>> = {}

  getPermissions(
    appId: string,
    productName: string,
    cacheMissFkt: (appId: string, productName: string) => Observable<string[]>
  ): Observable<string[]> {
    const key = appId + '|' + productName
    if (!this.permissions[key]) {
      this.permissions[key] = cacheMissFkt(appId, productName).pipe(shareReplay())
    }
    return this.permissions[key]
  }
}
