import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Router, provideRouter } from '@angular/router'
import { ShellCapabilityService } from '@onecx/angular-integration-interface'
import { DocumentTitle, DocumentTitleTopic, ShellCapability } from '@onecx/integration-interface'
import { firstValueFrom, take, toArray } from 'rxjs'
import { provideMfeTitleStrategy } from './mfe-title.strategy'

@Component({ template: '' })
class EmptyComponent {}

const ORIGINAL_TITLE = 'Original title'

function setupRouter(): Router {
  TestBed.configureTestingModule({
    providers: [
      provideRouter([
        { path: 'search', title: 'Search Users', component: EmptyComponent },
        { path: 'untitled', component: EmptyComponent },
      ]),
      provideMfeTitleStrategy(),
    ],
  })
  return TestBed.inject(Router)
}

function setupEnvironment(capabilities: ShellCapability[]): void {
  beforeEach(() => {
    document.title = ORIGINAL_TITLE
    ShellCapabilityService.setCapabilities(capabilities)
  })

  afterEach(() => {
    ShellCapabilityService.setCapabilities([])
  })
}

describe('MfeTitleStrategy given the shell provides the document title topic capability', () => {
  let listenerTopic: DocumentTitleTopic

  setupEnvironment([ShellCapability.DOCUMENT_TITLE_TOPIC])

  beforeEach(() => {
    listenerTopic = new DocumentTitleTopic()
  })

  afterEach(() => {
    listenerTopic.destroy()
  })

  it('when navigating to a route with a title, then the title is published with the current path and document.title stays unchanged', async () => {
    const router = setupRouter()
    const received = firstValueFrom(listenerTopic.asObservable())

    await router.navigateByUrl('/search')

    expect(await received).toEqual<DocumentTitle>({ title: 'Search Users', path: document.location.pathname })
    expect(document.title).toBe(ORIGINAL_TITLE)
  })

  it('when navigating to a route without a title, then an undefined title is published with the current path', async () => {
    const router = setupRouter()
    const received = firstValueFrom(listenerTopic.asObservable())

    await router.navigateByUrl('/untitled')

    expect(await received).toEqual<DocumentTitle>({ title: undefined, path: document.location.pathname })
    expect(document.title).toBe(ORIGINAL_TITLE)
  })

  it('when navigating to two routes one after another, then the title of each route is published in order', async () => {
    const router = setupRouter()
    const received = firstValueFrom(listenerTopic.asObservable().pipe(take(2), toArray()))

    await router.navigateByUrl('/search')
    await router.navigateByUrl('/untitled')

    expect(await received).toEqual<DocumentTitle[]>([
      { title: 'Search Users', path: document.location.pathname },
      { title: undefined, path: document.location.pathname },
    ])
  })
})

describe('MfeTitleStrategy given the shell does not provide the document title topic capability', () => {
  setupEnvironment([])

  it('when navigating to a route with a title, then document.title is set to the route title', async () => {
    const router = setupRouter()

    await router.navigateByUrl('/search')

    expect(document.title).toBe('Search Users')
  })

  it('when navigating to a route without a title, then document.title stays unchanged', async () => {
    const router = setupRouter()

    await router.navigateByUrl('/untitled')

    expect(document.title).toBe(ORIGINAL_TITLE)
  })
})

describe('MfeTitleStrategy on destroy', () => {
  let destroySpy: jest.SpyInstance

  beforeEach(() => {
    destroySpy = jest.spyOn(DocumentTitleTopic.prototype, 'destroy')
  })

  afterEach(() => {
    destroySpy.mockRestore()
    ShellCapabilityService.setCapabilities([])
  })

  it('given a title was published to the shell, when the application is destroyed, then the document title topic is destroyed', async () => {
    ShellCapabilityService.setCapabilities([ShellCapability.DOCUMENT_TITLE_TOPIC])
    const router = setupRouter()
    await router.navigateByUrl('/search')

    TestBed.resetTestingModule()

    expect(destroySpy).toHaveBeenCalledTimes(1)
  })

  it('given the title was set directly, when the application is destroyed, then no document title topic is destroyed', async () => {
    ShellCapabilityService.setCapabilities([])
    const router = setupRouter()
    await router.navigateByUrl('/search')

    TestBed.resetTestingModule()

    expect(destroySpy).not.toHaveBeenCalled()
  })
})
