import { TestBed } from '@angular/core/testing'
import * as utils from './webcomponent-router-initializer.utils'
import { of } from 'rxjs'
import { AppStateService } from '@onecx/portal-integration-angular'

describe('webcomponent router initializer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      providers: [AppStateService],
    }).compileComponents()

    jest.clearAllMocks()
  })

  describe('initializeRouter', () => {
    it('should add mfeInfo to routes', async () => {
      const routes = [
        {
          data: {
            myProp: 'value',
          },
          path: 'first',
        },
        {
          data: {
            fromRoutesConfig: 'passing value',
          },
          path: 'second',
        },
      ]
      const router = {
        config: routes,
        resetConfig: jest.fn(),
      } as any
      const appStateService = TestBed.inject(AppStateService)
      jest.spyOn(appStateService.currentMfe$, 'asObservable').mockReturnValue(
        of({
          mfeInfoProp: 'mockedMfeInfo',
        }) as any
      )
      jest.spyOn(router, 'resetConfig')

      expect(router.resetConfig).toHaveBeenCalledTimes(0)

      await utils.initializeRouter(router, appStateService)()

      expect(router.resetConfig).toHaveBeenCalledTimes(1)
      expect(routes).toEqual([
        {
          data: {
            myProp: 'value',
            mfeInfo: {
              mfeInfoProp: 'mockedMfeInfo',
            },
          },
          path: 'first',
        },
        {
          data: {
            fromRoutesConfig: 'passing value',
            mfeInfo: {
              mfeInfoProp: 'mockedMfeInfo',
            },
          },
          path: 'second',
        },
        {
          path: '**',
          children: [],
        },
      ])
    })
  })
})
