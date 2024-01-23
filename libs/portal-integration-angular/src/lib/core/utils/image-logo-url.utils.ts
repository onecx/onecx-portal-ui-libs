import { API_PREFIX } from '../../api/constants'

export class ImageLogoUrlUtils {
  public static createLogoUrl(url?: string): string | null {
    //if the url is from the backend, then we insert the apiPrefix
    if (url && !url.match(/^(http|https)/g)) {
      return API_PREFIX + url
    } else {
      return url || null
    }
  }
}