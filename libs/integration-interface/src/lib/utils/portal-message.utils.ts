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

  return {
    ...message,
    severity,
    summary,
    detail,
  }
}

export { buildTranslatedMessage, resolveTranslation }
export type { TranslateFn }
