import type { ComponentType } from 'react'
import { withBaseProviders } from '../../../utils/withBaseProviders'
import { withAppPrimereactStylesIsolation } from '../withAppPrimereactStylesIsolation'
import { composeProviders } from '../../../utils/composeProviders'
import { withAppStyles } from '../withAppStyles'
import { withAppGlobals } from '../../../utils/withAppGlobals'

interface AppGlobals {
  PRODUCT_NAME: string
  REMOTES_NAME: string
  [key: string]: string | number | boolean
}

/**
 * Wraps an app component with base providers and app-level style isolation.
 *
 * @param Component - App component to wrap.
 * @param appGlobals - App globals required for scoping.
 * @returns Wrapped component with providers applied.
 */
export const withApp = (Component: ComponentType, appGlobals: AppGlobals) =>
  composeProviders(
    (Component: ComponentType) => withAppGlobals(Component, appGlobals),
    withAppPrimereactStylesIsolation,
    withAppStyles,
    withBaseProviders
  )(Component)
