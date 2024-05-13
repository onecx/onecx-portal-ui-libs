import { Injectable } from '@angular/core'
import { PermissionsTopic } from '@onecx/integration-interface'
import { filter, firstValueFrom, map } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private permissionsTopic$ = new PermissionsTopic()

  async getPermissions(appId: string, productName: string): Promise<string[]> {
    this.permissionsTopic$.publish({ appId: appId, productName: productName })

    return firstValueFrom(
      this.permissionsTopic$.pipe(
        filter(
          (message) =>
            message.appId === appId &&
            message.productName === productName &&
            Array.isArray(message.permissions) &&
            message.permissions.length > 0
        ),
        map((message) => message.permissions ?? [])
      )
    )
  }
}
