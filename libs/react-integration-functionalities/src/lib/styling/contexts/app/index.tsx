import { createContext, useEffect, type RefObject, useRef, type ReactNode, useMemo } from 'react'
import { attachPrimeReactScoper } from '../../scopingFunctionality'
import { useAppGlobals } from '../../../utils/withAppGlobals'

interface PrimeReactStyleProviderProps {
  children: ReactNode
}

const PrimeReactStyleContext = createContext<{ rootRef: RefObject<HTMLDivElement | null> } | undefined>(undefined)

export const PrimeReactStyleProvider = ({ children }: PrimeReactStyleProviderProps) => {
  const rootRef = useRef<HTMLDivElement>(null)
  const { PRODUCT_NAME } = useAppGlobals()
  const appId = `${PRODUCT_NAME}|main`

  useEffect(() => {
    const detach = attachPrimeReactScoper({
      id: appId,
      productName: PRODUCT_NAME,
      scopeRootSelector: `[data-style-id="${appId}"]`,
      bootstrapExisting: true,
      blockFurtherUpdatesForCapturedIds: false,
    })

    return () => detach()
  }, [appId])

  const contextValue = useMemo(() => ({ rootRef }), [rootRef])

  return (
    <PrimeReactStyleContext.Provider value={contextValue}>
      <div
        ref={rootRef}
        data-style-id={appId}
        data-style-isolation
        data-no-portal-layout-styles
        style={{ display: 'contents' }}
      >
        {children}
      </div>
    </PrimeReactStyleContext.Provider>
  )
}
