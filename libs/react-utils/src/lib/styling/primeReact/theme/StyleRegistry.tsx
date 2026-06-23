import { type ReactNode, useEffect, useMemo } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { CurrentThemeTopic } from '@onecx/integration-interface'
import applyThemeVariables from './applyThemeVariables'
import { getOrCreateScopedStyleContainer } from './scopedStyleContainer'
import { useAppGlobals } from '../../../utils/withAppGlobals'

type Props = Readonly<{
  children?: ReactNode
}>

/**
 * Subscribes to theme updates and applies runtime theme variables.
 *
 * @param children - Component subtree rendered within the scoped PrimeReact provider.
 * @returns PrimeReact provider tree with scoped style container.
 */

export default function StyleRegistry({ children }: Props) {
  const { PRODUCT_NAME } = useAppGlobals()
  const themeStyleId = `${PRODUCT_NAME}|${PRODUCT_NAME}`

  // Per-app Proxy container: intercepts PrimeReact's querySelector/appendChild
  // at runtime to scope style IDs to this product. Works correctly even when
  // PrimeReact is a shared MF singleton loaded by a different app.
  const styleContainer = useMemo(() => getOrCreateScopedStyleContainer(themeStyleId), [themeStyleId])

  useEffect(() => {
    const topic = new CurrentThemeTopic()
    const themeSubscription = topic.subscribe((theme) => {
      applyThemeVariables(theme, themeStyleId)
    })

    return () => {
      themeSubscription.unsubscribe()
      topic.destroy()
    }
  }, [themeStyleId])

  return (
    <PrimeReactProvider value={{ unstyled: false, appendTo: 'self', styleContainer }}>{children}</PrimeReactProvider>
  )
}
