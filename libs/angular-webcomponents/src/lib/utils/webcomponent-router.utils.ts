import { Route, UrlMatcher, UrlSegment, UrlSegmentGroup } from '@angular/router'
import { createLogger } from './logger.utils'

const logger = createLogger('webcomponent-router')

export function startsWith(prefix: string): UrlMatcher {
  return (url: UrlSegment[], _urlSegmentGroup: UrlSegmentGroup, route: Route) => {
    const baseHref = getBaseHrefOfRoute(route)
    if (`/${url.map((s) => s.path).join('/')}/`.startsWith(baseHref)) {
      const urlWithoutBaseHref = sliceBaseHref(route, url)

      const fullUrl = urlWithoutBaseHref.map((u) => u.path).join('/')
      if (fullUrl.startsWith(prefix)) {
        const prefixLength = prefix.split('/').filter((value) => value).length
        return { consumed: url.slice(0, baseHrefSegmentAmount(url, urlWithoutBaseHref) + prefixLength) }
      }
    }
    return null
  }
}

export function getBaseHrefOfRoute(route: Route): string {
  const mfeBaseHref: string = route?.data?.['mfeInfo']?.baseHref
  if (!mfeBaseHref) {
    logger.warn(
      'mfeInfo was not provided for route. initializeRouter function is required to be registered as app initializer.'
    )
  }
  return mfeBaseHref
}

export function sliceBaseHref(route: Route, url: UrlSegment[]): UrlSegment[] {
  const mfeBaseHref = getBaseHrefOfRoute(route)

  const baseHrefSegmentAmount = mfeBaseHref.split('/').filter((value) => value).length
  return url.slice(baseHrefSegmentAmount)
}

export function baseHrefSegmentAmount(url: UrlSegment[], urlWithoutBaseHref: UrlSegment[]) {
  return url.length - urlWithoutBaseHref.length
}
