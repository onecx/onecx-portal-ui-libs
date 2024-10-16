export type NavigatedEventPayload = {
  url: string | undefined
  isFirst: boolean
  history: string[]
}

/**
 * @deprecated Replace with NavigatedEventPayload
 */
export type PayloadNavigatedEvent = NavigatedEventPayload
