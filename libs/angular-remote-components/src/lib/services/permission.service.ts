import { Injectable } from '@angular/core'
import { PermissionsRpcTopic } from '@onecx/integration-interface'
import { filter, firstValueFrom, map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissionsTopic$ = new PermissionsRpcTopic()

  async getPermissions(appId: string, productName: string): Promise<string[]> {
    const permissions = firstValueFrom(
      this.permissionsTopic$.pipe(
        filter(
          (message) =>
            message.appId === appId && message.productName === productName && Array.isArray(message.permissions)
        ),
        map((message) => message.permissions ?? [])
      )
    )
    this.permissionsTopic$.publish({ appId: appId, productName: productName })
    return permissions
  }
}
