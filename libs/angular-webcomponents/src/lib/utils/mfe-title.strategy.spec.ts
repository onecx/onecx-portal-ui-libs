import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Title } from '@angular/platform-browser'
import { provideRouter, Routes } from '@angular/router'
import { RouterTestingHarness } from '@angular/router/testing'
import { ShellCapabilityService } from '@onecx/angular-integration-interface'
import { DocumentTitleTopic, ShellCapability } from '@onecx/integration-interface'
import { provideMfeTitleStrategy } from './mfe-title.strategy'

@Component({ template: '' })
class PageComponent {}

const routes: Routes = [
  { path: 'search', title: 'Search users', component: PageComponent },
  { path: 'untitled', component: PageComponent },
]

interface Spies {
  publish: jest.SpyInstance
  destroy: jest.SpyInstance
}

async function navigate(...urls: string[]): Promise<void> {
  const harness = await RouterTestingHarness.create()
  for (const url of urls) {
    await harness.navigateByUrl(url)
  }
}

function setUp(capabilities: ShellCapability[]): Spies {
  const spies = {
    publish: jest.spyOn(DocumentTitleTopic.prototype, 'publish').mockResolvedValue(),
    destroy: jest.spyOn(DocumentTitleTopic.prototype, 'destroy'),
  }
  ShellCapabilityService.setCapabilities(capabilities)
  document.title = 'Shell title'
  TestBed.configureTestingModule({
    providers: [provideRouter(routes), provideMfeTitleStrategy()],
  })
  return spies
}

afterEach(() => {
  ShellCapabilityService.setCapabilities([])
  jest.restoreAllMocks()
})

describe('MfeTitleStrategy given the shell supports the document title topic', () => {
  let spies: Spies

  beforeEach(() => {
    spies = setUp([ShellCapability.DOCUMENT_TITLE_TOPIC])
  })

  it('when navigating to a route with title, then the title and current path are published and the document title is untouched', async () => {
    await navigate('/search')

    expect(spies.publish).toHaveBeenCalledWith({ title: 'Search users', path: document.location.pathname })
    expect(document.title).toBe('Shell title')
  })

  it('when navigating to a route without title, then a message without title is published', async () => {
    await navigate('/untitled')

    expect(spies.publish).toHaveBeenCalledWith({ title: undefined, path: document.location.pathname })
    expect(document.title).toBe('Shell title')
  })

  it('when navigating between routes, then the title of every activated route is published', async () => {
    await navigate('/search', '/untitled')

    expect(spies.publish).toHaveBeenNthCalledWith(1, { title: 'Search users', path: document.location.pathname })
    expect(spies.publish).toHaveBeenNthCalledWith(2, { title: undefined, path: document.location.pathname })
  })

  it('when the application is destroyed, then the document title topic is destroyed', async () => {
    await navigate('/search')

    TestBed.resetTestingModule()

    expect(spies.destroy).toHaveBeenCalled()
  })
})

describe('MfeTitleStrategy given the shell does not support the document title topic', () => {
  let spies: Spies

  beforeEach(() => {
    spies = setUp([])
  })

  it('when navigating to a route with title, then the document title is set and nothing is published', async () => {
    await navigate('/search')

    expect(TestBed.inject(Title).getTitle()).toBe('Search users')
    expect(spies.publish).not.toHaveBeenCalled()
  })

  it('when navigating to a route without title, then the document title is untouched', async () => {
    await navigate('/untitled')

    expect(document.title).toBe('Shell title')
    expect(spies.publish).not.toHaveBeenCalled()
  })

  it('when the application is destroyed, then no document title topic has to be destroyed', async () => {
    await navigate('/search')

    TestBed.resetTestingModule()

    expect(spies.destroy).not.toHaveBeenCalled()
  })
})
