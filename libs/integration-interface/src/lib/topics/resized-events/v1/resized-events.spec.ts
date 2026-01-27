/**
 * The test environment that will be used for testing.
 * The default environment in Jest is a Node.js environment.
 * If you are building a web app, you can use a browser-like environment through jsdom instead.
 *
 * @jest-environment jsdom
 */

import { ResizedEventType } from './resized-event-type'
import { ResizedEventsTopic } from './resized-events.topic'
import { RequestedEventsChangedEvent } from './resized-update-requested-type'
import { SlotGroupResizedEvent } from './slot-groups-resized-type'
import { SlotResizedEvent } from './slots-resized-type'
import { TopicResizedEventType } from './topic-resized-event-type'

describe('ResizedEventsTopic', () => {
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

  let topicValues: TopicResizedEventType[]

  let resizedEventsTopic: ResizedEventsTopic

  beforeEach(() => {
    window['@onecx/accelerator'] ??= {}
    window['@onecx/accelerator'].topic ??= {}
    window['@onecx/accelerator'].topic.initDate = Date.now() - 1000000

    jest.restoreAllMocks()
    listeners = []
    topicValues = []

    resizedEventsTopic = new ResizedEventsTopic()
    resizedEventsTopic.subscribe((value) => {
      topicValues.push(value)
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should initialize window properties', () => {
    expect(window['@onecx/integration-interface']).toBeDefined()
    expect(window['@onecx/integration-interface']['resizedEvents']).toBeDefined()
  })

  it('should request resized event for an entity', () => {
    ResizedEventsTopic.requestEvent(ResizedEventType.SLOT_RESIZED, 'test-slot')

    expect(window['@onecx/integration-interface']?.['resizedEvents']?.[ResizedEventType.SLOT_RESIZED]).toContain(
      'test-slot'
    )
    expect(topicValues.length).toBe(1)
    const value = topicValues[0] as RequestedEventsChangedEvent
    expect(value.type).toBe(ResizedEventType.REQUESTED_EVENTS_CHANGED)
    expect(value.payload.type).toBe(ResizedEventType.SLOT_RESIZED)
    expect(value.payload.name).toBe('test-slot')
  })

  it('should publish if not slot group or slot resized event', async () => {
    const event: TopicResizedEventType = {
      type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
      payload: {
        type: ResizedEventType.SLOT_RESIZED,
        name: 'test-slot',
      },
    }

    await resizedEventsTopic.publish(event)

    expect(topicValues.length).toBe(1)
    expect(topicValues[0]).toBe(event)
  })

  describe('SlotResizedEvent', () => {
    it('should publish if someone requested slot resized event for the entity', async () => {
      ResizedEventsTopic.requestEvent(ResizedEventType.SLOT_RESIZED, 'test-slot')

      expect(topicValues.length).toBe(1) // from the requestEvent call
      topicValues = [] // reset for easier testing

      const event: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'test-slot',
          slotDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(1)
      expect(topicValues[0]).toBe(event)
    })

    it('should not publish if no one requested slot resized event for the entity', async () => {
      const event: SlotResizedEvent = {
        type: ResizedEventType.SLOT_RESIZED,
        payload: {
          slotName: 'unrequested-slot',
          slotDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(0)
    })
  })

  describe('SlotGroupResizedEvent', () => {
    it('should publish if someone requested slot group resized event for the entity', async () => {
      ResizedEventsTopic.requestEvent(ResizedEventType.SLOT_GROUP_RESIZED, 'test-slot-group')

      expect(topicValues.length).toBe(1) // from the requestEvent call
      topicValues = [] // reset for easier testing

      const event: SlotGroupResizedEvent = {
        type: ResizedEventType.SLOT_GROUP_RESIZED,
        payload: {
          slotGroupName: 'test-slot-group',
          slotGroupDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(1)
      expect(topicValues[0]).toBe(event)
    })

    it('should not publish if no one requested slot group resized event for the entity', async () => {
      const event: SlotGroupResizedEvent = {
        type: ResizedEventType.SLOT_GROUP_RESIZED,
        payload: {
          slotGroupName: 'unrequested-slot-group',
          slotGroupDetails: {
            width: 100,
            height: 200,
          },
        },
      }

      await resizedEventsTopic.publish(event)

      expect(topicValues.length).toBe(0)
    })
  })
})
