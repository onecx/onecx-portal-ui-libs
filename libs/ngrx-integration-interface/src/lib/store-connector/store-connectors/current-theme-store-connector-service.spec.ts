import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { CurrentThemeStoreConnectorService } from './current-theme-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { Theme } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  return {
    ...actual,
    CurrentThemeTopic: jest.fn().mockImplementation(() => {
      return new FakeTopic<Theme>()
    }),
  }
})

describe('CurrentThemeStoreConnectorService', () => {
  let store: Store
  let fakeTopic: FakeTopic<Theme>
  const mockTheme: Theme = { id: 'theme1', name: 'Theme 1', properties: {} }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CurrentThemeStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('should subscribe and dispatch currentThemeChanged', () => {
    const service = TestBed.inject(CurrentThemeStoreConnectorService)
    fakeTopic = (service as any).currentThemeTopic$ as FakeTopic<Theme>
    
    fakeTopic.publish(mockTheme)
    const expectedAction = OneCxActions.currentThemeChanged({ currentTheme: mockTheme })
    expect(store.dispatch).toHaveBeenCalledWith(expectedAction)
  })

  it('should destroy on ngOnDestroy', () => {
    const service = TestBed.inject(CurrentThemeStoreConnectorService)
    fakeTopic = (service as any).currentThemeTopic$ as FakeTopic<Theme>

    const destroySpy = jest.spyOn(fakeTopic, 'destroy')
    service.ngOnDestroy()
    expect(destroySpy).toHaveBeenCalled()
  })
})
