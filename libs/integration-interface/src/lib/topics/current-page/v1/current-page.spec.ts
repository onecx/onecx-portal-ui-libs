/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { CurrentPageTopic } from './current-page.topic'

describe('CurrentPageTopic', () => {
  const origAddEventListener = window.addEventListener
  const origPostMessage = window.postMessage

  let listeners: any[] = []
  window.addEventListener = (_type: any, listener: any) => {
    listeners.push(listener)
  }

  window.removeEventListener = (_type: any, listener: any) => {
    listeners = listeners.filter((l) => l !== listener)
  }

  window.postMessage = (m: any) => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    listeners.forEach((l) => l({ data: m, stopImmediatePropagation: () => {}, stopPropagation: () => {} }))
  }

  const mutationObserverMock = jest.fn(function MutationObserver(callback) {
    this.observe = jest.fn()
    this.disconnect = jest.fn()
    this.trigger = (mockedMutationsList: any) => {
      callback(mockedMutationsList, this)
    }
    return this
  })
  global.MutationObserver = mutationObserverMock

  afterAll(() => {
    window.addEventListener = origAddEventListener
    window.postMessage = origPostMessage
  })

  let values1: any[]

  let testCurrentPageTopic1: CurrentPageTopic

  const changeLocation = (pathName: string) => {
    window.history.pushState({}, '', pathName)
    mutationObserverMock.mock.instances.forEach((m) => m.trigger())
  }

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000

    jest.restoreAllMocks()
    listeners = []

    values1 = []

    testCurrentPageTopic1 = new CurrentPageTopic()

    testCurrentPageTopic1.subscribe((v: any) => values1.push(v))
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should have `/` if location is not changed initially', () => {
    const expected = [
      {
        path: '/',
        helpArticleId: 'help article id',
        permission: 'permission',
        pageName: 'page name',
        applicationId: 'app id',
      },
    ]

    const pageInfo1 = {
      path: window.location.pathname,
      helpArticleId: 'help article id',
      permission: 'permission',
      pageName: 'page name',
      applicationId: 'app id',
    }

    testCurrentPageTopic1.publish(pageInfo1)

    expect(values1).toEqual(expected)
  })

  it('should have pageInfo with the correct path after changeLocation and publish', () => {
    changeLocation('/test1')

    const expected = [
      undefined,
      {
        path: '/test1',
        helpArticleId: 'help article id',
        permission: 'permission',
        pageName: 'page name',
        applicationId: 'app id',
      },
    ]

    const pageInfo1 = {
      path: window.location.pathname,
      helpArticleId: 'help article id',
      permission: 'permission',
      pageName: 'page name',
      applicationId: 'app id',
    }

    testCurrentPageTopic1.publish(pageInfo1)

    expect(values1).toEqual(expected)
  })

  it('should have undefined if path of changeLocation do not match with path of pageInfo in publish ', () => {
    changeLocation('/test1')

    const expected = [undefined]

    const pageInfo1 = {
      path: '/test2',
      helpArticleId: 'help article id',
      permission: 'permission',
      pageName: 'page name',
      applicationId: 'app id',
    }

    testCurrentPageTopic1.publish(pageInfo1)

    expect(values1).toEqual(expected)
  })

  it('should throw error if document.body is null  ', () => {
    const mock = jest.spyOn(document, 'querySelector')
    mock.mockReturnValue(null)

    expect(() => new CurrentPageTopic()).toThrowError('could not listen to location changes')
  })
})
