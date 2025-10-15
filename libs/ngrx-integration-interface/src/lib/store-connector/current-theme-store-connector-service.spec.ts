import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentThemeStoreConnectorService } from './current-theme-store-connector-service'
import { OneCxActions } from './onecx-actions'
import { Theme } from '../../../../integration-interface/src/lib/topics/current-theme/v1/theme.model'
import { CurrentThemeTopic } from '../../../../integration-interface/src/lib/topics/current-theme/v1/current-theme.topic'

describe('CurrentThemeStoreConnectorService', () => {
  let service: CurrentThemeStoreConnectorService
  let store: Store
  let mockTopic: any

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentThemeTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    TestBed.configureTestingModule({
      providers: [
        CurrentThemeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentThemeTopic, useValue: mockTopic },
      ],
    })
    service = TestBed.inject(CurrentThemeStoreConnectorService)
    store = TestBed.inject(Store)
  })

  it('should subscribe and dispatch currentThemeChanged', () => {
    const currentTheme: Theme = { id: 'theme1' }
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(currentTheme)
      return { unsubscribe: jest.fn() }
    })
    jest.spyOn(store, 'dispatch')
    service.ngOnInit?.()
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.currentThemeChanged({ currentTheme }))
  })

  it('should destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnInit?.()
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
