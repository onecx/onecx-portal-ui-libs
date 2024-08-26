import { Timestamp } from 'rxjs'

export function orderValuesByTimestamp(valuesWithTimestamp: Timestamp<any>[]) {
  return valuesWithTimestamp.sort((a, b) => b.timestamp - a.timestamp).map((obj) => obj.value)
}

function mergeValues(values: any[]) {
  return values.reduce((acc, curr) => {
    return { ...acc, ...curr }
  })
}

export function orderAndMergeValuesByTimestamp(valuesWithTimestamp: Timestamp<any>[]) {
  const sortedValues = valuesWithTimestamp.sort((a, b) => a.timestamp - b.timestamp).map((obj) => obj.value)
  return mergeValues(sortedValues)
}
