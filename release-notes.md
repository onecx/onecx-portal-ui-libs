# Release notes

## allow multiple instances of portal-integration-angular
- **in webpackconfig.js remove the "singleton" and "strictVersion" property from: '@onecx/portal-integration-angular' and '@onecx/keycloak-auth'**
- **add to the webpackcanfig.js the other libraries: '@onecx/accelerator' and '@onecx/integration-interface'**

## config-key.model.ts
Keys are moved in this file from constants.ts as an enum list.

## UserService
- has lang$ to acces language
- To check on hasPermission() is now handled by UserService instead of AuthService
- userService.profile$ replaces auth.getCurrentUser(), .getUserRoles() and other user related data

## ConfigurationService
- lang and lang$ are now defined in UserService as lang$
- to get the portal ID use: configService.getProperty(CONFIG_KEY.TKIT_PORTAL_ID)
- to get the portal use: appStateService.currentPortal$.getValue()
- to set the portal use: appStateService.currentPortal$.publish(Portal)
- to get mfeInfo use: appStateService.currentMfe$.pipe(map((mfe) => mfe))
- to get baseUrl use: appStateService.currentMfe$.pipe(map((mfe) => mfe?.baseHref))
- determineLanguage() moved to UserService

## MessageService
- use PortalMessageService instead of MessageService everywhere (no app is allowed to use the MessageService anymore or problems arise)
- remove MessageService from the provider: { provide: MessageService, useExisting: PortalMessageService },

## createTranslateLoader
- use createTranslateLoader as factory to provide the TranslateLoader

## Replacement of MFE_INFO injection token

## apiPortalConfigProvider
- use apiPortalConfigProvider instead of basepathProvider
- apps have to use initializeModuleGuard or your custom one which needs to extends InitialModuleGuard
- if you want to extend the InitialModuleGuard with you own stuff
```
return this.toObservable(super.canActivate(...)).pipe(...)
```

## addInitialModuleGuard()
- use this function in RouterModule to add InitialModuleGuard to your routes to properly set the translations for the apps in shell mode
- add your custom InitialModuleGuard as second parameter to add it instead of the default InitialModuleGuard
- RouterModule.forChild(addInitialModuleGuard(routes))

## translateServiceInitializer
- to properly set the translateService for standalone mode