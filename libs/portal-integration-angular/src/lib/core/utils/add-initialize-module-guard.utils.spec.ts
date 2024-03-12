import { TranslateService } from '@ngx-translate/core'
import { AppStateService } from '@onecx/angular-integration-interface'
import { ConfigurationService } from '../../services/configuration.service'
import { InitializeModuleGuard } from '../../services/initialize-module-guard.service'
import { UserService } from '@onecx/angular-integration-interface'
import { addInitializeModuleGuard } from './add-initialize-module-guard.utils'
import { TimeagoIntl } from 'ngx-timeago'

class MockInitializeModuleGuard extends InitializeModuleGuard {
  constructor(
    translateService: TranslateService,
    configService: ConfigurationService,
    appStateService: AppStateService,
    userService: UserService,
    timeagoIntl: TimeagoIntl
  ) {
    super(translateService, configService, appStateService, userService, timeagoIntl)
  }
}

describe('AddInitializeGuard', () => {
  it('should add canActivate array with InitializeModuleGuard to routes without canActivate and redirectTo properties', () => {
    const testRoutesNoCanActivate = [
      {
        path: 'testPathAddInitializerModuleGuard1',
      },
      {
        path: 'testPathAddInitializerModuleGuard2',
      },
    ]

    const expectedRoutes = [
      {
        path: 'testPathAddInitializerModuleGuard1',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPathAddInitializerModuleGuard2',
        canActivate: [InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesNoCanActivate)

    expect(modifiedRoutes).toEqual(expectedRoutes)
    expect(testRoutesNoCanActivate).not.toEqual(expectedRoutes)
  })

  it('should add InitializeModuleGuard to canActivate array which already has some other guard', () => {
    const testRoutesWithMockInitializeModuleGuard = [
      {
        path: 'testPathHasMockInitializeModueGuard1',
        canActivate: [MockInitializeModuleGuard],
      },
      {
        path: 'testPath',
      },
      {
        path: 'testPathHasMockInitializeModueGuard2',
        canActivate: [MockInitializeModuleGuard],
      },
    ]

    const expectedRoutes = [
      {
        path: 'testPathHasMockInitializeModueGuard1',
        canActivate: [MockInitializeModuleGuard, InitializeModuleGuard],
      },
      {
        path: 'testPath',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPathHasMockInitializeModueGuard2',
        canActivate: [MockInitializeModuleGuard, InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesWithMockInitializeModuleGuard)

    expect(modifiedRoutes).toEqual(expectedRoutes)
    expect(testRoutesWithMockInitializeModuleGuard).not.toEqual(expectedRoutes)
  })

  it('should not add another InitializeModuleGuard to canActivate array which already has an InitializeModuleGuard', () => {
    const testRoutesWithInitializeModuleGuard = [
      {
        path: 'testPath1',
      },
      {
        path: 'testPathHasInitializeModueGuard1',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPathHasInitializeModueGuard2',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath2',
      },
      {
        path: 'testPathHasInitializeModueGuard3',
        canActivate: [InitializeModuleGuard],
      },
    ]

    const expectedRoutes = [
      {
        path: 'testPath1',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPathHasInitializeModueGuard1',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPathHasInitializeModueGuard2',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath2',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPathHasInitializeModueGuard3',
        canActivate: [InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesWithInitializeModuleGuard)

    expect(modifiedRoutes).toEqual(expectedRoutes)
    expect(testRoutesWithInitializeModuleGuard).not.toEqual(expectedRoutes)
  })

  it('should not add InitializeModuleGuard if a route has the redirectTo property', () => {
    const testRoutesWithRedirectTo = [
      {
        path: 'testPathHasRedirectTo1',
        redirectTo: 'redirectToPath1',
      },
      {
        path: 'someTestPath1',
      },
      {
        path: 'testPathHasRedirectTo2',
        redirectTo: 'redirectToPath2',
      },
      {
        path: 'someTestPath2',
      },
    ]

    const expectedRoutes = [
      {
        path: 'testPathHasRedirectTo1',
        redirectTo: 'redirectToPath1',
      },
      {
        path: 'someTestPath1',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPathHasRedirectTo2',
        redirectTo: 'redirectToPath2',
      },
      {
        path: 'someTestPath2',
        canActivate: [InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesWithRedirectTo)

    expect(modifiedRoutes).toEqual(expectedRoutes)
    expect(testRoutesWithRedirectTo).not.toEqual(expectedRoutes)
  })

  it('should add canActivate array with MockInitializeModuleGuard to routes without canActivate and redirectTo properties', () => {
    const testRoutesNoCanActivate = [
      {
        path: 'testPathAddMockInitializerModuleGuard1',
      },
      {
        path: 'testPathAddMockInitializerModuleGuard2',
      },
      {
        path: 'testPathAddMockInitializerModuleGuard3',
      },
    ]

    const expectedRoutes = [
      {
        path: 'testPathAddMockInitializerModuleGuard1',
        canActivate: [MockInitializeModuleGuard],
      },
      {
        path: 'testPathAddMockInitializerModuleGuard2',
        canActivate: [MockInitializeModuleGuard],
      },
      {
        path: 'testPathAddMockInitializerModuleGuard3',
        canActivate: [MockInitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesNoCanActivate, MockInitializeModuleGuard)

    expect(modifiedRoutes).toEqual(expectedRoutes)
    expect(testRoutesNoCanActivate).not.toEqual(expectedRoutes)
  })

  it('should add MockInitializeModuleGuard to canActivate array', () => {
    const testRoutesWithMockInitializeModuleGuard = [
      {
        path: 'testPathHasMockInitializeModueGuard1',
        canActivate: [MockInitializeModuleGuard],
      },
      {
        path: 'somePath',
      },
      {
        path: 'testPathHasMockInitializeModueGuard2',
        canActivate: [InitializeModuleGuard],
      },
    ]

    const expectedRoutes = [
      {
        path: 'testPathHasMockInitializeModueGuard1',
        canActivate: [MockInitializeModuleGuard],
      },
      {
        path: 'somePath',
        canActivate: [MockInitializeModuleGuard],
      },
      {
        path: 'testPathHasMockInitializeModueGuard2',
        canActivate: [InitializeModuleGuard, MockInitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesWithMockInitializeModuleGuard, MockInitializeModuleGuard)

    expect(modifiedRoutes).toEqual(expectedRoutes)
    expect(testRoutesWithMockInitializeModuleGuard).not.toEqual(expectedRoutes)
  })
})
