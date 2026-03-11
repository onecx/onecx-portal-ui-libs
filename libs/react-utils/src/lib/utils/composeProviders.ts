import type { ComponentType } from 'react'

/**
 * Higher-order component type signature for provider wrappers.
 *
 * @param component - Component to wrap with injected props.
 * @returns Wrapped component with injected props applied.
 */
type HOC<InjectedProps, OriginalProps> = (
  component: ComponentType<OriginalProps & InjectedProps>
) => ComponentType<OriginalProps>

/**
 * Composes multiple provider HOCs into a single wrapper.
 *
 * @param providers - Provider HOCs to apply from right to left.
 * @returns A function that wraps a component with all providers.
 */
export const composeProviders =
  <P extends object>(...providers: Array<HOC<any, P>>): ((Component: ComponentType<P>) => ComponentType<P>) =>
  (Component: ComponentType<P>) =>
    providers.reduceRight((AccumulatedComponent, CurrentProvider) => CurrentProvider(AccumulatedComponent), Component)
