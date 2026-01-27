import { Topic, TopicPublisher } from '@onecx/accelerator'
import { TopicResizedEventType } from './topic-resized-event-type'
import { ResizedEventType } from './resized-event-type'
import { SlotResizedEvent } from './slots-resized-type'
import { SlotGroupResizedEvent } from './slot-groups-resized-type'

declare global {
  interface Window {
    '@onecx/integration-interface': {
      // Keys should be equal to event types in ResizedEventType
      resizedEvents?: {
        slot_resized?: string[]
        slot_group_resized?: string[]
      }
    }
  }
}

/**
 * @deprecated TopicPublisher is deprecated and will be removed in future versions. Use Topic instead.
 */
export class ResizedEventsPublisher extends TopicPublisher<TopicResizedEventType> {
  constructor() {
    super('resizedEvents', 1)
  }

  //NOSONAR
  override publish(event: TopicResizedEventType): Promise<void> {
    if (![ResizedEventType.SLOT_GROUP_RESIZED, ResizedEventType.SLOT_RESIZED].includes(event.type)) {
      return super.publish(event)
    }

    const resizedEvent = event as SlotResizedEvent | SlotGroupResizedEvent
    const entityName = eventToEntityName(resizedEvent)

    if (window['@onecx/integration-interface']['resizedEvents']?.[resizedEvent.type]?.includes(entityName)) {
      return super.publish(event)
    }

    return Promise.resolve()
  }
}
export class ResizedEventsTopic extends Topic<TopicResizedEventType> {
  constructor() {
    super('resizedEvents', 1, false)
    window['@onecx/integration-interface'] ??= {}
    window['@onecx/integration-interface']['resizedEvents'] ??= {}
  }

  /**
   * Request resized update events for a specific entity
   * @param eventType - The type of resized event to request
   * @param entityName - The name of the entity (slot or slot group) to request events for
   */
  static requestEvent(
    eventType: ResizedEventType.SLOT_RESIZED | ResizedEventType.SLOT_GROUP_RESIZED,
    entityName: string
  ) {
    window['@onecx/integration-interface'] ??= {}
    window['@onecx/integration-interface']['resizedEvents'] ??= {}
    window['@onecx/integration-interface']['resizedEvents'][eventType] ??= []
    window['@onecx/integration-interface']['resizedEvents'][eventType].push(entityName)

    // Request an initial update when registering to make sure the listener has the latest information
    // Without this, the listener might have to wait until the next resize to get any data
    // Its important that this is called after the listener is registered
    new ResizedEventsPublisher().publish({
      type: ResizedEventType.REQUESTED_EVENTS_CHANGED,
      payload: {
        type: eventType,
        name: entityName,
      },
    })
  }

  //NOSONAR
  override publish(event: TopicResizedEventType): Promise<void> {
    if (![ResizedEventType.SLOT_GROUP_RESIZED, ResizedEventType.SLOT_RESIZED].includes(event.type)) {
      return super.publish(event)
    }

    const resizedEvent = event as SlotResizedEvent | SlotGroupResizedEvent
    const entityName = eventToEntityName(resizedEvent)

    if (window['@onecx/integration-interface']['resizedEvents']?.[resizedEvent.type]?.includes(entityName)) {
      return super.publish(event)
    }

    return Promise.resolve()
  }
}

function eventToEntityName(event: SlotResizedEvent | SlotGroupResizedEvent): string {
  switch (event.type) {
    case ResizedEventType.SLOT_RESIZED:
      return event.payload.slotName
    case ResizedEventType.SLOT_GROUP_RESIZED:
      return event.payload.slotGroupName
  }
}
