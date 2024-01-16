import { HttpClient } from '@angular/common/http'
import { AppStateService } from '../../services/app-state.service'
import { createTranslateLoader } from './create-translate-loader.utils'
import { MockService } from 'ng-mocks'
import { Observable, of } from 'rxjs'
import { Config, MfeInfo } from '@onecx/integration-interface'
import { ConfigurationService } from '../../services/configuration.service'

describe('CreateTranslateLoader', () => {
  const httpClientMock = MockService(HttpClient)
  httpClientMock.get = jest.fn(() => of({})) as any
  let currentMfe$: Observable<Partial<MfeInfo>>
  let globalLoading$: Observable<boolean>
  let config$: Observable<Partial<Config>>

  const appStateServiceMock = {
    currentMfe$: { asObservable: () => currentMfe$ },
    globalLoading$: { asObservable: () => globalLoading$ },
  }

  const configurationServiceMock = {
    config$: { asObservable: () => config$ },
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should call httpClient get 3 times if a remoteBaseUrl is set and if global loading is finished', () => {
    currentMfe$ = of({ remoteBaseUrl: 'remoteUrl' })
    globalLoading$ = of(false)
    config$ = of({})
    const translateLoader = createTranslateLoader(
      httpClientMock,
      <AppStateService>(<unknown>appStateServiceMock),
      <ConfigurationService>configurationServiceMock
    )

    translateLoader.getTranslation('en').subscribe()

    expect(httpClientMock.get).toHaveBeenCalledTimes(3)
  })

  it('should call httpClient get 2 times if no remoteBaseUrl is set and if global loading is finished', () => {
    currentMfe$ = of({})
    globalLoading$ = of(false)
    config$ = of()
    const translateLoader = createTranslateLoader(
      httpClientMock,
      <AppStateService>(<unknown>appStateServiceMock),
      <ConfigurationService>configurationServiceMock
    )

    translateLoader.getTranslation('en').subscribe()

    expect(httpClientMock.get).toHaveBeenCalledTimes(2)
  })

  it('should not call httpClient get if global loading is not finished', () => {
    currentMfe$ = of({})
    globalLoading$ = of(true)
    config$ = of({})
    const translateLoader = createTranslateLoader(
      httpClientMock,
      <AppStateService>(<unknown>appStateServiceMock),
      <ConfigurationService>configurationServiceMock
    )

    translateLoader.getTranslation('en').subscribe()

    expect(httpClientMock.get).toHaveBeenCalledTimes(0)
  })
})
