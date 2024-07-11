import { Route, UrlMatcher, UrlSegment, UrlSegmentGroup } from '@angular/router'

export function startsWith(prefix: string): UrlMatcher {
  return (url: UrlSegment[], UrlSegmentGroup: UrlSegmentGroup, route: Route) => {
    const urlWithoutBaseHref = sliceBaseHref(route, url)

    const fullUrl = urlWithoutBaseHref.map((u) => u.path).join('/')
    if (fullUrl.startsWith(prefix)) {
      const prefixLength = prefix.split('/').filter((value) => value).length
      return { consumed: url.slice(0, baseHrefSegmentAmount(url, urlWithoutBaseHref) + prefixLength) }
    }
    return null
  }
}

export function sliceBaseHref(route: Route, url: UrlSegment[]): UrlSegment[] {
  const mfeBaseHref: string = route?.data?.['mfeInfo']?.baseHref
  if (!mfeBaseHref) {
    console.warn(
      'mfeInfo was not provided for route. initializeRouter function is required to be registered as app initializer.'
    )
  }

  const baseHrefSegmentAmount = mfeBaseHref.split('/').filter((value) => value).length
  return url.slice(baseHrefSegmentAmount)
}

export function baseHrefSegmentAmount(url: UrlSegment[], urlWithoutBaseHref: UrlSegment[]) {
  return url.length - urlWithoutBaseHref.length
}
