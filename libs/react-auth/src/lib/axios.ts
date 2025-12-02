import axios, {
  AxiosError,
  AxiosHeaders,
  AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

const WHITELIST = ['assets'];
export interface AuthenticatedAxiosInstance extends AxiosInstance {
  tokens: { [key: string]: boolean | string };
}
/**
 * This is the axios instance for client-side requests only to BFF
 */
export const axiosFactory: (baseURL?: string) => AuthenticatedAxiosInstance = (
  baseURL
) => {
  let ai;
  if (baseURL) {
    ai = axios.create({
      baseURL,
    });
  }
  ai = axios.create();

  const aai: AuthenticatedAxiosInstance = Object.assign(ai, {
    tokens: { sessionExpired: false },
  });

  aai.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      if (WHITELIST.some((str) => config.url?.includes(str))) {
        return config;
      }

      if (window.onecxAngularAuth?.authServiceProxy?.v1?.updateTokenIfNeeded) {
        await window.onecxAngularAuth.authServiceProxy.v1.updateTokenIfNeeded();
      }

      const headerValues =
        window.onecxAngularAuth?.authServiceProxy?.v1?.getHeaderValues();

      if (headerValues) {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        Object.entries(headerValues).forEach(([key, value]) => {
          if (value) {
            config.headers.set(key, value);
          }
        });
      }

      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return aai;
};
