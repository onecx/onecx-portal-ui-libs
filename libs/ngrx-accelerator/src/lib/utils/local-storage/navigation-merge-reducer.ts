import deepmerge from 'deepmerge'

export const navigationMergeReducer = (state: any, rehydratedState: any , action: any) => {
    const overwriteMerge = (destinationArray: any, sourceArray: any, options: any) => sourceArray;
    const options: deepmerge.Options = {
      arrayMerge: overwriteMerge
    };
    if(action.type === "@ngrx/router-store/navigation" && action.payload.event.id === 1) {
        state = deepmerge(state, rehydratedState, options);
    }
    return state;
}