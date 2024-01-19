# Release notes

## allow multiple instances of portal-integration-angular
- **in webpackconfig.js remove the "singleton" and "strictVersion" property from: '@onecx/portal-integration-angular' and '@onecx/keycloak-auth'**
- **add the following to webpackconfig.js inside the share: shared({}) property**
```
'@onecx/accelerator': {
    requiredVersion: 'auto',
    includeSecondaries: true,
},
'@onecx/integration-interface': {
    requiredVersion: 'auto',
    includeSecondaries: true,
},
```

## config key constants
- have been moved as an enum list with the name CONFIG_KEY

## AuthService
- hasPermission() has been moved to UserService 
- getCurrentUser(), .getUserRoles() and to get other user related data is now done with userService.profile$

## ConfigurationService
- lang and lang$ are now defined in UserService as lang$
- to get the portal ID use
```
configService.getProperty(CONFIG_KEY.TKIT_PORTAL_ID)
```
- to get the portal use:
```
appStateService.currentPortal$.getValue()
```
- to set the portal use:
```
await appStateService.currentPortal$.publish(Portal)
```
- to get mfeInfo use: see [here](#mfe-info)
- to get baseUrl use: see [here](#mfe-info)
- determineLanguage() moved to UserService

## MessageService
- use PortalMessageService instead of MessageService everywhere (no app is allowed to use the MessageService anymore or problems arise)
- remove MessageService from the provider: { provide: MessageService, useExisting: PortalMessageService },

## mfe info
- use createTranslateLoader from portal-integration-angular as factory to provide the TranslateLoader
```
loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient, AppStateService, ConfigurationService],
},
```

- get mfeinfo from appStateService.currentMfe$ like below which waits until currentMfe is there
```
combineLatest([appStateService.currentMfe$.asObservable(), appStateService.globalLoading$.asObservable()]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {})
```

- use apiPortalConfigProvider instead of basepathProvider
- apps have to use initializeModuleGuard or your custom one which needs to extends InitialModuleGuard  see [here](#routing-and-canActivate)
```
export function apiConfigProvider(configService: ConfigurationService, appStateService: AppStateService) {
  return new PortalApiConfiguration(Configuration, environment.apiPrefix, configService, appStateService)
}
```
```
{
    provide: Configuration,
    useFactory: apiConfigProvider,
    deps: [ConfigurationService, AppStateService],
},
```

## routing and canActivate
- use addInitialModuleGuard() in RouterModule to add InitialModuleGuard to your routes to properly set the translations for the apps in shell mode
- add your custom InitialModuleGuard as second parameter to add it instead of the imported InitialModuleGuard
```
RouterModule.forChild(addInitialModuleGuard(routes))
```

- if you want to extend the InitialModuleGuard with your own guard, do the following
```
return this.toObservable(super.canActivate(...)).pipe(...)
```

## translateServiceInitializer
- to properly set the translateService for standalone mode
```
{
    provide: APP_INITIALIZER,
    useFactory: translateServiceInitializer,
    multi: true,
    deps: [UserService, TranslateService],
},
```
