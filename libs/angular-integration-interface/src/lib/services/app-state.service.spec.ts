import { AppStateService } from './app-state.service'

const createTopic = () => ({ destroy: jest.fn() })

jest.mock('@onecx/integration-interface', () => ({
  GlobalErrorTopic: jest.fn(() => createTopic()),
  GlobalLoadingTopic: jest.fn(() => createTopic()),
  CurrentMfeTopic: jest.fn(() => createTopic()),
  CurrentPageTopic: jest.fn(() => createTopic()),
  CurrentWorkspaceTopic: jest.fn(() => createTopic()),
  IsAuthenticatedTopic: jest.fn(() => createTopic()),
  CurrentLocationTopic: jest.fn(() => createTopic()),
}))

describe('AppStateService', () => {
  let service: AppStateService

  beforeEach(() => {
    service = new AppStateService()
  })

  it('should lazily initialize all topic getters', () => {
    expect(service.globalError$).toBeTruthy()
    expect(service.globalLoading$).toBeTruthy()
    expect(service.currentMfe$).toBeTruthy()
    expect(service.currentLocation$).toBeTruthy()
    expect(service.currentPage$).toBeTruthy()
    expect(service.currentWorkspace$).toBeTruthy()
    expect(service.isAuthenticated$).toBeTruthy()
  })

  it('should return the same instance for repeated getter access', () => {
    expect(service.globalError$).toBe(service.globalError$)
    expect(service.globalLoading$).toBe(service.globalLoading$)
    expect(service.currentMfe$).toBe(service.currentMfe$)
    expect(service.currentLocation$).toBe(service.currentLocation$)
    expect(service.currentPage$).toBe(service.currentPage$)
    expect(service.currentWorkspace$).toBe(service.currentWorkspace$)
    expect(service.isAuthenticated$).toBe(service.isAuthenticated$)
  })

  it('should allow overriding topics through setters', () => {
    const globalError = createTopic() as any
    const globalLoading = createTopic() as any
    const currentMfe = createTopic() as any
    const currentLocation = createTopic() as any
    const currentPage = createTopic() as any
    const currentWorkspace = createTopic() as any
    const isAuthenticated = createTopic() as any

    service.globalError$ = globalError
    service.globalLoading$ = globalLoading
    service.currentMfe$ = currentMfe
    service.currentLocation$ = currentLocation
    service.currentPage$ = currentPage
    service.currentWorkspace$ = currentWorkspace
    service.isAuthenticated$ = isAuthenticated

    expect(service.globalError$).toBe(globalError)
    expect(service.globalLoading$).toBe(globalLoading)
    expect(service.currentMfe$).toBe(currentMfe)
    expect(service.currentLocation$).toBe(currentLocation)
    expect(service.currentPage$).toBe(currentPage)
    expect(service.currentWorkspace$).toBe(currentWorkspace)
    expect(service.isAuthenticated$).toBe(isAuthenticated)
  })

  it('should destroy all initialized topics on destroy', () => {
    const globalError = createTopic() as any
    const globalLoading = createTopic() as any
    const currentMfe = createTopic() as any
    const currentLocation = createTopic() as any
    const currentPage = createTopic() as any
    const currentWorkspace = createTopic() as any
    const isAuthenticated = createTopic() as any

    service.globalError$ = globalError
    service.globalLoading$ = globalLoading
    service.currentMfe$ = currentMfe
    service.currentLocation$ = currentLocation
    service.currentPage$ = currentPage
    service.currentWorkspace$ = currentWorkspace
    service.isAuthenticated$ = isAuthenticated

    service.ngOnDestroy()

    expect(globalError.destroy).toHaveBeenCalledTimes(1)
    expect(globalLoading.destroy).toHaveBeenCalledTimes(1)
    expect(currentMfe.destroy).toHaveBeenCalledTimes(1)
    expect(currentLocation.destroy).toHaveBeenCalledTimes(1)
    expect(currentPage.destroy).toHaveBeenCalledTimes(1)
    expect(currentWorkspace.destroy).toHaveBeenCalledTimes(1)
    expect(isAuthenticated.destroy).toHaveBeenCalledTimes(1)
  })

  it('should not fail when destroy is called before initialization', () => {
    expect(() => service.ngOnDestroy()).not.toThrow()
  })
})
