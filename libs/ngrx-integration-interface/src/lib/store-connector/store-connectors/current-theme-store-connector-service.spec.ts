import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentThemeStoreConnectorService } from './current-theme-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Theme } from '@onecx/integration-interface';
import { CurrentThemeTopic } from '@onecx/integration-interface';

describe('CurrentThemeStoreConnectorService', () => {
  let service: CurrentThemeStoreConnectorService
  let store: Store
  let mockTopic: any
  const mockTheme: Theme = { id: 'theme1', name: 'Theme 1', properties: {} }

  beforeEach(() => {
    mockTopic = Object.assign(new CurrentThemeTopic(), {
      pipe: jest.fn().mockReturnThis(),
      destroy: jest.fn(),
    })
    mockTopic.subscribe = jest.fn() as jest.Mock;
    mockTopic.subscribe.mockImplementation((cb: any) => {
      cb(mockTheme)
      return { unsubscribe: jest.fn() }
    })
    TestBed.configureTestingModule({
      providers: [
        CurrentThemeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentThemeTopic, useValue: mockTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
    service = TestBed.inject(CurrentThemeStoreConnectorService)
  })

  it('should subscribe and dispatch currentThemeChanged', () => {
    const expectedAction = OneCxActions.currentThemeChanged({ currentTheme: mockTheme })
    expect(mockTopic.subscribe).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should unsubscribe and destroy on ngOnDestroy', () => {
    mockTopic.subscribe.mockReturnValue({ unsubscribe: jest.fn() })
    service.ngOnDestroy()
    expect(mockTopic.destroy).toHaveBeenCalled()
  })
})
