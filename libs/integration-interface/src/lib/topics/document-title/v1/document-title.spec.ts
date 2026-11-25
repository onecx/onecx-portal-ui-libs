/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { firstValueFrom } from 'rxjs'
import { DocumentTitle } from './document-title.model'
import { DocumentTitleTopic } from './document-title.topic'

describe('DocumentTitleTopic', () => {
  let topic: DocumentTitleTopic

  beforeEach(() => {
    topic = new DocumentTitleTopic()
  })

  afterEach(() => {
    topic.destroy()
  })

  it('given a document title with a title, when it is published, then subscribers receive it', async () => {
    const message: DocumentTitle = { title: 'Search Users', path: '/admin/user/search' }

    topic.publish(message)
    const received = await firstValueFrom(topic.asObservable())

    expect(received).toEqual(message)
  })

  it('given a document title without a title, when it is published, then subscribers receive only the path', async () => {
    const message: DocumentTitle = { path: '/admin/user' }

    topic.publish(message)
    const received = await firstValueFrom(topic.asObservable())

    expect(received).toEqual({ path: '/admin/user' })
  })
})
