import { TranslateService } from '@ngx-translate/core'
import { ConfigurationService } from '../../services/configuration.service'
import { InitializeModuleGuard } from '../../services/initialize-module-guard.service'
import { addInitializeModuleGuard } from './addInitializeModuleGuard'

class MockInitializeModuleGuard extends InitializeModuleGuard {
  constructor(translateService: TranslateService, configService: ConfigurationService) {
    super(translateService, configService)
  }
}

describe('AddInitializeGuard', () => {
  const testRoutesNoCanActivate = [
    {
      path: 'testPath1',
    },
    {
      path: 'testPath2',
    },
    {
      path: 'testPath3',
    },
  ]

  const testRoutesWithMockInitializeModuleGuard = [
    {
      path: 'testPath1',
      canActivate: [MockInitializeModuleGuard],
    },
    {
      path: 'testPath2',
    },
    {
      path: 'testPath3',
    },
  ]

  const testRoutesWithInitializeModuleGuard = [
    {
      path: 'testPath1',
      canActivate: [InitializeModuleGuard],
    },
    {
      path: 'testPath2',
    },
    {
      path: 'testPath3',
    },
  ]

  const testRoutesWithRedirectTo = [
    {
      path: 'testPath1',
      redirectTo: 'redirectToPath',
    },
    {
      path: 'testPath2',
    },
    {
      path: 'testPath3',
    },
  ]

  it('should add canActivate array with InitializeModuleGuard to routes without canActivate and redirectTo properties', () => {
    const expectedRoutes = [
      {
        path: 'testPath1',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath2',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath3',
        canActivate: [InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesNoCanActivate)

    expect(modifiedRoutes).toEqual(expectedRoutes)
  })

  it('should add InitializeModuleGuard to canActivate array which already has some other guard', () => {
    const expectedRoutes = [
      {
        path: 'testPath1',
        canActivate: [MockInitializeModuleGuard, InitializeModuleGuard],
      },
      {
        path: 'testPath2',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath3',
        canActivate: [InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesWithMockInitializeModuleGuard)

    expect(modifiedRoutes).toEqual(expectedRoutes)
  })

  it('should not add another InitializeModuleGuard to canActivate array which already has an InitializeModuleGuard', () => {
    const expectedRoutes = [
      {
        path: 'testPath1',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath2',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath3',
        canActivate: [InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesWithInitializeModuleGuard)
    
    expect(modifiedRoutes).toEqual(expectedRoutes)
  })

  it('should not add InitializeModuleGuard if a route has the redirectTo property', () => {
    const expectedRoutes = [
      {
        path: 'testPath1',
        redirectTo: 'redirectToPath',
      },
      {
        path: 'testPath2',
        canActivate: [InitializeModuleGuard],
      },
      {
        path: 'testPath3',
        canActivate: [InitializeModuleGuard],
      },
    ]
    const modifiedRoutes = addInitializeModuleGuard(testRoutesWithRedirectTo)

    expect(modifiedRoutes).toEqual(expectedRoutes)
  })
})
