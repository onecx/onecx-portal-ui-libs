import type { ComponentType } from 'react'

/**
 * Higher-order component type signature for provider wrappers.
 */
type HOC<InjectedProps, OriginalProps> = (
  component: ComponentType<OriginalProps & InjectedProps>
) => ComponentType<OriginalProps>

/**
 * Composes multiple provider HOCs into a single wrapper.
 */
export const composeProviders =
  <P extends object>(...providers: Array<HOC<any, P>>): ((Component: ComponentType<P>) => ComponentType<P>) =>
  (Component: ComponentType<P>) =>
    providers.reduceRight((AccumulatedComponent, CurrentProvider) => CurrentProvider(AccumulatedComponent), Component)
