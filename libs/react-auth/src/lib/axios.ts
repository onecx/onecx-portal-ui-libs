import axios, { AxiosError, AxiosHeaders, AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { authServiceProxy, MISSING_PROXY_ERROR } from './auth-proxy-service'

/** List of URL substrings that bypass auth headers. */
const WHITELIST = ['assets']

/**
 * Axios instance extended with token metadata.
 */
export interface AuthenticatedAxiosInstance extends AxiosInstance {
  tokens: { [key: string]: boolean | string }
}
/**
 * Create an axios instance for client-side requests to the BFF.
 * @param baseURL - optional base URL for the axios instance.
 * @returns authenticated axios instance with interceptors.
 */
export const axiosFactory: (baseURL?: string) => AuthenticatedAxiosInstance = (baseURL) => {
  const ai = baseURL ? axios.create({ baseURL }) : axios.create()

  const aai: AuthenticatedAxiosInstance = Object.assign(ai, {
    tokens: { sessionExpired: false },
  })

  aai.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (WHITELIST.some((str) => config.url?.includes(str))) {
        return config
      }

      try {
        await authServiceProxy.updateTokenIfNeeded()
      } catch (error) {
        if ((error as Error).message !== MISSING_PROXY_ERROR) {
          throw error
        }
      }

      const headerValues = authServiceProxy.getHeaderValues()

      if (headerValues) {
        if (!config.headers) {
          config.headers = new AxiosHeaders()
        }

        Object.entries(headerValues).forEach(([key, value]) => {
          if (value) {
            config.headers.set(key, value)
          }
        })
      }

      return config
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    }
  )

  return aai
}
