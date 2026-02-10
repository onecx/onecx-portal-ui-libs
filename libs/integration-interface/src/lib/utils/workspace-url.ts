import { Endpoint } from '../topics/current-workspace/v1/endpoint.model'
import { Route } from '../topics/current-workspace/v1/route.model'
import type { Workspace } from '../topics/current-workspace/v1/workspace.model'

type EndpointParameters = Record<string, unknown>

const aliasStart = '[['
const aliasEnd = ']]'
const paramStart = '{'
const paramEnd = '}'

/**
 * Joins base and path segments with a single slash.
 *
 * @param base - Base URL segment.
 * @param path - Path segment to append.
 * @returns Joined URL string.
 */
const joinWithSlash = (base: string, path: string): string => {
  let normalizedBase = base
  let normalizedPath = path

  if (!normalizedBase.endsWith('/')) {
    normalizedBase += '/'
  }
  if (normalizedPath.startsWith('/')) {
    normalizedPath = normalizedPath.slice(1)
  }
  return normalizedBase + normalizedPath
}

/**
 * Builds the base URL from the workspace, with warnings on missing values.
 *
 * @param workspace - Workspace definition.
 * @returns Base URL string or empty string if missing.
 */
const constructBaseUrlFromWorkspace = (workspace: Workspace): string => {
  if (!workspace.baseUrl) {
    console.log('WARNING: There was no baseUrl for received workspace.')
    return ''
  }
  return workspace.baseUrl
}

/**
 * Finds a route entry for a product/app pair.
 *
 * @param routes - Available route definitions.
 * @param appId - Application identifier.
 * @param productName - Product name identifier.
 * @returns Matched route or undefined.
 */
const filterRouteFromList = (
  routes: Array<Route> | undefined,
  appId: string,
  productName: string
): Route | undefined => {
  if (!routes) {
    return undefined
  }

  const productRoutes = routes.filter((route) => route.appId === appId && route.productName === productName)

  if (productRoutes.length === 0) {
    return undefined
  }

  if (productRoutes.length > 1) {
    console.log('WARNING: There were more than one route. First route has been used.')
  }

  return productRoutes[0]
}

/**
 * Resolves endpoint aliases to the final endpoint definition.
 *
 * @param endpointName - Endpoint name or alias.
 * @param endpoints - Available endpoint definitions.
 * @returns Resolved endpoint or undefined.
 */
const dissolveEndpoint = (endpointName: string, endpoints: Array<Endpoint>): Endpoint | undefined => {
  let endpoint = endpoints.find((ep) => ep.name === endpointName)

  if (!endpoint) {
    return undefined
  }

  while (endpoint.path?.includes(aliasStart)) {
    const path: string = endpoint.path
    const startIdx = path.indexOf(aliasStart) + aliasStart.length
    const endIdx = path.lastIndexOf(aliasEnd)
    if (endIdx <= startIdx) {
      return undefined
    }
    const aliasName = path.substring(startIdx, endIdx)
    endpoint = endpoints.find((ep) => ep.name === aliasName)

    if (!endpoint) {
      return undefined
    }
  }

  return endpoint
}

/**
 * Normalizes parameter values into strings for URL interpolation.
 *
 * @param value - Parameter value to normalize.
 * @returns Normalized string value.
 */
const getStringFromUnknown = (value: unknown): string => {
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'string') {
    return value
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value)
  }
  if (typeof value === 'symbol') {
    return value.toString()
  }
  return JSON.stringify(value)
}

/**
 * Replaces path parameters with the provided endpoint parameter values.
 *
 * @param path - Endpoint path template.
 * @param endpointParameters - Parameters to inject.
 * @returns Path with parameters resolved, or empty string on failure.
 */
const fillParamsForPath = (path: string, endpointParameters: EndpointParameters): string => {
  while (path.includes(paramStart)) {
    const paramName = path.substring(path.indexOf(paramStart) + paramStart.length, path.indexOf(paramEnd))
    const paramValue = getStringFromUnknown(endpointParameters[paramName])
    if (paramValue && paramValue.length > 0) {
      path = path.replace(paramStart.concat(paramName).concat(paramEnd), paramValue)
    } else {
      console.log(`WARNING: Searched param "${paramName}" was not found in given param list `)
      return ''
    }
  }
  return path
}

/**
 * Constructs a URL path for a concrete endpoint, resolving aliases and params.
 *
 * @param route - Route definition.
 * @param endpointName - Endpoint name or alias.
 * @param endpointParameters - Endpoint parameters for interpolation.
 * @returns Endpoint URL path string.
 */
const constructEndpointUrl = (
  route: Route,
  endpointName: string,
  endpointParameters: EndpointParameters = {}
): string => {
  if (!route.endpoints) {
    return ''
  }
  const finalEndpoint = dissolveEndpoint(endpointName, route.endpoints)
  if (!finalEndpoint?.path) {
    console.log('WARNING: No endpoint or endpoint.path could be found')
    return ''
  }

  const paramsFilled = fillParamsForPath(finalEndpoint.path, endpointParameters)
  if (paramsFilled === undefined) {
    console.log('WARNING: Params could not be filled correctly')
    return ''
  }

  return paramsFilled
}

/**
 * Constructs a full route URL for a workspace, app, and optional endpoint.
 *
 * @param workspace - Workspace definition.
 * @param appId - Application identifier.
 * @param productName - Product name identifier.
 * @param endpointName - Optional endpoint name.
 * @param endpointParameters - Optional endpoint parameters.
 * @returns Resolved route URL string.
 */
const constructRouteUrl = (
  workspace: Workspace,
  appId: string,
  productName: string,
  endpointName?: string,
  endpointParameters?: EndpointParameters
): string => {
  const route = filterRouteFromList(workspace.routes, appId, productName)
  let url = constructBaseUrlFromWorkspace(workspace)
  if (!route) {
    console.log(`WARNING: No route.baseUrl could be found for given appId "${appId}" and productName "${productName}"`)

    return url
  }

  if (route.baseUrl?.length) {
    url = route.baseUrl
  }
  if (endpointName == undefined) {
    return url
  }

  url = joinWithSlash(url, constructEndpointUrl(route, endpointName, endpointParameters))
  return url
}

/**
 * Checks whether a route or endpoint URL exists for the given identifiers.
 *
 * @param workspace - Workspace definition.
 * @param productName - Product name identifier.
 * @param appId - Application identifier.
 * @param endpointName - Optional endpoint name to validate.
 * @returns True if the URL exists.
 */
const doesUrlExistForWorkspace = (
  workspace: Workspace,
  productName: string,
  appId: string,
  endpointName?: string
): boolean => {
  const checkEndpoint = endpointName !== undefined && endpointName.length > 0

  if (!workspace.routes) {
    return false
  }
  const route = filterRouteFromList(workspace.routes, appId, productName)

  if (checkEndpoint) {
    if (!route?.endpoints?.length) {
      return false
    }

    const endpoint = route.endpoints.find((ep) => ep.name === endpointName)
    return !!endpoint?.path?.length
  }

  return !!route?.baseUrl?.length
}

export type { EndpointParameters }
export {
  constructBaseUrlFromWorkspace,
  constructEndpointUrl,
  constructRouteUrl,
  doesUrlExistForWorkspace,
  dissolveEndpoint,
  fillParamsForPath,
  filterRouteFromList,
  getStringFromUnknown,
}
