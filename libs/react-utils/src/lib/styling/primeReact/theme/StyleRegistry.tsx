import { type ReactNode, useState, useEffect } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { CurrentThemeTopic } from '@onecx/integration-interface'
import applyThemeVariables from './applyThemeVariables'
import { setupPrimeStyleDeduplication, setupPrimeStyleIdTagging } from './primeStyleRegistry'
import { useAppGlobals } from '@onecx/react-utils/utils'

type Props = Readonly<{
  children?: ReactNode
}>

/**
 * Subscribes to theme updates and renders children after runtime theme initialization.
 *
 * @param children - Component subtree rendered once theme variables are applied.
 * @returns PrimeReact provider tree after theme initialization, otherwise null.
 */
export default function StyleRegistry({ children }: Props) {
  const [isThemed, setIsThemed] = useState(false)
  const { PRODUCT_NAME } = useAppGlobals()
  const themeStyleId = `${PRODUCT_NAME}|${PRODUCT_NAME}`

  useEffect(() => {
    const cleanupDeduplication = setupPrimeStyleDeduplication()
    const cleanupTagging = setupPrimeStyleIdTagging(themeStyleId)

    return () => {
      cleanupTagging()
      cleanupDeduplication()
    }
  }, [themeStyleId])

  useEffect(() => {
    const themeSubscription = new CurrentThemeTopic().subscribe((theme) => {
      applyThemeVariables(theme, themeStyleId)
      setIsThemed(true)
    })

    return () => {
      themeSubscription.unsubscribe()
    }
  }, [themeStyleId])

  if (!isThemed) {
    return null
  }

  return (
    <PrimeReactProvider
      value={{
        unstyled: false,
        appendTo: 'self',
      }}
    >
      {children}
    </PrimeReactProvider>
  )
}
