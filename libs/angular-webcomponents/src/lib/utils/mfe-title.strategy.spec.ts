import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { Title } from '@angular/platform-browser'
import { provideRouter, Router, Routes } from '@angular/router'
import { FakeTopic } from '@onecx/accelerator'
import { Capability } from '@onecx/angular-integration-interface'
import { provideShellCapabilityServiceMock, ShellCapabilityServiceMock } from '@onecx/angular-integration-interface/mocks'
import { DocumentTitle } from '@onecx/integration-interface'
import { provideMfeTitleStrategy } from './mfe-title.strategy'

const mockDocumentTitleTopics: FakeTopic<DocumentTitle>[] = []

jest.mock('@onecx/integration-interface', () => {
  const actual = jest.requireActual('@onecx/integration-interface')
  return {
    ...actual,
    DocumentTitleTopic: jest.fn().mockImplementation(() => {
      const topic = new FakeTopic<DocumentTitle>()
      mockDocumentTitleTopics.push(topic)
      return topic
    }),
  }
})

@Component({ template: '' })
class DummyComponent {}

const routes: Routes = [
  { path: 'search', title: 'Search users', component: DummyComponent },
  { path: 'untitled', component: DummyComponent },
]

function setup(capabilities: Capability[]) {
  ShellCapabilityServiceMock.setCapabilities(capabilities)
  TestBed.configureTestingModule({
    providers: [provideRouter(routes), provideMfeTitleStrategy(), provideShellCapabilityServiceMock()],
  })
  const title = TestBed.inject(Title)
  title.setTitle('Shell title')
  return { router: TestBed.inject(Router), title }
}

function publishedTitles(): DocumentTitle[] {
  const published: DocumentTitle[] = []
  mockDocumentTitleTopics.forEach((topic) => topic.subscribe((message) => published.push(message)))
  return published
}

describe('MfeTitleStrategy', () => {
  beforeEach(() => {
    mockDocumentTitleTopics.length = 0
  })

  describe('given the shell does not support the document title topic', () => {
    it('when navigating to a route with title, then the document title is set', async () => {
      const { router, title } = setup([])

      await router.navigateByUrl('/search')

      expect(title.getTitle()).toBe('Search users')
      expect(mockDocumentTitleTopics).toHaveLength(0)
    })

    it('when navigating to a route without title, then the document title stays unchanged', async () => {
      const { router, title } = setup([])

      await router.navigateByUrl('/untitled')

      expect(title.getTitle()).toBe('Shell title')
    })
  })

  describe('given the shell supports the document title topic', () => {
    it('when navigating to a route with title, then the title and path are published and the document title stays unchanged', async () => {
      const { router, title } = setup([Capability.DOCUMENT_TITLE_TOPIC])

      await router.navigateByUrl('/search')

      expect(publishedTitles()).toEqual([{ title: 'Search users', path: document.location.pathname }])
      expect(title.getTitle()).toBe('Shell title')
    })

    it('when navigating to a route without title, then a message without title is published', async () => {
      const { router } = setup([Capability.DOCUMENT_TITLE_TOPIC])

      await router.navigateByUrl('/untitled')

      expect(publishedTitles()).toEqual([{ title: undefined, path: document.location.pathname }])
    })

    it('when navigating twice, then one topic is reused for both titles', async () => {
      const { router } = setup([Capability.DOCUMENT_TITLE_TOPIC])
      await router.navigateByUrl('/search')

      await router.navigateByUrl('/untitled')

      expect(mockDocumentTitleTopics).toHaveLength(1)
    })

    it('when the application is destroyed, then the topic is destroyed', async () => {
      const { router } = setup([Capability.DOCUMENT_TITLE_TOPIC])
      await router.navigateByUrl('/search')
      let completed = false
      mockDocumentTitleTopics[0].subscribe({ complete: () => (completed = true) })

      TestBed.resetTestingModule()

      expect(completed).toBe(true)
    })
  })
})
