import { Injectable } from '@angular/core'
import { PermissionsRpcTopic } from '@onecx/integration-interface'
import { filter, firstValueFrom, map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissionsTopic$ = new PermissionsRpcTopic()
  private readonly permissionCache = new Map<string, Promise<string[]>>()

  async getPermissions(appId: string, productName: string): Promise<string[]> {
    const cacheKey = `${appId}:${productName}`
    if (this.permissionCache.has(cacheKey)) {
      return this.permissionCache.get(cacheKey)!
    }

    const permissions = firstValueFrom(
      this.permissionsTopic$.pipe(
        filter(
          (message) =>
            message.appId === appId && message.productName === productName && Array.isArray(message.permissions)
        ),
        map((message) => message.permissions ?? [])
      )
    )
    this.permissionCache.set(cacheKey, permissions)
    this.permissionsTopic$.publish({ appId: appId, productName: productName })
    return permissions
  }
}
