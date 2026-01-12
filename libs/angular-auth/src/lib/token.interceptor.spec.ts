import { TestBed } from '@angular/core/testing'
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { provideTokenInterceptor } from './angular-auth.module'
import { AuthProxyService } from './auth-proxy.service'
import { AppStateService } from '@onecx/angular-integration-interface'
import { IsAuthenticatedTopic } from '@onecx/integration-interface'
import { provideAppStateServiceMock } from '@onecx/angular-integration-interface/mocks'

describe('TokenInterceptor', () => {
  let http: HttpClient
  let httpMock: HttpTestingController
  let isAuthenticatedTopic: IsAuthenticatedTopic
  let updateTokenSpy: jest.Mock

  beforeEach(async () => {
    isAuthenticatedTopic = new IsAuthenticatedTopic()
    updateTokenSpy = jest.fn().mockResolvedValue(true)

    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideTokenInterceptor(),
        { provide: AuthProxyService, useValue: {
          getHeaderValues: () => ({ Authorization: 'Bearer test-token', 'apm-principal-token': 'id-token' }),
          updateTokenIfNeeded: updateTokenSpy,
        } },
        provideAppStateServiceMock(),
      ],
    }).compileComponents()

    http = TestBed.inject(HttpClient)
    httpMock = TestBed.inject(HttpTestingController)
    const appState = TestBed.inject(AppStateService)
    appState.isAuthenticated$ = isAuthenticatedTopic
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should not send requests before authentication is initialized', async () => {
    http.get('/api/test').subscribe()

    httpMock.expectNone('/api/test')

    await isAuthenticatedTopic.publish(undefined as any)

    const req = httpMock.expectOne('/api/test')
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token')
    expect(req.request.headers.get('apm-principal-token')).toBe('id-token')

    req.flush({ ok: true })
    expect(updateTokenSpy).toHaveBeenCalled()
  })

  it('should append tokens only after authentication is initialized', async () => {
    const promise = new Promise<void>((resolve) => {
      http.get('/api/secure').subscribe(() => resolve())
    })

    httpMock.expectNone('/api/secure')

    await isAuthenticatedTopic.publish(undefined as any)

    const req = httpMock.expectOne('/api/secure')
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token')
    expect(req.request.headers.get('apm-principal-token')).toBe('id-token')
    req.flush({ ok: true })
    await promise
  })

  it('should skip whitelisted asset requests without token', async () => {
    const assetPromise = new Promise<void>((resolve) => {
      http.get('/assets/config.json').subscribe(() => resolve())
    })

    const req = httpMock.expectOne('/assets/config.json')
    expect(req.request.headers.get('Authorization')).toBeNull()
    expect(req.request.headers.get('apm-principal-token')).toBeNull()
    req.flush({})
    await assetPromise
  })
})
