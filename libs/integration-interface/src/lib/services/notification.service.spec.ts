/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */
import { NotificationService } from './notification.service'

const createTopic = () => ({ destroy: jest.fn() })

jest.mock('../topics/notification/v1/notification.topic', () => ({
  NotificationTopic: jest.fn(() => createTopic()),
}))

describe('NotificationService', () => {
  let service: NotificationService

  beforeEach(() => {
    service = new NotificationService()
  })

  it('should lazily initialize notificationTopic', () => {
    expect(service.notificationTopic).toBeTruthy()
    expect(service.notificationTopic).toBe(service.notificationTopic)
  })

  it('should allow overriding notificationTopic through setter', () => {
    const topic = createTopic() as any
    service.notificationTopic = topic

    expect(service.notificationTopic).toBe(topic)
  })

  it('should destroy topic on destroy', () => {
    const topic = createTopic() as any
    service.notificationTopic = topic

    service.destroy()

    expect(topic.destroy).toHaveBeenCalledTimes(1)
  })

  it('should not fail when destroy is called before initialization', () => {
    expect(() => service.destroy()).not.toThrow()
  })
})
