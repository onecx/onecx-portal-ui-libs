import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'
import { catchError, firstValueFrom, mergeMap, of, throwError } from 'rxjs'
import { Location } from '@angular/common'
import { createLogger } from './logger.utils'

const logger = createLogger('fetch-app-css')

/**
 * Fetches the css for an application.
 * @param http - http client for making requests
 * @param appUrl - url of the application used for making requests
 * @returns {Promise<string | undefined | null>} application css content
 */
export async function fetchAppCss(http: HttpClient, appUrl: string): Promise<string | undefined | null> {
  return await firstValueFrom(
    http
      .get(Location.joinWithSlash(appUrl, 'styles.css'), {
        headers: createCssRequestHeaders(),
        observe: 'response',
        responseType: 'text',
      })
      .pipe(
        mergeMap((response) => {
          if (!isResponseValidCss(response)) {
            return throwError(
              () =>
                new Error(
                  `Application returned different content type than text/css: ${response.headers.get('Content-Type')}. Please, make sure that the application exposes the styles.css file.`
                )
            )
          }

          return of(response.body)
        }),
        catchError((error: Error) => {
          logger.error(
            `Error while loading app css for ${appUrl}: ${error.message}.  Please, make sure that the application exposes the styles.css file in your application.`
          )
          return of(undefined)
        })
      )
  )
}

/**
 * Creates HttpHeaders for Css request.
 */
export function createCssRequestHeaders() {
  return new HttpHeaders({}).set('Accept', 'text/css')
}

/**
 * Returns if response is valid css.
 * @param response - response to validate
 * @returns {boolean} if response is valid css
 */
export function isResponseValidCss<T>(response: HttpResponse<T>) {
  return response.headers.get('Content-Type')?.includes('text/css')
}