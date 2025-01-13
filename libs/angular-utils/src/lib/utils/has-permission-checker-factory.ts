import { Injector, Provider, StaticProvider } from '@angular/core'
import { UserService } from '@onecx/angular-integration-interface'
import { HAS_PERMISSION_CHECKER, HasPermissionChecker } from './has-permission-checker'

export function hasPermissionCheckerFactory(parentInjector: Injector, hasPermissionChecker: HasPermissionChecker | null) {
  if (!hasPermissionChecker) {
    const hasUserService = !!parentInjector.get(UserService, null)
    const injectorConfig: {
      providers: Array<Provider | StaticProvider>
      parent?: Injector
      name?: string
    } = {
      providers: [
        {
          provide: HAS_PERMISSION_CHECKER,
          useExisting: UserService,
        },
      ],
      parent: parentInjector,
    }
    if (!hasUserService) {
      injectorConfig.providers.push(UserService)
    }
    const injector = Injector.create(injectorConfig)
    hasPermissionChecker = injector.get(HAS_PERMISSION_CHECKER)
  }
  return hasPermissionChecker
}
