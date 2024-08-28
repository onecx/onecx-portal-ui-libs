import deepmerge from 'deepmerge'

export const lazyLoadingMergeReducer = (state: any, rehydratedState: any, _action: any) => {
  const overwriteMerge = (_destinationArray: any, sourceArray: any, _options: any) => sourceArray
  const options: deepmerge.Options = {
    arrayMerge: overwriteMerge,
  }
  const keysToRehydrate = Object.keys(rehydratedState).filter((key) => state[key])
  if (keysToRehydrate.length) {
    const stateToRehydrate = Object.keys(rehydratedState).reduce((acc: Record<string, unknown>, key) => {
      if (keysToRehydrate.includes(key)) {
        acc[key] = rehydratedState[key]
      }
      return acc
    }, {})
    state = deepmerge(state, stateToRehydrate, options)
    keysToRehydrate.forEach((key) => {
      delete rehydratedState[key]
    })
  }
  return state
}
