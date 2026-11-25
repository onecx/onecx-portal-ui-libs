/**
 * @jest-environment jsdom
 */
import { firstValueFrom } from 'rxjs'
import { DocumentTitleTopic } from './document-title.topic'

describe('DocumentTitleTopic', () => {
  let topic: DocumentTitleTopic

  beforeEach(() => {
    topic = new DocumentTitleTopic()
  })

  afterEach(() => {
    topic.destroy()
  })

  it('given a published document title, when subscribing, then the title and its path are received', async () => {
    await topic.publish({ title: 'Search users', path: '/admin/user/search' })

    const received = await firstValueFrom(topic.asObservable())

    expect(received).toEqual({ title: 'Search users', path: '/admin/user/search' })
  })

  it('given a published message without title, when subscribing, then the message without title is received', async () => {
    await topic.publish({ path: '/admin/user/search' })

    const received = await firstValueFrom(topic.asObservable())

    expect(received).toEqual({ path: '/admin/user/search' })
  })
})
