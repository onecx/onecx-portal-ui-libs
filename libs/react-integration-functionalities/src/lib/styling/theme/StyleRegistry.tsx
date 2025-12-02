import { ReactNode, useState, useEffect } from 'react'
import { PrimeReactProvider } from 'primereact/api'
import { CurrentThemeTopic } from '@onecx/integration-interface'
import applyThemeVariables from './applyThemeVariables'
import { useAppGlobals } from '../../utils/withAppGlobals'

type Props = Readonly<{
  children?: ReactNode
}>

export default function StyleRegistry({ children }: Props) {
  const [isThemed, setIsThemed] = useState(false)
  const { PRODUCT_NAME } = useAppGlobals()
  const themeStyleId = `${PRODUCT_NAME}|${PRODUCT_NAME}-ui`

  useEffect(() => {
    const themeSubscription = new CurrentThemeTopic().subscribe((theme) => {
      console.log('THEME_UPDATE:', theme)
      applyThemeVariables(theme, themeStyleId)
      setIsThemed(true)
    })

    return () => {
      themeSubscription.unsubscribe()
    }
  }, [themeStyleId ])

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
