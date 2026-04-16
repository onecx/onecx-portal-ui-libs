import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import {
  MessageTopic,
  buildPortalMessagePayload,
  resolveTranslation,
  type PortalMessage,
  type TranslateFn,
} from '@onecx/integration-interface'

type Message = PortalMessage

/**
 * Portal message context value shape.
 */
interface PortalMessageContextValue {
  message$: MessageTopic
  /** Publish a success message. */
  success: (msg: Message) => Promise<void>
  /** Publish an info message. */
  info: (msg: Message) => Promise<void>
  /** Publish an error message. */
  error: (msg: Message) => Promise<void>
  /** Publish a warning message. */
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

  const addTranslated = async (severity: string, msg: Message) => {
    const [summary, detail] = await Promise.all([
      resolveTranslation(translate, msg.summaryKey, msg.summaryParameters),
      resolveTranslation(translate, msg.detailKey, msg.detailParameters),
    ])
    const message = buildPortalMessagePayload(severity, msg, summary, detail)
    await message$.publish(message)
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

  return <PortalMessageContext.Provider value={contextValue}>{children}</PortalMessageContext.Provider>
}

export { PortalMessageProvider, usePortalMessage, PortalMessageContext }
export type { PortalMessageContextValue, PortalMessageProviderProps, Message, TranslateFn }
