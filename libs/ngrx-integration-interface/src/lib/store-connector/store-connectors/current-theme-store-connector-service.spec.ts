import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentThemeStoreConnectorService } from './current-theme-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Theme } from '@onecx/integration-interface';
import { CurrentThemeTopic } from '@onecx/integration-interface';
import { FakeTopic } from '@onecx/accelerator'

describe('CurrentThemeStoreConnectorService', () => {
  let store: Store
  let fakeTopic: FakeTopic<Theme>
  const mockTheme: Theme = { id: 'theme1', name: 'Theme 1', properties: {} }

  beforeEach(() => {
    fakeTopic = new FakeTopic<Theme>()
    TestBed.configureTestingModule({
      providers: [
        CurrentThemeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: CurrentThemeTopic, useValue: fakeTopic },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentThemeChanged', () => {
    TestBed.inject(CurrentThemeStoreConnectorService)
    fakeTopic.publish(mockTheme)
    const expectedAction = OneCxActions.currentThemeChanged({ currentTheme: mockTheme })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should destroy on ngOnDestroy', () => {
    const service = TestBed.inject(CurrentThemeStoreConnectorService)
    const destroySpy = jest.spyOn(fakeTopic, 'destroy')
    service.ngOnDestroy()
    expect(destroySpy).toHaveBeenCalled()
  })
})
