import { Route, UrlMatcher, UrlSegment, UrlSegmentGroup } from '@angular/router'

export function match(prefix: string): UrlMatcher {
  return (url: UrlSegment[], UrlSegmentGroup: UrlSegmentGroup, route: Route) => {
    const mfeBaseHref: string = route?.data?.['mfeInfo']?.baseHref
    if (!mfeBaseHref) {
      console.warn('mfeInfo was not provided for route')
    }
    const baseHrefSegmentAmount = mfeBaseHref.split('/').filter((value) => value).length
    const urlWithoutBaseHref = url.slice(baseHrefSegmentAmount)
    const index = prefix === '' ? 0 : urlWithoutBaseHref.findIndex((u) => u.path === prefix)
    if (index >= 0) {
      return { consumed: url.slice(0, index + baseHrefSegmentAmount) }
    }
    return null
  }
}
