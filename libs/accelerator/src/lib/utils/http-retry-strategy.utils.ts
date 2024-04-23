import { Observable, mergeMap, throwError, timer } from 'rxjs'

export const httpRetryStrategy =
  ({
    maxRetryAttempts = 3,
    scalingDuration = 1000,
    excludedStatusCodes = [],
  }: {
    maxRetryAttempts?: number
    scalingDuration?: number
    excludedStatusCodes?: number[]
  } = {}) =>
  (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        const retryAttempt = i + 1
        if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find((e) => e === error.status)) {
          return throwError(() => error)
        }
        return timer(retryAttempt * scalingDuration)
      })
    )
  }
