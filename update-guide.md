# Update from v3 to v4 guide

## install necessary libraries
- can be found here: https://www.npmjs.com/search?q=onecx
- (NOTE: if you still have something like "@onecx:registry=https://gitlab.com..." in your .npmrc file then please remove it)
- install latest version:
```
npm i @onecx/portal-layout-styles
npm i @onecx/integration-interface
npm i @onecx/accelerator
npm i @onecx/portal-integration-angular
npm i @onecx/keycloak-auth
```

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

## Workaround for correctly providing NgRx
- because of an issue in NgRx, we need to use a workaround to correctly provide it in the app
- your ...remote.module.ts should look like this for example:
```
// ... your imports
import { Actions, EffectSources, EffectsRunner } from '@ngrx/effects';

// Workaround for the following issue:
// https://github.com/ngrx/platform/issues/3700
const effectProvidersForWorkaround = [EffectsRunner, EffectSources, Actions];
effectProvidersForWorkaround.forEach((p) => (p.ɵprov.providedIn = null));

@NgModule({
  imports: [
    // ... your other angular imports

    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effectProvidersForWorkaround),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: false,
      traceLimit: 75,
    }),
  ],
  exports: [],
  providers: [],
})
export class YourModule {}
```

## config key constants
- have been moved as an enum list with the name CONFIG_KEY

## AuthService
- hasPermission() has been moved to UserService 
- .getCurrentUser(), .getUserRoles() and to get other user related data is now done with userService.profile$

## ConfigurationService
- lang and lang$ are now defined in UserService as lang$: BehaviorSubject<string> and to get the value use:
```
userService.lang$.getValue()
or
userService.lang$.value
```
- to get the portal ID use:
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
- remove MessageService from the provider
```
{ provide: MessageService, useExisting: PortalMessageService },
```

## mfe info
- use createTranslateLoader from portal-integration-angular as factory to provide the TranslateLoader
```
loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient, AppStateService],
},
```

- get mfeinfo from appStateService.currentMfe$ like below which waits until currentMfe is there
```
combineLatest([appStateService.currentMfe$.asObservable(), appStateService.globalLoading$.asObservable()]).pipe(
      filter(([, isLoading]) => !isLoading),
      map(([currentMfe]) => {})
```

- use apiPortalConfigProvider instead of basepathProvider
```
// you have to look from where the api prefix comes from, because it does not have to be defined in the environment file
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
- apps have to use initializeModuleGuard or your custom one which needs to extend InitializeModuleGuard see [here](#routing-and-canActivate)

## routing and canActivate
- always use the InitializeModuleGuard from portal-integration-angular
- to add the InitializeModuleGuard to your routes to properly set the translations for the apps in shell mode, use addInitializeModuleGuard() in RouterModule.forRoot() or .forChild() 
```
RouterModule.forChild(addInitializeModuleGuard(routes))
```

- if you need to add something additionally to the InitializeModuleGuard, then you have to create your own guard by extending the InitializeModuleGuard and use toObservable() like in the following example
```
@Injectable()
export class CustomInitializeModuleGuard extends InitializeModuleGuard {
  constructor(
    translateService: TranslateService,
    configService: ConfigurationService,
    appStateService: AppStateService,
    userService: UserService
  ) {
    super(translateService, configService, appStateService, userService)
  }

  override canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.toObservable(super.canActivate(_route, _state)).pipe(
        // TODO add your own stuff
    )
  }
}
```

- add your custom InitializeModuleGuard as the second parameter to add it to the routes instead of the InitializeModuleGuard from portal-integration-angular
```
RouterModule.forChild(addInitializeModuleGuard(routes,CustomInitializeModuleGuard))
```

## translateServiceInitializer
- to properly set up the translateService in all cases for standalone mode, add the following to your standalone module
```
{
    provide: APP_INITIALIZER,
    useFactory: translateServiceInitializer,
    multi: true,
    deps: [UserService, TranslateService],
},
```

## Renaming
- MyMissingTranslationHandler --> PortalMissingTranslationHandler
