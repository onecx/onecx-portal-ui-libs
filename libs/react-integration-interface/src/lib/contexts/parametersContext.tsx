import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { ParametersTopic } from '@onecx/integration-interface'
import { firstValueFrom, map } from 'rxjs'
import { useAppState } from './appStateContext'
import { useShellCapability } from './shellCapability'
import { Capability } from '@onecx/angular-integration-interface'

type Parameter = boolean | number | string | object

interface ParametersContextValue {
  parameters$: ParametersTopic
  get: <T extends Parameter>(
    key: string,
    defaultValue: T | Promise<T>,
    productName?: string,
    appId?: string
  ) => Promise<T>
}

interface ParametersProviderProps {
  children: ReactNode
  value?: Partial<ParametersContextValue>
}

const ParametersContext = createContext<ParametersContextValue | null>(null)

const useParameters = (): ParametersContextValue => {
  const context = useContext(ParametersContext)
  if (!context) {
    throw new Error('useParameters must be used within a ParametersProvider')
  }
  return context
}

const ParametersProvider: React.FC<ParametersProviderProps> = ({ children, value }) => {
  const { hasCapability } = useShellCapability()
  const { currentMfe$ } = useAppState()
  const parameters$ = useMemo(() => value?.parameters$ ?? new ParametersTopic(), [value?.parameters$])
  const isInternalParametersTopic = !value?.parameters$

  useEffect(() => {
    return () => {
      if (isInternalParametersTopic) {
        parameters$.destroy()
      }
    }
  }, [isInternalParametersTopic, parameters$])

  const get: ParametersContextValue['get'] = async (
    key,
    defaultValue,
    productName = undefined,
    appId = undefined
  ): Promise<any> => {
    if (!hasCapability(Capability.PARAMETERS_TOPIC)) {
      return Promise.resolve(defaultValue)
    }

    let resolvedProductName = productName
    let resolvedAppId = appId

    if (!resolvedProductName) {
      resolvedProductName = await firstValueFrom(currentMfe$.pipe(map((mfe) => mfe.productName)))
    }

    if (!resolvedAppId) {
      resolvedAppId = await firstValueFrom(currentMfe$.pipe(map((mfe) => mfe.appId)))
    }

    const valueResult = await firstValueFrom(
      parameters$.pipe(
        map(
          (payload) =>
            payload.parameters.find(
              (parameter) => parameter.productName === resolvedProductName && parameter.appId === resolvedAppId
            )?.parameters[key] as Parameter | undefined
        )
      )
    )

    if (valueResult === undefined) {
      return Promise.resolve(defaultValue)
    }

    return Promise.resolve(valueResult)
  }

  const contextValue = useMemo(
    () => ({
      parameters$,
      get,
    }),
    [parameters$, get]
  )

  return <ParametersContext.Provider value={contextValue}>{children}</ParametersContext.Provider>
}

export { ParametersProvider, useParameters, ParametersContext }
export type { ParametersContextValue, ParametersProviderProps }
