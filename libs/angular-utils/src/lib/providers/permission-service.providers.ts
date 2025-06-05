import { Provider } from '@angular/core'
import { PermissionService } from '../services/permission.service'

export function providePermissionService(): Provider[] {
  return [
    PermissionService
  ]
}
