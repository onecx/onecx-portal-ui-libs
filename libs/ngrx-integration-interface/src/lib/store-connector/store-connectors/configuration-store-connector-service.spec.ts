import { TestBed } from '@angular/core/testing'
import { Store } from '@ngrx/store'
import { ConfigurationStoreConnectorService } from './configuration-store-connector-service'
import { OneCxActions } from '../onecx-actions'
import { ConfigurationService } from '@onecx/angular-integration-interface'
import { Config } from '@onecx/integration-interface'
import { FakeTopic } from '@onecx/accelerator'

describe('ConfigurationStoreConnectorService', () => {
  let store: Store
  let configTopic: FakeTopic<Config>

  beforeEach(() => {
    configTopic = new FakeTopic<Config>()
    TestBed.configureTestingModule({
      providers: [
        ConfigurationStoreConnectorService,
        { provide: Store, useValue: { dispatch: jest.fn() } },
        { provide: ConfigurationService, useValue: { config$: configTopic } },
      ],
    })
    store = TestBed.inject(Store)
    jest.spyOn(store, 'dispatch')
  })

  it('given the connector is created, when the initial configuration is published, then configChanged is dispatched for it', () => {
    TestBed.inject(ConfigurationStoreConnectorService)
    configTopic.publish({ a: '1' })
    expect(store.dispatch).toHaveBeenCalledTimes(1)
    expect(store.dispatch).toHaveBeenCalledWith(OneCxActions.configChanged({ config: { a: '1' } }))
  })

  it('given the initial configuration is published, when a changed configuration is published, then configChanged is dispatched for both, in that order', () => {
    TestBed.inject(ConfigurationStoreConnectorService)
    configTopic.publish({ a: '1' })
    configTopic.publish({ a: '1', b: '2' })
    expect(store.dispatch).toHaveBeenCalledTimes(2)
    expect(store.dispatch).toHaveBeenNthCalledWith(1, OneCxActions.configChanged({ config: { a: '1' } }))
    expect(store.dispatch).toHaveBeenNthCalledWith(2, OneCxActions.configChanged({ config: { a: '1', b: '2' } }))
  })

  it('given the connector is destroyed, when a configuration is published, then no action is dispatched', () => {
    const connector = TestBed.inject(ConfigurationStoreConnectorService)
    connector.ngOnDestroy()
    configTopic.publish({ a: '1' })
    expect(store.dispatch).not.toHaveBeenCalled()
  })
})
