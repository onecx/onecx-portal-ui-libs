import { createContext, useContext, useEffect, useMemo, useCallback, type ReactNode } from 'react'
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

  const addTranslated = useCallback(
    async (severity: string, msg: Message) => {
      const [summary, detail] = await Promise.all([
        resolveTranslation(translate, msg.summaryKey, msg.summaryParameters),
        resolveTranslation(translate, msg.detailKey, msg.detailParameters),
      ])
      const message = buildPortalMessagePayload(severity, msg, summary, detail)
      await message$.publish(message)
    },
    [translate, message$]
  )

  const success = useCallback((msg: Message) => addTranslated('success', msg), [addTranslated])
  const info = useCallback((msg: Message) => addTranslated('info', msg), [addTranslated])
  const error = useCallback((msg: Message) => addTranslated('error', msg), [addTranslated])
  const warning = useCallback((msg: Message) => addTranslated('warning', msg), [addTranslated])

  const contextValue = useMemo(
    () => ({
      message$,
      success,
      info,
      error,
      warning,
    }),
    [message$, success, info, error, warning]
  )

  return <PortalMessageContext.Provider value={contextValue}>{children}</PortalMessageContext.Provider>
}

export { PortalMessageProvider, usePortalMessage, PortalMessageContext }
export type { PortalMessageContextValue, PortalMessageProviderProps, Message, TranslateFn }
