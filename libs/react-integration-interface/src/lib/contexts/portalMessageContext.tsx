import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { MessageTopic } from '@onecx/integration-interface'

type Message = {
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

type TranslateFn = (key: string, params?: object) => Promise<string> | string

interface PortalMessageContextValue {
  message$: MessageTopic
  success: (msg: Message) => Promise<void>
  info: (msg: Message) => Promise<void>
  error: (msg: Message) => Promise<void>
  warning: (msg: Message) => Promise<void>
}

interface PortalMessageProviderProps {
  children: ReactNode
  value?: Partial<PortalMessageContextValue>
  translate?: TranslateFn
}

const PortalMessageContext = createContext<PortalMessageContextValue | null>(null)

/**
 * Hook to access portal messaging utilities.
 * Must be used within PortalMessageProvider.
 *
 * @returns Portal message helpers and topic.
 * @throws Error when used outside PortalMessageProvider.
 */
const usePortalMessage = (): PortalMessageContextValue => {
  const context = useContext(PortalMessageContext)
  if (!context) {
    throw new Error('usePortalMessage must be used within a PortalMessageProvider')
  }
  return context
}

/**
 * Provides messaging topic helpers with optional translation support.
 *
 * @param children - React subtree consuming portal messaging context.
 * @param value - Optional overrides for message topic or helper functions.
 * @param translate - Optional translation function for message keys.
 * @returns Provider wrapping the given children.
 */
const PortalMessageProvider: React.FC<PortalMessageProviderProps> = ({ children, value, translate }) => {
  const message$ = useMemo(() => value?.message$ ?? new MessageTopic(), [value?.message$])
  const isInternalMessageTopic = !value?.message$

  useEffect(() => {
    return () => {
      if (isInternalMessageTopic) {
        message$.destroy()
      }
    }
  }, [isInternalMessageTopic, message$])

  const resolveTranslation = async (key?: string, params?: object) => {
    if (!key) return undefined
    if (!translate) return key
    return await translate(key, params)
  }

  const addTranslated = async (severity: string, msg: Message) => {
    const [summaryTranslation, detailTranslation] = await Promise.all([
      resolveTranslation(msg.summaryKey, msg.summaryParameters),
      resolveTranslation(msg.detailKey, msg.detailParameters),
    ])

    await message$.publish({
      ...msg,
      severity,
      summary: summaryTranslation,
      detail: detailTranslation,
    })
  }

  const success = (msg: Message) => addTranslated('success', msg)
  const info = (msg: Message) => addTranslated('info', msg)
  const error = (msg: Message) => addTranslated('error', msg)
  const warning = (msg: Message) => addTranslated('warning', msg)

  const contextValue = useMemo(
    () => ({
      message$,
      success,
      info,
      error,
      warning,
    }),
    [message$, translate]
  )

  return <PortalMessageContext value={contextValue}>{children}</PortalMessageContext>
}

export { PortalMessageProvider, usePortalMessage, PortalMessageContext }
export type { PortalMessageContextValue, PortalMessageProviderProps, Message, TranslateFn }
