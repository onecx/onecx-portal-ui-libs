import type { ParametersTopicPayload } from '../topics/parameters/v1/parameters.topic'

type ParameterValue = boolean | number | string | object

/**
 * Finds a parameter value for the given product/app identifiers.
 *
 * @param payload - Parameters topic payload.
 * @param key - Parameter key to resolve.
 * @param productName - Product name identifier.
 * @param appId - Application identifier.
 * @returns Resolved parameter value or undefined.
 */
const findParameterValue = (
  payload: ParametersTopicPayload,
  key: string,
  productName: string,
  appId: string
): ParameterValue | undefined => {
  return payload.parameters.find((parameter) => parameter.productName === productName && parameter.appId === appId)
    ?.parameters[key]
}

export { findParameterValue }
export type { ParameterValue }
