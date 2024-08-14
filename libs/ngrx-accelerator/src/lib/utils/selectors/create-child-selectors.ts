import { MemoizedSelector, createSelector } from '@ngrx/store'

type Primitive = string | number | bigint | boolean | null | undefined

type ChildSelectors<State extends Record<string, any>, ChildState> = ChildState extends Primitive | unknown[] | Date
  ? Record<string, never>
  : {
      [K in keyof ChildState & string as `select${Capitalize<K>}`]: MemoizedSelector<State, ChildState[K]>
    }

function capitalize<T extends string>(text: T): Capitalize<T> {
  return (text.charAt(0).toUpperCase() + text.substring(1)) as Capitalize<T>
}

export function createChildSelectors<State extends Record<string, any>, ChildState extends Record<string, any>>(
  featureSelector: MemoizedSelector<State, ChildState>,
  initialChildState: ChildState
): ChildSelectors<State, ChildState> {
  return Object.keys(initialChildState).reduce(
    (nestedSelectors, nestedKey) => ({
      ...nestedSelectors,
      [`select${capitalize(nestedKey)}`]: createSelector(featureSelector, (parentState) => parentState?.[nestedKey]),
    }),
    {} as ChildSelectors<State, ChildState>
  )
}
