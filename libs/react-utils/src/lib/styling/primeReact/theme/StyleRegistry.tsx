import { type ReactNode, useState, useEffect } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { CurrentThemeTopic } from '@onecx/integration-interface'
import applyThemeVariables from './applyThemeVariables'
import { useAppGlobals } from '../../../utils/withAppGlobals'

type Props = Readonly<{
  children?: ReactNode
}>

export default function StyleRegistry({ children }: Props) {
  const [isThemed, setIsThemed] = useState(false)
  const { PRODUCT_NAME } = useAppGlobals()
  const themeStyleId = `${PRODUCT_NAME}|${PRODUCT_NAME}`
  const appPrimeStyleSuffix = themeStyleId

  useEffect(() => {
    const tagPrimeStyle = (styleElement: HTMLStyleElement) => {
      const styleId = styleElement.dataset.primereactStyleId
      if (!styleId) return
      if (styleId.includes('|')) return

      styleElement.dataset.primereactStyleId = `${styleId}-${appPrimeStyleSuffix}`
    }

    const processAddedNode = (node: Node) => {
      if (node instanceof HTMLStyleElement) {
        tagPrimeStyle(node)
        return
      }
      if (!(node instanceof Element)) return

      node
        .querySelectorAll('style[data-primereact-style-id]')
        .forEach((element) => tagPrimeStyle(element as HTMLStyleElement))
    }

    const observeMutations: MutationCallback = (records) => {
      for (const record of records) {
        if (record.type !== 'childList') continue
        record.addedNodes.forEach(processAddedNode)
      }
    }

    document.head
      .querySelectorAll('style[data-primereact-style-id]')
      .forEach((element) => tagPrimeStyle(element as HTMLStyleElement))

    const observer = new MutationObserver(observeMutations)

    observer.observe(document.head, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [appPrimeStyleSuffix])

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
    return null // Can be spinner or skeleton here
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
