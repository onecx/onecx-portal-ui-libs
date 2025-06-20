export class ImageLogoUrlUtils {
  public static createLogoUrl(apiPrefix: string, url?: string): string | undefined {
    //if the url is from the backend, then we insert the apiPrefix
    if ((url && !url.match(/^(http|https)/g)) ) {
      return apiPrefix + url
    } else {
      return url
    }
  }
}