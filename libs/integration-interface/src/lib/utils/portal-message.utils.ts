export type PortalMessage = {
  summaryKey?: string
  summaryParameters?: object
  detailKey?: string
  detailParameters?: object
  id?: any
  key?: string
  life?: number
  sticky?: boolean
  closable?: boolean
  data?: any
  icon?: string
  contentStyleClass?: string
  styleClass?: string
}

type TranslateFn = (key: string, params?: object) => Promise<string> | string | undefined

/**
 * Builds a portal message payload with resolved summary and detail.
 *
 * @param severity - Message severity.
 * @param message - Original message payload.
 * @param summary - Resolved summary string.
 * @param detail - Resolved detail string.
 * @returns Message payload ready for publish.
 */
const buildPortalMessagePayload = (
  severity: string,
  message: PortalMessage,
  summary?: string,
  detail?: string
): PortalMessage & { severity: string; summary?: string; detail?: string } => ({
  ...message,
  severity,
  summary,
  detail,
})

/**
 * Resolves a translated string for the given message key.
 *
 * @param translate - Translation function to use.
 * @param key - Translation key.
 * @param params - Translation parameters.
 * @returns Translated string or undefined when no key exists.
 */
const resolveTranslation = async (
  translate: TranslateFn | undefined,
  key?: string,
  params?: object
): Promise<string | undefined> => {
  if (!key) {
    return undefined
  }

  if (!translate) {
    return key
  }

  return await translate(key, params)
}

/**
 * Builds a translated message payload with resolved summary and detail.
 *
 * @param severity - Message severity.
 * @param message - Original message payload.
 * @param translate - Optional translation helper.
 * @returns Message payload ready for publish.
 */
const buildTranslatedMessage = async (
  severity: string,
  message: PortalMessage,
  translate?: TranslateFn
): Promise<PortalMessage & { severity: string; summary?: string; detail?: string }> => {
  const [summary, detail] = await Promise.all([
    resolveTranslation(translate, message.summaryKey, message.summaryParameters),
    resolveTranslation(translate, message.detailKey, message.detailParameters),
  ])

  return buildPortalMessagePayload(severity, message, summary, detail)
}

export { buildPortalMessagePayload, buildTranslatedMessage, resolveTranslation }
export type { TranslateFn }
