import { createContext, useEffect, useMemo, useRef, type ReactNode, useState, type RefObject } from 'react'
import { attachPrimeReactScoper } from '../../scopingFunctionality'
import { useAppGlobals } from '../../../utils/withAppGlobals'

interface PrimeReactStyleProviderProps {
  children: ReactNode
}

const PrimeReactStyleContext = createContext<{ rootRef: RefObject<HTMLDivElement | null> } | undefined>(undefined)

/**
 * Provides PrimeReact style scoping for remote components.
 *
 * @param children - React subtree rendered within the scoped container.
 * @returns Provider wrapping the scoped subtree.
 */
export const PrimeReactStyleProvider = ({ children }: PrimeReactStyleProviderProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const [isScoped, setIsScoped] = useState(false)
  const { PRODUCT_NAME, REMOTES_NAME } = useAppGlobals()

  const remoteId = `${PRODUCT_NAME}|${REMOTES_NAME}`

  useEffect(() => {
    const detach = attachPrimeReactScoper({
      id: remoteId,
      scopeRootSelector: `[data-style-id="${remoteId}"]`,
      bootstrapExisting: true,
      blockFurtherUpdatesForCapturedIds: true,
      dataPrimereactStyleName: 'remote',
      freezeAfterFirstUpdate: true,
      productName: PRODUCT_NAME,
    })
    setIsScoped(true)
    return () => detach()
  }, [remoteId])

  const contextValue = useMemo(() => ({ rootRef }), [rootRef])

  if (!isScoped) return null // spinner or smthing

  return (
    <PrimeReactStyleContext value={contextValue}>
      <div
        ref={rootRef}
        data-style-id={remoteId}
        data-style-isolation
        data-no-portal-layout-styles
        style={{ display: 'contents' }}
      >
        {children}
      </div>
    </PrimeReactStyleContext>
  )
}
