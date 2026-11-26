import { AxiosHeaders, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { axiosFactory } from './axios'

const successAdapter = (config: InternalAxiosRequestConfig) =>
  Promise.resolve({ data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config } as AxiosResponse)

const trackingAdapter = (seen: { config?: InternalAxiosRequestConfig }) => (config: InternalAxiosRequestConfig) => {
  seen.config = config
  return successAdapter(config)
}

const installProxy = (updateTokenIfNeeded: () => Promise<boolean>, getHeaderValues: () => Record<string, string>) => {
  window.onecxAuth = {
    authServiceProxy: {
      v1: { updateTokenIfNeeded, getHeaderValues },
    },
  }
}

describe('axiosFactory', () => {
  afterEach(() => {
    delete window.onecxAuth
  })

  it('given the proxy rejects updateTokenIfNeeded with no reason when a request is made then it rejects with the original reason', async () => {
    installProxy(
      () => Promise.reject(),
      () => ({})
    )

    await expect(axiosFactory().get('/api/data', { adapter: successAdapter })).rejects.toBeUndefined()
  })

  it('given the proxy rejects updateTokenIfNeeded with an error when a request is made then it rejects with that error', async () => {
    const reason = new Error('token refresh failed')
    installProxy(
      () => Promise.reject(reason),
      () => ({})
    )

    await expect(axiosFactory().get('/api/data', { adapter: successAdapter })).rejects.toBe(reason)
  })

  it('given there is no onecxAuth proxy when a request is made then it proceeds without auth headers', async () => {
    const seen: { config?: InternalAxiosRequestConfig } = {}
    const response = await axiosFactory().get('/api/data', { adapter: trackingAdapter(seen) })

    expect(response.status).toBe(200)
    expect((seen.config?.headers as AxiosHeaders).has('Authorization')).toBe(false)
  })

  it('given the request targets a whitelisted asset when a request is made then it proceeds without auth headers', async () => {
    installProxy(
      () => Promise.resolve(true),
      () => ({ Authorization: 'Bearer abc' })
    )
    const seen: { config?: InternalAxiosRequestConfig } = {}
    const response = await axiosFactory().get('/assets/config.json', { adapter: trackingAdapter(seen) })

    expect(response.status).toBe(200)
    expect((seen.config?.headers as AxiosHeaders).has('Authorization')).toBe(false)
  })

  it('given the proxy returns mixed truthy and falsy header values when a request is made then only the truthy values are set on the request', async () => {
    installProxy(
      () => Promise.resolve(true),
      () => ({ Authorization: 'Bearer abc', 'apm-principal-token': '', 'x-empty': '' })
    )
    const seen: { config?: InternalAxiosRequestConfig } = {}
    const response = await axiosFactory().get('/api/data', { adapter: trackingAdapter(seen) })

    const headers = seen.config?.headers as AxiosHeaders
    expect(response.status).toBe(200)
    expect(headers.get('Authorization')).toBe('Bearer abc')
    expect(headers.has('apm-principal-token')).toBe(false)
  })
})
