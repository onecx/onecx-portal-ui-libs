import { type ReactNode, useState, useEffect, useMemo } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { CurrentThemeTopic } from '@onecx/integration-interface'
import applyThemeVariables from './applyThemeVariables'
import { getOrCreateScopedStyleContainer } from './scopedStyleContainer'
import { useAppGlobals } from '../../../utils/withAppGlobals'

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

  // Per-app Proxy container: intercepts PrimeReact's querySelector/appendChild
  // at runtime to scope style IDs to this product. Works correctly even when
  // PrimeReact is a shared MF singleton loaded by a different app.
  const styleContainer = useMemo(() => getOrCreateScopedStyleContainer(themeStyleId), [themeStyleId])

  useEffect(() => {
    const themeSubscription = new CurrentThemeTopic().subscribe((theme) => {
      applyThemeVariables(theme, themeStyleId)
      setIsThemed(true)
    })

    return () => {
      themeSubscription.unsubscribe()
    }
  }, [themeStyleId])

  if (!isThemed) return null

  return (
    <PrimeReactProvider value={{ unstyled: false, appendTo: 'self', styleContainer }}>{children}</PrimeReactProvider>
  )
}
